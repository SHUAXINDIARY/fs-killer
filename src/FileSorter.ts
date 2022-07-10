import { existsSync } from "fs";
import { readdir, mkdir, opendir, readFile, writeFile } from "fs/promises";
import path from "path";
import { ERRCODEMAP, operationTypeEnum } from "./constant";
import chalk from "chalk";

export class FileSorter {
  private BASEPATH = "";

  constructor(path: string) {
    this.BASEPATH = path;
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
    const types = await this.getAllFileTyps();
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
  async copyOrMoveFiles(operationType = operationTypeEnum.COPY) {
    if (operationType === operationTypeEnum.COPY) {
      const dir = await opendir(this.BASEPATH);
      for await (const dirent of dir) {
        if (dirent.isFile()) {
          const data = await readFile(
            path.resolve(`${this.BASEPATH}/${dirent.name}`)
          );
          writeFile(
            path.resolve(
              `${this.BASEPATH}/${dirent.name.split(".")[1]}/${dirent.name}`
            ),
            data
          );
        }
      }
    }
  }

  // 执行入口
  async start() {
    if (await this.isExistsDir()) {
      console.log(chalk.bgBlue.bold.white("开始执行"));
      const operation = await this.batchCreateDir();
      operation && this.copyOrMoveFiles();
      console.log(chalk.bgGreenBright.bold.white("执行完成"));
    } else {
      console.log(chalk.bgRed.bold.white("目录不存在"));
    }
  }
}