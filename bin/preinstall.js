#!/usr/bin/env node
/**
 * preinstall
 *
 * creates a symlink to `node_modules` from container to local `node_modules`
 */
var fs = require('fs');
var path = require('path');

var containerNodeModules = path.join(__dirname, '..', '..', '..', 'node_modules');
var localNodeModules = path.join(__dirname, '..', 'node_modules');

fs.symlinkSync(containerNodeModules, localNodeModules, 'dir');
