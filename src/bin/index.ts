import { program } from "commander";
import { FileSorter } from "../FileSorter";
import { initOptions } from "../command";

initOptions();

const options = program.opts();

const cf = new FileSorter(options.directory);

cf.start();
