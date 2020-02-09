import * as Discord from "discord.js";
import {EventEmitter as Emitter} from "events";

import BountyRequestController from "$bot/BountyRequestController";
import BountyCancelController from "$bot/BountyCancelController";
import Context from "./Context";
import Controller from "./Controller";
import BountyCompleteController from "$bot/BountyCompleteController";

/**
 * The bot running on some server.
 */
export default class BotInstance extends Emitter {

	protected context: Context;
	protected server: Discord.Guild;

	public controllers: Map<string, Controller>;

	/**
	 * Creates a new bot instance.
	 * @param context The instance context.
	 */
	public constructor(context: Context) {
		super();

		context.instance = this;

		this.controllers = new Map();
		this.context = context;
		this.server = context.discord_server;

		this.controllers.set('BountyRequestController', new BountyRequestController(context, context.config.bounty));
		this.controllers.set('BountyCancelController', new BountyCancelController(context, context.config.bounty));
		this.controllers.set('BountyCompleteController', new BountyCompleteController(context, context.config.bounty));
	}

	public async refresh() {
		await Promise.all(Array.from(this.controllers.values()).map(c => c.refresh()));
	}

	public async destroy() {
		await Promise.all(Array.from(this.controllers.values()).map(c => c.destroy()));
	}

}
