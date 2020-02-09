import * as Discord from "discord.js";

import Context from "./Context";
import ControllerWithChannel from "$bot/ControllerWithChannel";
import {Message, MessageEmbed} from "discord.js";
import {BOUNTY_CANCEL_REACTION, BOUNTY_COMPLETE_REACTION} from "$bot/Common";
import {getName} from "$bot/Util";

/**
 * The controller for bounty requests.
 */
export default class HackamonSpawnController extends ControllerWithChannel {

	private _channel!: Discord.Channel;

	protected config: Config;

	protected channel_names: string[];

	public constructor(context: Context, config: Config) {
		super(context);
		this.channel_names = [config.request_channel];
		this.config = config;

		this.onDiscord('message', this._onMessage);
		// this.onDiscord('messageReactionAdd', this._onReaction);
	}

	private async _onMessage(message: Discord.Message) {
		if (message.channel.id !== this.channel.get(this.config.request_channel)!.id) return;
		if (message.author.id === this.context.discord.user!.id) return;

		const authorId = message.author.id;
		const authorName = await getName(this.context, message.author);
		const request = message.cleanContent;
		const reward = null;

		// Send the embed.
		const reply = await message.channel.send(
			new MessageEmbed()
				.setTitle("Bounty Request")
				.setDescription(request)
				.setFooter(`Posted by: ${authorName}`)
		) as Message;

		// Create the bounty.
		const bounty = await this.context.manager.bounty.post({
			id: reply.id,
			bounty: request,
			authorId,
			authorName,
			reward
		});

		// Delete the original.
		await message.delete();

		// Post reactions.
		await reply.react(BOUNTY_COMPLETE_REACTION);
		await reply.react(BOUNTY_CANCEL_REACTION);

		// Log.
		this.context.logger.info("Posted bounty.", bounty, {author: authorName});
	}

}

export interface Config {

	/**
	 * The channel where requests are made and posted.
	 */
	request_channel: string;

}
