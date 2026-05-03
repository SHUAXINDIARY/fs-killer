import { program } from "commander";
import {
  ARGMAP,
  COMMAND_DEFAULT_VALUE,
  COMMAND_ARG_DES,
  COMMAND_OPTIONS,
  COMMAND_DES,
} from "./constant";
const _package = require("../package.json");

// 负责封装 commander 的初始化与参数读取。
export class SortCommand {
  // 复用 commander 的全局 program 实例。
  private comm = program;

  constructor(commandList: any) {
    // 注入 CLI 基础信息：名称、版本、描述。
    this.comm
      .name(_package.name)
      .version(_package.version)
      .description(COMMAND_DES);

    // 根据传入的命令列表，动态挂载所有可用选项。
    Object.keys(commandList).forEach((key) => {
      const commandKey = (commandList as Record<string, any>)[key];
      this.comm.option(
        COMMAND_OPTIONS[commandKey],
        COMMAND_ARG_DES[commandKey],
        COMMAND_DEFAULT_VALUE[commandKey]
      );
    });

    // 触发参数解析，读取用户在命令行中输入的选项。
    this.comm.parse();
  }

  // 返回已解析的参数对象（带类型提示，便于后续使用）。
  getOptions() {
    return this.comm.opts<{
      directory?: string;
      type?: string;
      move?: boolean;
      frame?: boolean;
    }>();
  }
}
