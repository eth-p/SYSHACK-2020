import * as Discord from "discord.js";

import Context from "./Context";
import Controller from "./Controller";

/**
 * An abstract controller class that searches for channels.
 */
export default abstract class ControllerWithChannel extends Controller {

	protected channel: Map<string, Discord.Channel>;
	protected abstract channel_names: string[];

	public constructor(context: Context) {
		super(context);
		this.channel = new Map();
	}

	/**
	 * Refreshes this controller.
	 * This implementation will find all the channels.
	 */
	public async refresh(): Promise<void> {
		for (const name of this.channel_names) {
			const channel = this.context.discord_server.channels.find(channel => {
				return channel.name == name;
			});

			if (channel == null) {
				this.context.logger.error("Cannot find channel: ", {name});
				continue;
			}

			this.channel.set(name, channel);
		}
	}

}
