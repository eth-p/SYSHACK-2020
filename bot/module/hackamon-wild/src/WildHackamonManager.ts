import * as Winston from "winston";
import * as Glob from "glob";
import * as Util from "util";
import * as Path from "path";
import {Logger} from "winston";
import {EventEmitter as Emitter} from "events";

import Database from "$database/Database";
import HackamonLoader from "$hackamon/HackamonLoader";
import Hackamon from "$hackamon/Hackamon";
import * as LRUMap from "lru-cache";
import * as UUID from "uuid/v4";
import HackamonInstance from "$hackamon/HackamonInstance";
import HackamonInstanceId from "$hackamon/HackamonInstanceId";


/**
 * The wild Hackamon manager.
 */
export default class WildHackamonManager extends Emitter {

	public static DATABASE_TABLE = 'wild_hackamon';

	protected logger: Logger;
	protected debug: Logger;
	protected database: Database;

	private _config: Config;

	protected _wild: LRUMap<string, HackamonInstance>;

	/**
	 * Create a new Hackamon manager.
	 * @param config The Hackamon manager config.
	 */
	constructor(config: Config) {
		super();

		this._config = config;

		this.debug = config.debug ?? Winston.createLogger({transports: []});
		this.logger = config.logger ?? this.debug;
		this.database = config.database;

		this._wild = new LRUMap({
			max: config.cache?.maxAge ?? 1000,
			maxAge: config.cache?.maxEntries ?? 1000 * 60
		});
	}

	/**
	 * Finds a wild Hackamon.
	 * @param id The Hackamon instance ID.
	 */
	public async find<T>(id: HackamonInstanceId): Promise<null|HackamonInstance> {
		let instance: HackamonInstance|undefined;

		// Try from the cache.
		instance = this._wild.get(id);
		if (instance != null) {
			this.debug.info('Found wild hackamon from cache.', {id});
			return instance;
		}

		// Try from the database.
		instance = (await this.database.get(WildHackamonManager.DATABASE_TABLE, id)) as HackamonInstance;
		if (instance != null) {
			this.debug.info('Found wild hackamon from database.', {id});
			return instance;
		}

		// Nope.
		return null;
	}

	/**
	 * Adds a wild Hackamon to the database.
	 * @param hackamon The wild Hackamon descriptor.
	 * @param instance The wild Hackamon instance.
	 */
	public async spawn(hackamon: Hackamon, instance: HackamonInstance) {
		if (instance.id == null) instance.id = UUID();
		if (await this.find(instance.id) != null) throw new Error(`Wild hackamon with id '${instance.id}' already exists.`);

		this._wild.set(instance.id, instance);
		await this.database.set(WildHackamonManager.DATABASE_TABLE, instance.id, instance);
	}

	/**
	 * Claims a wild Hackamon.
	 *
	 * @param id The wild Hackamon ID.
	 * @param user The user that claimed the Hackamon.
	 */
	public async claim(id: HackamonInstance|HackamonInstanceId, user: string) {
		const instanceId: string = typeof id === 'string' ? id : id.id!;
		const instance = await this.find<unknown>(instanceId);

		if (instance == null) {
			this.debug.info('Could not find Hackamon to claim.', {id});
			throw new Error(`Sorry, somebody already caught that Hackamon!`);
		}

		this._wild.del(instance.id!);
		await this.database.remove(WildHackamonManager.DATABASE_TABLE, instance.id!);
		this.emit('claim', user, instance);
	}

}

export interface Config {

	/**
	 * The wild hackamon manager logger.
	 */
	logger?: Logger;

	/**
	 * The wild hackamon manager debug logger.
	 */
	debug?: Logger;

	/**
	 * The database to use.
	 */
	database: Database;

	cache?: {
		maxEntries: number;
		maxAge: number;
	}

}
