import { program } from "commander";
import {
  ARGMAP,
  COMMAND_DEFAULT_VALUE,
  COMMAND_ARG_DES,
  COMMAND_OPTIONS,
  COMMAND_DES,
} from "./constant";
const _package = require("../package.json");

export class SortCommand {
  private comm = program;

  constructor(commandList: any) {
    this.comm
      .name(_package.name)
      .version(_package.version)
      .description(COMMAND_DES);
    Object.keys(commandList).forEach((key) => {
      const commandKey = (commandList as Record<string, any>)[key];
      this.comm.option(
        COMMAND_OPTIONS[commandKey],
        COMMAND_ARG_DES[commandKey],
        COMMAND_DEFAULT_VALUE[commandKey]
      );
    });
    this.comm.parse();
  }

  getOptions() {
    return this.comm.opts<{
      directory?: string;
      type?: string;
      move?: boolean;
      frame?: boolean;
    }>();
  }
}
