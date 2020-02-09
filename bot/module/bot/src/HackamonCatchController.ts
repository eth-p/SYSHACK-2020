import * as Discord from "discord.js";

import Context from "./Context";
import ControllerWithChannel from "$bot/ControllerWithChannel";
import {reply} from "$bot/Util";
import {MessageEmbed} from "discord.js";

/**
 * The controller for catching wild Hackamon.
 */
export default class HackamonCatchController extends ControllerWithChannel {

	protected config: Config;

	protected channel_names: string[];

	public constructor(context: Context, config: Config) {
		super(context);
		this.channel_names = [config.spawn_channel];
		this.config = config;

		this.onDiscord('messageReactionAdd', this._onReactionCompletion);
	}

	private async _onReactionCompletion(reaction: Discord.MessageReaction, user: Discord.User) {
		if (reaction.message.channel.id !== this.channel.get(this.config.spawn_channel)!.id) return;

		// Check if it's a wild Hackamon.
		const hackamon = await this.context.manager.wild_hackamon.find(reaction.message.id);
		if (hackamon == null) {
			await reply(this.context, user, 'Somebody already caught that Hackamon.');
			return;
		}

		// Claim the wild hackamon.
		await this.context.manager.wild_hackamon.claim(hackamon.id!, user.id);
		const hackamonDescriptor = this.context.manager.hackamon.descriptor(hackamon.hackamon)!;

		// Remove the spawn message.
		if (reaction.message != null) {
			reaction.message.delete().catch(() => {
				this.context.logger.warn("Could not remove bounty message.", reaction.message.id);
			});
		}


		// Notify the user.
		const theReply = await reply(this.context, user,
			new MessageEmbed()
				.setTitle(`You caught a ${hackamonDescriptor?.name}!`)
				.setImage(this.context.manager.hackamon.hackamonLoader.getImageUrl(hackamonDescriptor, hackamon))
			, this.config.notification_channel
		);

		// Log.
		this.context.logger.info("User caught a hackamon!", {hackamon}, {name: user.tag, id: user.id});
	}

}

export interface Config {

	/**
	 * The channel where requests are made and posted.
	 */
	spawn_channel: string;

	notification_channel: string;

}
