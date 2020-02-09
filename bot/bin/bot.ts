// ---------------------------------------------------------------------------------------------------------------------
import * as Winston from "winston";
// ---------------------------------------------------------------------------------------------------------------------
import BotMain from "$bot/BotMain";
import SimpleDatabase from "$database/SimpleDatabase";
import BountyManager from "$bounty/BountyManager";
import HackamonManager from "$hackamon/HackamonManager";
// ---------------------------------------------------------------------------------------------------------------------

// Set up the config:
const config = {
	bounty: {
		request_channel: 'bounty',
		log_channel: 'bounty-log',
		notification_channel: 'bounty-notifications'
	},
	hackamon: {
		spawn_channel: 'wild-hackamon'
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

	// Create the Hackamon manager.
	const hackamon = new HackamonManager({
		database: database,
		debug: logger.child({module: 'bounty'}),
		cdn: process.env['CDN_URL']!,
		spec: process.env['HACKAMON_DIR']!,
		spawn: {
			interval: 1000 * 10,
			spawnChance: 0,
			// interval: 1000 * 10,
			// spawnChance: 0.25,
			shinyChance: 0
		},
	});

	// Create the bot.
	const bot = new BotMain({
		token: args.DISCORD_TOKEN!,
		debug: logger.child({module: 'bot'}),
		config
	}, {
		bounty,
		hackamon
	});

	await hackamon.load();
	await database.connect();
	await bot.connect();

	// hackamon.setSpawning(true);
	setTimeout(() =>	hackamon.spawn(true), 1000);
})(process.env).then(() => {
}, error => {
	logger.error(error);
});

