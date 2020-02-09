// ---------------------------------------------------------------------------------------------------------------------
import * as Winston from "winston";
// ---------------------------------------------------------------------------------------------------------------------
import BotMain from "$bot/BotMain";
import SimpleDatabase from "$database/SimpleDatabase";
import BountyManager from "$bounty/BountyManager";
// ---------------------------------------------------------------------------------------------------------------------

// Set up the config:
const config = {
	bounty: {
		request_channel: 'bounty',
		log_channel: 'bounty-log',
		notification_channel: 'bounty-notifications'
	}
};

// Set up the logger:
const logger = Winston.createLogger({
	format: Winston.format.combine(
		Winston.format.colorize(),
		Winston.format.simple()
	),
	transports: [
		new Winston.transports.Console({})
	]
});

// Run the main function:
(async (args) => {

	// Create the database.
	const database = new SimpleDatabase({
		path: process.env['DATABASE_URL']!,
		debug: logger.child({module: 'database'})
	});

	// Create the bounty manager.
	const bounty = new BountyManager({
		database: database,
		debug: logger.child({module: 'bounty'})
	});

	// Create the bot.
	const bot = new BotMain({
		token: args.DISCORD_TOKEN!,
		debug: logger.child({module: 'bot'}),
		config
	}, {
		bounty
	});

	await database.connect();
	await bot.connect();
})(process.env).then(() => {
}, error => {
	logger.error(error);
});

