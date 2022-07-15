#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var FileSorter_1 = require("../FileSorter");
var command_1 = require("../command");
var constant_1 = require("../constant");
var sorter = new command_1.SortCommand(constant_1.ARGMAP);
var options = sorter.getOptions();
var cf = new FileSorter_1.FileSorter(options.directory, options.type, options.move ? true : false);
cf.start();
