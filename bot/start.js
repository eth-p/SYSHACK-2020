#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const alias = require('module-alias');
const dotenv = require('dotenv');

// Register module aliases.
const dist = path.join(__dirname, 'dist');
const modules = fs.readdirSync(path.join(dist, 'module')).forEach(name => {
	alias.addAlias('$' + name, path.join(dist, 'module', name, 'src'));
});

// Load environment variables and config.
require('source-map-support').install();
dotenv.config();

// Validate environment variables.
if (process.env['DISCORD_TOKEN'] == null)     throw new Error("Missing 'DISCORD_TOKEN' environment variable.");
if (process.env['DISCORD_CLIENT_ID'] == null) throw new Error("Missing 'DISCORD_CLIENT_ID' environment variable.");
if (process.env['DATABASE_URL'] == null) throw new Error("Missing 'DATABASE_URL' environment variable.");
if (process.env['HACKAMON_DIR'] == null) throw new Error("Missing 'HACKAMON_DIR' environment variable.");

process.env['DATABASE_URL'] = path.resolve(process.cwd(), process.env['DATABASE_URL']);
process.env['HACKAMON_DIR'] = path.resolve(process.cwd(), process.env['HACKAMON_DIR']);

// Start.
require('./dist/bin/bot');
