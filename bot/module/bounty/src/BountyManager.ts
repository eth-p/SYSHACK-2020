import * as Winston from "winston";
import * as UUID from "uuid/v4";
import {Logger} from "winston";
import * as LRUMap from "lru-cache";
import {EventEmitter as Emitter} from "events";

import Database from "$database/Database";

import Bounty from "./Bounty";
import BountyId from "./BountyId";
import BountyRequest from "./BountyRequest";

/**
 * The bounty manager.
 */
export default class BountyManager extends Emitter {

	public static DATABASE_TABLE = 'bounty';

	protected logger: Logger;
	protected debug: Logger;
	protected database: Database;

	protected _bounties: LRUMap<BountyId, Bounty<unknown>>;

	/**
	 * Create a new bounty manager.
	 * @param config The bounty manager config.
	 */
	constructor(config: Config) {
		super();

		this.debug = config.debug ?? Winston.createLogger({transports: []});
		this.logger = config.logger ?? this.debug;
		this.database = config.database;

		this._bounties = new LRUMap({
			max: config.cache?.maxAge ?? 1000,
			maxAge: config.cache?.maxEntries ?? 1000 * 60
		});
	}

	/**
	 * Posts a new bounty.
	 * @param bounty The bounty request.
	 */
	public async post<T>(bounty: BountyRequest<T>) {
		if (bounty.id == null) bounty.id = UUID();
		if (await this.find(bounty.id) != null) throw new Error(`Bounty with id '${bounty.id}' is already posted.`);

		const bountyInstance = new Bounty<T>(bounty);
		this._bounties.set(bountyInstance.id, bountyInstance);
		await this.database.set(BountyManager.DATABASE_TABLE, bountyInstance.id, bountyInstance);
	}

	/**
	 * Completes a bounty.
	 * @param bounty The bounty to complete.
	 */
	public async complete(bounty: BountyId|Bounty<any>, ...data: any[]) {
		const bountyId = typeof bounty === 'string' ? bounty : bounty.id;
		const bountyInstance = await this.find<unknown>(bountyId);

		if (bountyInstance == null) {
			this.debug.info('Could not find bounty to resolve.', {bounty});
			throw new Error(`Bounty with id '${bounty}' is already cancelled or resolved.`);
		}

		this._bounties.del(bountyInstance.id);
		await this.database.remove(BountyManager.DATABASE_TABLE, bountyInstance.id);
		this.emit('complete', bountyInstance, ...data);
	}

	/**
	 * Cancels a bounty.
	 * @param bounty The bounty to cancel.
	 */
	public async cancel(bounty: BountyId|Bounty<any>) {
		const bountyId = typeof bounty === 'string' ? bounty : bounty.id;
		const bountyInstance = await this.find<unknown>(bountyId);

		if (bountyInstance == null) {
			this.debug.info('Could not find bounty to cancel.', {bounty});
			throw new Error(`Bounty with id '${bounty}' is already cancelled or resolved.`);
		}

		this._bounties.del(bountyInstance.id);
		await this.database.remove(BountyManager.DATABASE_TABLE, bountyInstance.id);
		this.emit('cancel', bountyInstance);
	}

	/**
	 * Finds a bounty.
	 * @param id The bounty ID.
	 */
	public async find<T>(id: BountyId): Promise<null|Bounty<T>> {
		let bounty: Bounty<T>|undefined;

		// Try from the cache.
		bounty = this._bounties.get(id) as Bounty<T>;
		if (bounty != null) {
			this.debug.info('Found bounty from cache.', {id});
			return bounty;
		}

		// Try from the database.
		bounty = (await this.database.get(BountyManager.DATABASE_TABLE, id)) as Bounty<T>;
		if (bounty != null) {
			this.debug.info('Found bounty from database.', {id});
			return bounty;
		}

		// Nope.
		return null;
	}


}

export interface Config {

	/**
	 * The bounty manager logger.
	 */
	logger?: Logger;

	/**
	 * The bounty manager debug logger.
	 */
	debug?: Logger;

	/**
	 * The database to use.
	 */
	database: Database;

	cache?: {
		maxEntries: number,
		maxAge: number
	}

}
