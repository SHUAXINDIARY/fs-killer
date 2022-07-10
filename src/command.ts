import { program } from "commander";
import {
  ARGMAP,
  COMMAND_DEFAULT_VALUE,
  COMMAND_DES,
  COMMAND_OPTIONS,
} from "./constant";

export const initOptions = () => {
  Object.keys(ARGMAP).forEach((key) => {
    const commandKey = (ARGMAP as Record<string, any>)[key];
    program.option(
      COMMAND_OPTIONS[commandKey],
      COMMAND_DES[commandKey],
      COMMAND_DEFAULT_VALUE[commandKey]
    );
  });
  program.parse();
};
