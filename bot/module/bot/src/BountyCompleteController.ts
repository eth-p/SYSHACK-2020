import * as Discord from "discord.js";

import Context from "./Context";
import ControllerWithChannel from "$bot/ControllerWithChannel";
import {BOUNTY_CANCEL_REACTION, BOUNTY_COMPLETE_REACTION} from "$bot/Common";
import {getName, reply} from "$bot/Util";
import {MessageEmbed, TextChannel} from "discord.js";
import BountyId from "$bounty/BountyId";
import Bounty from "$bounty/Bounty";

/**
 * The controller for bounty request completions.
 */
export default class BountyCompleteController extends ControllerWithChannel {

	protected config: Config;

	protected channel_names: string[];
	protected completion_map: Map<string, { bountyId: BountyId, userId: string }>; // TODO: Permanently store this map.

	public constructor(context: Context, config: Config) {
		super(context);
		this.channel_names = [config.request_channel, config.log_channel];
		this.config = config;
		this.completion_map = new Map();

		this.onDiscord('messageReactionAdd', this._onReactionCompletion);
		this.onDiscord('messageReactionAdd', this._onReactionCompletionConfirmation);
	}

	private async _onReactionCompletion(reaction: Discord.MessageReaction, user: Discord.User) {
		if (reaction.emoji.name !== BOUNTY_COMPLETE_REACTION) return;
		if (reaction.message.channel.id !== this.channel.get(this.config.request_channel)!.id) return;
		if (user.id === this.context.discord.user!.id) return;

		// Check if it's a bounty.
		const bounty = await this.context.manager.bounty.find(reaction.message.id);
		if (bounty == null) {
			await reply(this.context, user, 'That bounty was already completed.');
			return;
		}

		if (bounty.authorId === user.id) {
			await reply(this.context, user, "You can't complete your own bounty!");
			return;
		}

		// Notify the user.
		const theReply = await reply(this.context, bounty.authorId,
			new MessageEmbed()
				.setTitle((await getName(this.context, user)) + ' completed your bounty!')
				.setDescription(bounty.message)
				.setFooter('React to this message to confirm!')
			, this.config.notification_channel
		);

		this.completion_map.set(((theReply instanceof Array) ? theReply.pop()! : theReply).id, {
			bountyId: bounty.id,
			userId: user.id
		});

		// Log.
		this.context.logger.info("User said they completed bounty.", {bounty}, {name: user.tag, id: user.id});
	}

	private async _onReactionCompletionConfirmation(reaction: Discord.MessageReaction, user: Discord.User) {
		const completionInfo = this.completion_map.get(reaction.message.id);
		if (completionInfo == null) return;

		// Check if it's a bounty.
		const bounty = await this.context.manager.bounty.find(completionInfo.bountyId);
		if (bounty == null) {
			await reply(this.context, user, 'That bounty was already completed.');
			return;
		}

		// Check if it's the correct person reacting.
		console.log(bounty.authorId, user.id);
		if (user.id !== bounty.authorId) return;

		// Complete the bounty.
		await this.completeBounty(bounty, await this.context.discord.users.fetch(completionInfo.userId));
	}

	private async completeBounty(bounty: Bounty<unknown>, completer: Discord.User) {
		const bountyChannel = this.channel.get(this.config.request_channel) as TextChannel;
		const message = await bountyChannel.messages.fetch(bounty.id);

		// Remove the bounty message.
		if (message != null) {
			message.delete().catch(() => {
				this.context.logger.warn("Could not remove bounty message.", bounty, message.id);
			})
		}

		// Complete the bounty.
		await Promise.all([
			this.context.manager.bounty.complete(bounty, completer)
		]);

		// Notify the users.
		const logChannel = this.channel.get(this.config.log_channel) as TextChannel;
		await logChannel.send(new MessageEmbed()
			.setTitle(await getName(this.context, completer))
			.setDescription("Completed a bounty!\n\n" + bounty.message.split("\n").map(l => `> ${l}`).join("\n"))
			.setColor(0x00FF00)
		);

		await reply(this.context, completer, new MessageEmbed()
			.setTitle("Great job completing that bounty!")
			.setDescription('You have been awarded a Hackachip!')
			.setColor(0xabeb34)
		);

		// Log.
		this.context.logger.info("Bounty completed.", bounty, {
			name: completer.tag,
			id: completer.id
		});
	}

}

export interface Config {

	/**
	 * The channel where requests are made and posted.
	 */
	request_channel: string;

	/**
	 * The channel where completed bounties are posted.
	 */
	log_channel: string;

	/**
	 * The channel where completed bounties are posted.
	 */
	notification_channel: string;

}
