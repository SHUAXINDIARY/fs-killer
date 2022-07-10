import { program } from "commander";
import {
  ARGMAP,
  COMMAND_DEFAULT_VALUE,
  COMMAND_DES,
  COMMAND_OPTIONS,
} from "../constant";
import { FileSorter } from "../utils";

program
  .option(
    COMMAND_OPTIONS[ARGMAP.DIR],
    COMMAND_DES[ARGMAP.DIR],
    COMMAND_DEFAULT_VALUE[ARGMAP.DIR]
  )
  .parse();

const options = program.opts();

const cf = new FileSorter(options.directory);

cf.start();
