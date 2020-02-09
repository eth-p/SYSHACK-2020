import * as Discord from "discord.js";

import Context from "./Context";
import ControllerWithChannel from "$bot/ControllerWithChannel";
import {BOUNTY_CANCEL_REACTION, BOUNTY_COMPLETE_REACTION} from "$bot/Common";
import {reply} from "$bot/Util";

/**
 * The controller for bounty request cancellations.
 */
export default class BountyCancelController extends ControllerWithChannel {

	protected config: Config;

	protected channel_names: string[];

	public constructor(context: Context, config: Config) {
		super(context);
		this.channel_names = [config.request_channel];
		this.config = config;

		this.onDiscord('messageReactionAdd', this._onReaction);
	}

	private async _onReaction(reaction: Discord.MessageReaction, user: Discord.User) {
		if (reaction.emoji.name !== BOUNTY_CANCEL_REACTION) return;
		if (reaction.message.channel.id !== this.channel.get(this.config.request_channel)!.id) return;
		if (user.id === this.context.discord.user!.id) return;

		// Check if it's a bounty.
		const bounty = await this.context.manager.bounty.find(reaction.message.id);

		if (bounty == null) {
			await reply(this.context, user, 'That bounty was already completed.');
			return;
		}

		if (bounty.authorId !== user.id) {
			await reply(this.context, user, "You can't delete somebody else's bounty!");
			return;
		}

		// Remove the bounty.
		await Promise.all([
			this.context.manager.bounty.cancel(bounty),
			reaction.message.delete().catch(() => {
				this.context.logger.warn("Could not remove bounty message.", bounty, reaction.message.id);
			})
		]);

		// Log.
		this.context.logger.info("Cancelled bounty.", bounty);
	}

}

export interface Config {

	/**
	 * The channel where requests are made and posted.
	 */
	request_channel: string;

}
