import { existsSync, readFileSync } from "fs";
import {
  readdir,
  mkdir,
  opendir,
  readFile,
  writeFile,
  unlink,
} from "fs/promises";
import path from "path";
import {
  ARGMAP,
  COMMAND_DEFAULT_VALUE,
  ERRCODEMAP,
  FRAME_TYPE,
  IMAGE_EXTENSIONS,
} from "./constant";
import chalk from "chalk";
import { imageSize } from "image-size";
import { drawProgressBar } from "./upload/drawProgressBar";

export class FileSorter {
  // 操作目录
  private BASE_PATH = "";
  // 操作类型
  private OPERATION_TYPE = "";
  // 删除 or 移动
  private isMove = false;
  // 按画幅分类
  private byFrame = false;

  constructor(
    path: string,
    operationType: string,
    isMove = false,
    byFrame = false
  ) {
    this.BASE_PATH = path;
    this.OPERATION_TYPE = operationType;
    this.isMove = isMove;
    this.byFrame = byFrame;
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

  // 判断是否为图片文件
  isImageFile(filename: string): boolean {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext ? IMAGE_EXTENSIONS.includes(ext) : false;
  }

  // 获取图片画幅类型
  getFrameType(filePath: string): string | null {
    try {
      const buffer = readFileSync(filePath);
      const dimensions = imageSize(buffer);
      if (!dimensions.width || !dimensions.height) {
        return null;
      }
      if (dimensions.width > dimensions.height) {
        return FRAME_TYPE.HORIZONTAL; // 横图
      } else if (dimensions.width < dimensions.height) {
        return FRAME_TYPE.VERTICAL; // 竖图
      } else {
        return FRAME_TYPE.SQUARE; // 方图
      }
    } catch (error) {
      console.log(chalk.yellow(`无法读取图片尺寸: ${filePath}`));
      return null;
    }
  }

  // 批量创建目录
  async batchCreateDir() {
    let types: string[];

    if (this.byFrame) {
      // 按画幅分类时，创建横图、竖图、方图目录
      types = Object.values(FRAME_TYPE);
    } else {
      types =
        this.OPERATION_TYPE === COMMAND_DEFAULT_VALUE[ARGMAP.TYPE]
          ? await this.getAllFileTyps()
          : [this.OPERATION_TYPE];
    }

    for (let i = 0; i < types.length; i++) {
      const dirPath = path.resolve(this.BASE_PATH, types[i]);
      // 目录已存在则跳过
      if (existsSync(dirPath)) {
        continue;
      }
      try {
        await mkdir(dirPath);
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
        if (this.byFrame) {
          // 按画幅模式下，只移除图片文件
          if (this.isImageFile(dirent.name)) {
            await unlink(path.resolve(`${this.BASE_PATH}/${dirent.name}`));
          }
        } else if (this.OPERATION_TYPE === COMMAND_DEFAULT_VALUE[ARGMAP.TYPE]) {
          await unlink(path.resolve(`${this.BASE_PATH}/${dirent.name}`));
        } else if (dirent.name.split(".")[1] === this.OPERATION_TYPE) {
          await unlink(path.resolve(`${this.BASE_PATH}/${dirent.name}`));
        }
      }
    }
  }

  // 获取待处理的文件列表
  async getFilesToProcess(): Promise<string[]> {
    const files: string[] = [];
    const dir = await opendir(this.BASE_PATH);
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        if (this.byFrame) {
          // 按画幅模式下，只处理图片文件
          if (this.isImageFile(dirent.name)) {
            files.push(dirent.name);
          }
        } else if (this.OPERATION_TYPE === COMMAND_DEFAULT_VALUE[ARGMAP.TYPE]) {
          // 分类全部文件
          files.push(dirent.name);
        } else if (dirent.name.split(".")[1] === this.OPERATION_TYPE) {
          // 分类指定类型的文件
          files.push(dirent.name);
        }
      }
    }
    return files;
  }

  async batchCopyOrMoveFiles() {
    const files = await this.getFilesToProcess();
    const total = files.length;

    if (total === 0) {
      console.log(chalk.yellow("没有找到需要处理的文件"));
      return;
    }

    console.log(chalk.cyan(`共 ${total} 个文件待处理`));

    let processed = 0;

    for (const fileName of files) {
      const filePath = path.resolve(`${this.BASE_PATH}/${fileName}`);

      // 按画幅分类模式
      if (this.byFrame) {
        const frameType = this.getFrameType(filePath);
        if (frameType) {
          await this.readAndWriteFile(
            filePath,
            path.resolve(`${this.BASE_PATH}/${frameType}/${fileName}`)
          );
        }
        // 分类全部文件
      } else if (this.OPERATION_TYPE === COMMAND_DEFAULT_VALUE[ARGMAP.TYPE]) {
        await this.readAndWriteFile(
          filePath,
          path.resolve(
            `${this.BASE_PATH}/${fileName.split(".")[1]}/${fileName}`
          )
        );
        // 分类指定类型的文件
      } else if (fileName.split(".")[1] === this.OPERATION_TYPE) {
        await this.readAndWriteFile(
          filePath,
          path.resolve(
            `${this.BASE_PATH}/${fileName.split(".")[1]}/${fileName}`
          )
        );
      }

      processed++;
      drawProgressBar(processed / total, `(${processed}/${total})`);
    }

    // 进度条完成后换行
    process.stdout.write("\n");

    if (this.isMove) {
      console.log(chalk.cyan("正在移除源文件..."));
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
