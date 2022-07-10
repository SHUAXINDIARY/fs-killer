import { existsSync } from "fs";
import { readdir } from "fs/promises";
/**
 * @description 判断传入的路劲的目录是否存在
 * @param dir 目标目录路径
 */
export const isExistsDir = (dir: string) => {
  try {
    if (existsSync(dir)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * @description 获取目录下所有文件类型
 * @param dir 目录路径
 */
export const getAllFileTyps = async (dir: string) => {
  try {
    const data = await readdir(dir);
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
};
