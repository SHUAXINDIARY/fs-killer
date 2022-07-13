import { existsSync } from "fs";
import { readdir, mkdir, opendir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  ARGMAP,
  COMMAND_DEFAULT_VALUE,
  ERRCODEMAP,
  operationTypeEnum,
} from "./constant";
import chalk from "chalk";

export class FileSorter {
  private BASEPATH = "";
  private OPERATIONTYPE = "";
  constructor(path: string, operationType: string) {
    this.BASEPATH = path;
    this.OPERATIONTYPE = operationType;
  }

  isExistsDir() {
    try {
      if (existsSync(this.BASEPATH)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getAllFileTyps() {
    try {
      const data = await readdir(this.BASEPATH);
      return data.reduce((total, item) => {
        const _type = item.split(".")?.[1];
        if (item.split(".").length > 1 && !total.includes(_type)) {
          total.push(_type);
        }
        return total;
      }, [] as string[]);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async batchCreateDir() {
    const types =
      this.OPERATIONTYPE === COMMAND_DEFAULT_VALUE[ARGMAP.TYPE]
        ? await this.getAllFileTyps()
        : [this.OPERATIONTYPE];
    for (let i = 0; i < types.length; i++) {
      try {
        await mkdir(this.BASEPATH + "/" + types[i]);
      } catch (error) {
        if ((error as any).code === ERRCODEMAP.EEXIST) {
          continue;
        } else {
          console.log(error);
          return false;
        }
      }
    }
    return true;
  }

  async readAndWriteFile(readPath: string, writePath: string) {
    try {
      const data = await readFile(readPath);
      writeFile(path.resolve(writePath), data);
    } catch (error) {
      console.log(error);
    }
  }

  async batchCopyOrMoveFiles(operationType = operationTypeEnum.COPY) {
    if (operationType === operationTypeEnum.COPY) {
      const dir = await opendir(this.BASEPATH);
      for await (const dirent of dir) {
        if (dirent.isFile()) {
          if (this.OPERATIONTYPE === COMMAND_DEFAULT_VALUE[ARGMAP.TYPE]) {
            this.readAndWriteFile(
              path.resolve(`${this.BASEPATH}/${dirent.name}`),
              path.resolve(
                `${this.BASEPATH}/${dirent.name.split(".")[1]}/${dirent.name}`
              )
            );
          } else if (dirent.name.split(".")[1] === this.OPERATIONTYPE) {
            this.readAndWriteFile(
              path.resolve(`${this.BASEPATH}/${dirent.name}`),
              path.resolve(
                `${this.BASEPATH}/${dirent.name.split(".")[1]}/${dirent.name}`
              )
            );
          }
        }
      }
    }
  }

  // 执行入口
  async start() {
    if (await this.isExistsDir()) {
      console.log(chalk.bgBlue.bold.white("开始执行"));
      const operation = await this.batchCreateDir();
      operation && this.batchCopyOrMoveFiles();
      console.log(chalk.bgGreenBright.bold.white("执行完成"));
    } else {
      console.log(chalk.bgRed.bold.white("目录不存在"));
    }
  }
}
