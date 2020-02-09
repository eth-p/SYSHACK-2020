// ---------------------------------------------------------------------------------------------------------------------
import * as Winston from "winston";
// ---------------------------------------------------------------------------------------------------------------------
import BotMain from "$bot/BotMain";
import SimpleDatabase from "$database/SimpleDatabase";
import BountyManager from "$bounty/BountyManager";
import HackamonManager from "$hackamon/HackamonManager";
import WildHackamonManager from "$hackamon-wild/WildHackamonManager";
// ---------------------------------------------------------------------------------------------------------------------

// Set up the config:
const config = {
	bounty: {
		request_channel: 'bounty',
		log_channel: 'bounty-log',
		notification_channel: 'notifications'
	},
	hackamon: {
		spawn_channel: 'wild-hackamon',
		notification_channel: 'notifications'
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
		debug: logger.child({module: 'hackamon'}),
		cdn: process.env['CDN_URL']!,
		spec: process.env['HACKAMON_DIR']!,
		spawn: {
			interval: 1000 * 30,
			spawnChance: 0.25,
			shinyChance: 0.05
		},
	});

	const wild_hackamon = new WildHackamonManager({
		database: database,
		debug: logger.child({module: 'wild_hackamon'})
	});

	// Create the bot.
	const bot = new BotMain({
		token: args.DISCORD_TOKEN!,
		debug: logger.child({module: 'bot'}),
		config
	}, {
		bounty,
		hackamon,
		wild_hackamon
	});

	await hackamon.load();
	await database.connect();
	await bot.connect();

	hackamon.setSpawning(true);
})(process.env).then(() => {
}, error => {
	logger.error(error);
});

