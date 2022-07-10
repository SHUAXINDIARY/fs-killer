import { CateFiles } from "./utils";

// 临时测试使用
const PATH = "./source";

export const main = async () => {
  const cf = new CateFiles(PATH);
  cf.start();
};

main();
