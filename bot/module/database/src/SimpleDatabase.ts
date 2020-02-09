import * as Filesystem from "fs-extra";
import * as Path from "path";
import * as LRUMap from "lru-cache";
import Database, {Config as DatabaseConfig} from "./Database";

/**
 * An easy and simple flat-file database.
 */
export default class SimpleDatabase extends Database {

	private _incache: LRUMap<string, Cache>;
	private _outcache: Map<string, Cache>;
	private _timer: any|null;
	private _config: Config;

	/**
	 * Create a new database.
	 * @param config The database config.
	 */
	constructor(config: DatabaseConfig & Config) {
		super(config);

		this._outcache = new Map();
		this._incache = new LRUMap({
			max: config.cache?.maxAge ?? 1000,
			maxAge: config.cache?.maxEntries ?? 1000 * 60
		});

		this._timer = null;
		this._config = config;
	}

	/**
	 * Normalizes a key to be filesystem-safe.
	 *
	 * @param key The unsafe key.
	 * @returns The normalized key.
	 */
	private _normalize(key: string): string {
		return key.replace(/[^A-Za-z0-9\-]/g, (match, ...captures) => {
			return `_${key.charCodeAt(0).toString(16).padStart(2, '0')}_`;
		})
	}

	/**
	 * Generates a file path for an entry.
	 *
	 * @param table The entry table.
	 * @param key The entry key.
	 *
	 * @returns The corresponding file for the entry.
	 */
	private _entryfile(table: string, key: string): string {
		return Path.join(this._config.path, this._normalize(table), this._normalize(key) + '.json');
	}

	/**
	 * Writes a file.
	 *
	 * @param file The file to write.
	 * @param data The data to write.
	 */
	private async _write(file, data: Cache): Promise<void> {
		this.logger.info('Reading', {file});
		await Filesystem.mkdirp(Path.dirname(file));
		await Filesystem.writeJson(file, data.value);
	}

	/**
	 * Reads a file.
	 *
	 * @param file The file to read.
	 * @returns The data read.
	 */
	private async _read(file): Promise<any> {
		this.logger.info('Writing', {file});
		return await Filesystem.readJson(file);
	}

	public async set<T>(table: string, key: string, value: T): Promise<void> {
		const file = this._entryfile(table, key);
		this._outcache.set(file, {table, key, value});
	}

	public async get<T>(table: string, key: string): Promise<T|null> {
		const file = this._entryfile(table, key);
		let data: null|undefined|any;

		// Fetch from write cache.
		data = this._outcache.get(file);
		if (data != null) {
			this.debug.info('Fetched entry from write cache.', {table, key});
		}

		// Fetch from read cache.
		data = this._incache.get(file);
		if (data != null) {
			this.debug.info('Fetched entry from read cache.', {table, key});
		}

		// Fetch from filesystem.
		try {
			data = await this._read(file);
			this.debug.info('Fetched entry from filesystem.', {table, key});
			return data;
		} catch (ex) {
			return null;
		}
	}

	public async remove(table: string, key: string): Promise<void> {
		const file = this._entryfile(table, key);

		// Delete from caches.
		this._outcache.delete(file);
		this._incache.del(file);

		try {
			await Filesystem.remove(file);
		} catch (ex) {
			// :shrug:
		}
	}


	public async flush(): Promise<void> {
		// Swap the cache object.
		const cache = this._outcache;
		this._outcache = new Map();

		// Flush the cache to the filesystem.
		let promises: Promise<void>[] = [];
		for (const [file, entry] of cache.entries()) {
			promises.push(this._write(file, entry));
		}

		// Wait on all the operations.
		await Promise.all(promises);
	}

	public async connect(): Promise<void> {
		this.logger.info('Connecting to database.');

		if (this._timer === null) {
			if (this._config.interval !== false) {
				const interval = this._config.interval ?? 1000 * 5;

				this.logger.info('Starting flush timer.', {interval});
				this._timer = setInterval(this.flush.bind(this), interval);
			}
		}
	}

	public async disconnect(): Promise<void> {
		this.logger.info('Disconnecting from database.');

		if (this._timer === null) {
			if (this._config.interval !== false) {
				this.logger.info('Stopping flush timer.');
				clearInterval(this._timer);
				this._timer = null;
			}
		}
	}

}

interface Cache {
	table: string;
	key: string;
	value: any;
}

export interface Config {

	/**
	 * The data folder.
	 */
	path: string;

	/**
	 * The flushing interval.
	 * Set to `false` to disable flushing.
	 */
	interval?: number|false;

	cache?: {
		maxEntries: number,
		maxAge: number
	}

}
