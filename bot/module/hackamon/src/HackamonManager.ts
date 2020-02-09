import * as Winston from "winston";
import * as Glob from "glob";
import * as Util from "util";
import * as Path from "path";
import {Logger} from "winston";
import {EventEmitter as Emitter} from "events";

import Database from "$database/Database";
import HackamonLoader from "$hackamon/HackamonLoader";
import Hackamon from "./Hackamon";


/**
 * the hackamon manager.
 */
export default class HackamonManager extends Emitter {

	public static DATABASE_TABLE = 'hackamon';

	protected logger: Logger;
	protected debug: Logger;
	protected database: Database;

	private _config: Config;
	private _timer: any | null;

	public hackamon: Hackamon[];
	public hackamonLoader: HackamonLoader;

	/**
	 * Create a new Hackamon manager.
	 * @param config The Hackamon manager config.
	 */
	constructor(config: Config) {
		super();

		this._config = config;
		this._timer = null;

		this.debug = config.debug ?? Winston.createLogger({transports: []});
		this.logger = config.logger ?? this.debug;
		this.database = config.database;

		this.hackamon = [];
		this.hackamonLoader = new HackamonLoader({
			directory: config.spec,
			assets: `${config.cdn}/assets/hackamon`
		});
	}

	public async load(): Promise<void> {
		const glob = Util.promisify(Glob);
		const files = (await glob("**/*.yml", {cwd: this._config.spec}))
			.filter(f => !(f.includes("node_modules") || f.includes("dist")))
			.map(f => Path.join(this._config.spec, f));

		this.hackamon = await Promise.all(files.map(f => this.hackamonLoader.load(f)));
	}

	public setSpawning(enable: boolean): void {
		if (enable) {
			if (this._timer === null) {
				const interval = this._config.spawn.interval ?? 1000 * 5;

				this.logger.info('Starting spawn timer.', {interval});
				this._timer = setInterval(this.spawn.bind(this), interval);
			}
		} else {
			if (this._timer !== null) {
				this.logger.info('Stopping spawn timer.');
				clearInterval(this._timer);
				this._timer = null;
			}
		}
	}

	spawn(force: boolean): void {
		if (force || Math.random() >= this._config.spawn.spawnChance) {
			const shiny = Math.random() >= this._config.spawn.shinyChance;
			const hackamon = this.hackamon[Math.floor(this.hackamon.length * Math.random())];

			this.logger.info('Spawning Hackamon', {hackamon, shiny});
			this.emit('spawn', hackamon, {shiny});
		}
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

	/**
	 * The Hackamon directory.
	 */
	spec: string;

	/**
	 * The CDN URL.
	 */
	cdn: string;

	spawn: {
		interval: number;
		shinyChance: number;
		spawnChance: number;
	}

}
