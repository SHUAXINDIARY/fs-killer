import { existsSync, readFileSync } from "fs";
import exifr from "exifr";
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

// 负责按照扩展名或画幅，对目录中的文件进行分类复制/移动。
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
    // 保存运行参数，后续所有流程都围绕这些配置执行。
    this.BASE_PATH = path;
    this.OPERATION_TYPE = operationType;
    this.isMove = isMove;
    this.byFrame = byFrame;
  }

  // 校验目标目录是否存在，避免后续流程在无效路径上继续执行。
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
        if (this.isSystemFile(item)) {
          return total;
        }
        const _type = item.split(".")?.[1];
        // 仅收集存在扩展名且未重复的类型。
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

  // 判断是否为 macOS 系统文件
  isSystemFile(filename: string): boolean {
    return filename === ".DS_Store";
  }

  // 判断是否为图片文件
  isImageFile(filename: string): boolean {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext ? IMAGE_EXTENSIONS.includes(ext) : false;
  }

  // 获取图片画幅类型（异步方法，需要读取 EXIF 信息）
  async getFrameType(filePath: string): Promise<string | null> {
    try {
      const buffer = readFileSync(filePath);
      const dimensions = imageSize(buffer);
      if (!dimensions.width || !dimensions.height) {
        return null;
      }

      let width = dimensions.width;
      let height = dimensions.height;

      // 读取 EXIF 方向信息，orientation 为 5-8 时表示图片需要旋转 90°/270°，宽高需要交换
      try {
        const exif = await exifr.parse(buffer, { pick: ["Orientation"] });
        if (
          exif?.Orientation &&
          exif.Orientation >= 5 &&
          exif.Orientation <= 8
        ) {
          [width, height] = [height, width];
        }
      } catch {
        // EXIF 解析失败时使用原始尺寸
      }

      if (width > height) {
        return FRAME_TYPE.HORIZONTAL; // 横图
      } else if (width < height) {
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
      // "all" 模式下按目录内现有扩展名建目录；否则只建指定类型目录。
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
      // 使用读写方式实现“复制”，后续是否删除源文件由 isMove 决定。
      const data = await readFile(readPath);
      writeFile(path.resolve(writePath), data);
    } catch (error) {
      console.log(error);
    }
  }

  // 移除已完成分类的源文件（仅在移动模式下调用）
  async removeAllFile() {
    const dir = await opendir(this.BASE_PATH);
    for await (const dirent of dir) {
      if (dirent.isFile() && !this.isSystemFile(dirent.name)) {
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
      // 统一过滤目录项：只处理普通文件，并排除系统文件。
      if (dirent.isFile() && !this.isSystemFile(dirent.name)) {
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

  /**
   * 批量复制或移动文件
   * 根据分类模式将文件复制到对应目录，若为移动模式则在完成后删除源文件
   */
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

      if (this.byFrame) {
        // 按画幅分类模式：根据图片宽高比分类到横图/竖图/方图目录
        const frameType = await this.getFrameType(filePath);
        if (frameType) {
          await this.readAndWriteFile(
            filePath,
            path.resolve(`${this.BASE_PATH}/${frameType}/${fileName}`)
          );
        }
      } else if (this.OPERATION_TYPE === COMMAND_DEFAULT_VALUE[ARGMAP.TYPE]) {
        // 分类全部文件：按文件扩展名分类到对应目录
        await this.readAndWriteFile(
          filePath,
          path.resolve(
            `${this.BASE_PATH}/${fileName.split(".")[1]}/${fileName}`
          )
        );
      } else if (fileName.split(".")[1] === this.OPERATION_TYPE) {
        // 分类指定类型的文件：仅处理匹配指定扩展名的文件
        await this.readAndWriteFile(
          filePath,
          path.resolve(
            `${this.BASE_PATH}/${fileName.split(".")[1]}/${fileName}`
          )
        );
      }

      processed++;
      // 每处理一个文件都刷新进度条，便于观察长任务执行状态。
      drawProgressBar(processed / total, `(${processed}/${total})`);
    }

    process.stdout.write("\n");

    if (this.isMove) {
      // 移动模式：复制完成后删除源文件
      console.log(chalk.cyan("正在移除源文件..."));
      await this.removeAllFile();
    }
  }

  // 执行入口
  async start() {
    if (await this.isExistsDir()) {
      console.log(chalk.bgBlue.bold.white("开始执行"));
      // 先确保目标目录结构就绪，再进入文件处理阶段。
      const operation = await this.batchCreateDir();
      operation && (await this.batchCopyOrMoveFiles());
      console.log(chalk.bgGreenBright.bold.white("执行完成"));
    } else {
      console.log(chalk.bgRed.bold.white("目录不存在"));
    }
  }
}
