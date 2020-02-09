import * as Winston from "winston";
import {Logger} from "winston";

/**
 * An abstract class representing a file-like database.
 */
export default abstract class Database {

	protected logger: Logger;
	protected debug: Logger;

	/**
	 * Create a new database.
	 * @param config The database config.
	 */
	constructor(config: Config) {
		this.debug = config.debug ?? Winston.createLogger({transports: []});
		this.logger = config.logger ?? this.debug;
	}

	/**
	 * Sets a database value.
	 *
	 * @param table The table.
	 * @param key The entry key.
	 * @param value The entry value.
	 */
	public abstract async set<T>(table: string, key: string, value: T): Promise<void>;

	/**
	 * Gets a database value.
	 *
	 * @param table The table.
	 * @param key The entry key.
	 *
	 * @returns The entry, or null if not found.
	 */
	public abstract async get<T>(table: string, key: string): Promise<T|null>;

	/**
	 * Removes a database value.
	 *
	 * @param table The table.
	 * @param key The entry key.
	 */
	public abstract async remove(table: string, key: string): Promise<void>

	/**
	 * Flushes the database cache.
	 */
	public abstract async flush(): Promise<void>;

	/**
	 * Connect to the database.
	 */
	public abstract async connect(): Promise<void>;

	/**
	 * Disconnect from the database.
	 */
	public abstract async disconnect(): Promise<void>;

}

export interface Config {

	/**
	 * The bot logger.
	 */
	logger?: Logger;

	/**
	 * The bot debug logger.
	 */
	debug?: Logger;

}
