"use strict";
exports.__esModule = true;
exports.SortCommand = void 0;
var commander_1 = require("commander");
var constant_1 = require("./constant");
var _package = require("../package.json");
var SortCommand = /** @class */ (function () {
    function SortCommand(commandList) {
        var _this = this;
        this.comm = commander_1.program;
        this.comm.name(_package.name).version(_package.version);
        Object.keys(commandList).forEach(function (key) {
            var commandKey = commandList[key];
            _this.comm.option(constant_1.COMMAND_OPTIONS[commandKey], constant_1.COMMAND_DES[commandKey], constant_1.COMMAND_DEFAULT_VALUE[commandKey]);
        });
        this.comm.parse();
    }
    SortCommand.prototype.getOptions = function () {
        return this.comm.opts();
    };
    return SortCommand;
}());
exports.SortCommand = SortCommand;
