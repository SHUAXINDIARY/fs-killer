import { getAllFileTyps, isExistsDir } from "./utils";

// 临时测试使用
const PATH = './source'

export const main = async () => {
  if (isExistsDir(PATH)) {
    console.log("目录存在");
    const types = await getAllFileTyps(PATH)
    console.log(types);
  } else {
    console.log("目录不存在");
  }
};

main();
