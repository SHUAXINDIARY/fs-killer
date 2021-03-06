#!/usr/bin/env node
import { FileSorter } from "../FileSorter";
import { SortCommand } from "../command";
import { ARGMAP } from "../constant";

const sorter = new SortCommand(ARGMAP);

const options = sorter.getOptions();

const cf = new FileSorter(
  options.directory as string,
  options.type as string,
  options.move ? true : false
);

cf.start();
