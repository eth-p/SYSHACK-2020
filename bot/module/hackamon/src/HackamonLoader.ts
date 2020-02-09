import Hackamon from "$hackamon/Hackamon";
import * as Yaml from "js-yaml";
import * as Filesystem from "fs-extra";
import * as Path from "path";
import {Logger} from "winston";
import Database from "$database/Database";
import HackamonInstance from "$hackamon/HackamonInstance";

/**
 * A class that loads Hackamon definitions.
 */
export default class HackamonLoader {

	private _directory: string;
	private _assetsUrl: string;

	public constructor(config: Config) {
		this._directory = config.directory;
		this._assetsUrl = config.assets;
	}


	public async load(file: string): Promise<Hackamon> {
		const data = await Filesystem.readFile(file, 'utf-8');
		const yaml = Yaml.safeLoad(data);
		yaml.id = Path.basename(file, Path.extname(file));
		return yaml;
	}

	public getSpriteUrl(hackamon: Hackamon, instance: HackamonInstance): string {
		return `${this._assetsUrl}/` + hackamon.assets[instance.shiny ? 'shiny' : 'regular'].sprite;
	}

	public getImageUrl(hackamon: Hackamon, instance: HackamonInstance): string {
		return `${this._assetsUrl}/` + hackamon.assets[instance.shiny ? 'shiny' : 'regular'].image;
	}

}

export interface Config {

	/**
	 * The Hackamon directory.
	 */
	directory: string;

	/**
	 * The CDN assets URL.
	 */
	assets: string;

}
