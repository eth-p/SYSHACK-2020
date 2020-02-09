import * as Discord from "discord.js";
import * as Winston from "winston";
import {EventEmitter as Emitter} from "events";
import {Logger} from "winston";

import BountyManager from "$bounty/BountyManager";

import BotInstance from "./BotInstance";
import Context from "./Context";
import HackamonManager from "$hackamon/HackamonManager";

/**
 * The main bot class.
 */
export default class BotMain extends Emitter {

	// public static readonly CLIENT_ID    = (process.env['DISCORD_CLIENT_ID'] as string) ?? null;
	// public static readonly INVITE_LINK  = (process.env['DISCORD_INVITE'] as string) ?? null;
	//
	// public static readonly INVITE_PERMS = 336067696;
	// public static readonly INVITE_URL   = `https://discordapp.com/api/oauth2/authorize?client_id={id}&scope=bot&permissions={perms}`;

	private _config: Config;
	private client: Discord.Client;

	protected debug: Logger;
	protected logger: Logger;

	protected managers: Managers;
	protected servers: Map<string, BotInstance>;

	/**
	 * Creates a new bot.
	 * @param config The bot config.
	 */
	public constructor(config: Config, managers: Managers) {
		super();

		this._config = config;
		this.servers = new Map();
		this.managers = managers;

		this.client = new Discord.Client({ partials: Object.values(Discord.Constants.PartialTypes) });

		// Setup.
		this.debug = config.debug ?? Winston.createLogger({transports: []});
		this.logger = config.logger ?? this.debug;

		// Hooks.
		this.client.on('ready', () => {
			this.logger.info("Connected to Discord.", {user: this.client.user!.tag, id: this.client.user!.id});
			this._refreshServers().catch(error => this.emit('error', error));
		});
	}

	/**
	 * Start the bot.
	 */
	public async connect() {
		this.logger.info("Connecting to Discord...");
		await this.client.login(this._config.token);
	}

	/**
	 * Disconnect the bot.
	 */
	public async disconnect() {
		this.logger.info("Disconnecting from Discord...");
		await this.client.destroy();
	}

	/**
	 * Refreshes the server map.
	 */
	private async _refreshServers(): Promise<void> {
		let promises: Promise<void>[] = [];
		for (const server of this.client.guilds.array()) {
			if (this.servers.has(server.id)) {
				continue;
			}

			const logger = this.logger.child({server: server.id});
			const debug = this.debug.child({server: server.id});

			const context = {
				config: {...this._config.config, token: null},
				discord: this.client,
				discord_server: server,
				manager: this.managers,
				instance: (null as any),
				logger,
				debug,
			};

			const instance = new BotInstance(context);
			promises.push(instance.refresh());
		}

		await Promise.all(promises);
	}


}

export interface Config {

	/**
	 * The Discord bot token.
	 */
	token: string;

	/**
	 * The bot logger.
	 */
	logger?: Logger;

	/**
	 * The bot debug logger.
	 */
	debug?: Logger;

	config: Context['config']

}

export interface Managers {
	bounty: BountyManager;
	hackamon: HackamonManager;
}
