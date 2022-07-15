import { existsSync } from "fs";
import {
  readdir,
  mkdir,
  opendir,
  readFile,
  writeFile,
  unlink,
} from "fs/promises";
import path from "path";
import { ARGMAP, COMMAND_DEFAULT_VALUE, ERRCODEMAP } from "./constant";
import chalk from "chalk";

export class FileSorter {
  // 操作目录
  private BASE_PATH = "";
  // 操作类型
  private OPERATION_TYPE = "";
  // 删除 or 移动
  private isMove = false;

  constructor(path: string, operationType: string, isMove = false) {
    this.BASE_PATH = path;
    this.OPERATION_TYPE = operationType;
    this.isMove = isMove;
  }

  isExistsDir() {
    try {
      if (existsSync(this.BASE_PATH)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // 获取目录下文件类型枚举
  async getAllFileTyps() {
    try {
      const data = await readdir(this.BASE_PATH);
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

  // 批量创建目录
  async batchCreateDir() {
    const types =
      this.OPERATION_TYPE === COMMAND_DEFAULT_VALUE[ARGMAP.TYPE]
        ? await this.getAllFileTyps()
        : [this.OPERATION_TYPE];
    for (let i = 0; i < types.length; i++) {
      try {
        await mkdir(this.BASE_PATH + "/" + types[i]);
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

  // 读写文件
  async readAndWriteFile(readPath: string, writePath: string) {
    try {
      const data = await readFile(readPath);
      writeFile(path.resolve(writePath), data);
    } catch (error) {
      console.log(error);
    }
  }

  // 移除文件
  async removeAllFile() {
    const dir = await opendir(this.BASE_PATH);
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        if (this.OPERATION_TYPE === COMMAND_DEFAULT_VALUE[ARGMAP.TYPE]) {
          await unlink(path.resolve(`${this.BASE_PATH}/${dirent.name}`));
        } else if (dirent.name.split(".")[1] === this.OPERATION_TYPE) {
          await unlink(path.resolve(`${this.BASE_PATH}/${dirent.name}`));
        }
      }
    }
  }

  async batchCopyOrMoveFiles() {
    const dir = await opendir(this.BASE_PATH);
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        // 分类全部文件
        if (this.OPERATION_TYPE === COMMAND_DEFAULT_VALUE[ARGMAP.TYPE]) {
          await this.readAndWriteFile(
            path.resolve(`${this.BASE_PATH}/${dirent.name}`),
            path.resolve(
              `${this.BASE_PATH}/${dirent.name.split(".")[1]}/${dirent.name}`
            )
          );
          // 分类指定类型的文件
        } else if (dirent.name.split(".")[1] === this.OPERATION_TYPE) {
          await this.readAndWriteFile(
            path.resolve(`${this.BASE_PATH}/${dirent.name}`),
            path.resolve(
              `${this.BASE_PATH}/${dirent.name.split(".")[1]}/${dirent.name}`
            )
          );
        }
      }
    }

    if (this.isMove) {
      await this.removeAllFile();
    }
  }

  // 执行入口
  async start() {
    if (await this.isExistsDir()) {
      console.log(chalk.bgBlue.bold.white("开始执行"));
      const operation = await this.batchCreateDir();
      operation && (await this.batchCopyOrMoveFiles());
      console.log(chalk.bgGreenBright.bold.white("执行完成"));
    } else {
      console.log(chalk.bgRed.bold.white("目录不存在"));
    }
  }
}
