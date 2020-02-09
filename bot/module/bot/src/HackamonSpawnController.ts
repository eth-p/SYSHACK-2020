import * as Discord from "discord.js";

import Context from "./Context";
import ControllerWithChannel from "$bot/ControllerWithChannel";
import {Message, MessageEmbed, TextChannel} from "discord.js";
import {BOUNTY_CANCEL_REACTION, BOUNTY_COMPLETE_REACTION} from "$bot/Common";
import {getName} from "$bot/Util";
import Hackamon from "$hackamon/Hackamon";
import HackamonInstance from "$hackamon/HackamonInstance";

/**
 * The controller for spawning hackamons.
 */
export default class HackamonSpawnController extends ControllerWithChannel {

	protected config: Config;

	protected channel_names: string[];

	public constructor(context: Context, config: Config) {
		super(context);
		this.channel_names = [config.spawn_channel];
		this.config = config;

		this.context.manager.hackamon.on('spawn', this._onSpawn.bind(this)); // TODO: Remove me on destroy.
	}

	private async _onSpawn(hackamon: Hackamon, instance: HackamonInstance) {
		const channel = this.channel.get(this.config.spawn_channel)! as TextChannel;
		const imageUrl = this.context.manager.hackamon.hackamonLoader.getImageUrl(hackamon, instance);

		const message = new MessageEmbed()
			.setColor(instance.shiny ? 0xffe357 : 0xaddcff)
			.setTitle(`A wild ${hackamon.name} appeared!`)
			.setImage(imageUrl)
			.setFooter("React to catch it!");

		// Handle the
		const sent = await channel.send(message);

		instance.id = sent.id;
		await this.context.manager.wild_hackamon.spawn(hackamon, instance);
	}

	// TODO: Proper listener removal.

}

export interface Config {

	/**
	 * The channel where requests are made and posted.
	 */
	spawn_channel: string;

}
