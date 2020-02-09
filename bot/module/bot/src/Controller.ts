import * as Discord from "discord.js";
import {EventEmitter as Emitter} from "events";

import Context from "./Context";

/**
 * An abstract controller class.
 */
export default abstract class Controller extends Emitter {

	protected context: Context;
	private _contextListeners: [string, any][];

	public constructor(context: Context) {
		super();

		this.context = context;
		this._contextListeners = [];
	}

	/**
	 * Adds a listener for a Discord event.
	 *
	 * @param event The event name.
	 * @param listener The event listener function (bound to this).
	 */
	protected onDiscord(event: string, listener: Function) {
		const hooked = (...args) => {
			const ret = listener.apply(this, args);
			if (ret.then) {
				ret.then(() => {}).catch(error => this.emit('error', error));
			}
		};

		this._contextListeners.push(hooked as any);
		this.context.discord.on(event, hooked);
	}

	/**
	 * Destroys all listeners.
	 */
	protected destroyDiscordListeners() {
		for (const [event, listener] of this._contextListeners) {
			this.context.discord.removeListener(event, listener);
		}

		this._contextListeners = [];
	}

	/**
	 * Refreshes this controller.
	 */
	public abstract async refresh(): Promise<void>;

	/**
	 * Destroys this controller.
	 */
	public async destroy(): Promise<void> {
		this.destroyDiscordListeners();
	}

}

export interface Config {

	/**
	 * The channel where requests are made and posted.
	 */
	request_channel: string;

}
