import {Logger} from "winston";
import * as Discord from "discord.js";

import BountyManager from "$bounty/BountyManager";

import BotInstance from "./BotInstance";
import {Config as BountyRequestControllerConfig} from "./BountyRequestController";
import {Config as BountyCompleteControllerConfig} from "./BountyCompleteController";
import {Config as BountyCancelControllerConfig} from "./BountyCancelController";

export default interface Context {
	instance: BotInstance;

	discord: Discord.Client;
	discord_server: Discord.Guild;

	manager: {
		bounty: BountyManager;
	};

	config: {
		bounty: {}
			& BountyRequestControllerConfig
			& BountyCancelControllerConfig
			& BountyCompleteControllerConfig
	}

	logger: Logger,
	debug: Logger
}
