#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const alias = require('module-alias');

// Register module aliases.
const dist = path.join(__dirname, 'dist');
const modules = fs.readdirSync(path.join(dist, 'module')).forEach(name => {
	alias.addAlias('$' + name, path.join(dist, 'module', name, 'src'));
});

// Start.
require('./dist/bin/bot');
