#!/usr/bin/env node
"use strict";
exports.__esModule = true;
require("dotenv/config");
var commander_1 = require("commander");
var commands_1 = require("commands");
var program = new commander_1.Command();
program
    .version('1.0.0')
    .description('CLI to import data from CSV and populate PG Database');
commands_1["default"](program);
program.parse(process.argv);
