import { FileSorter } from "./utils";

// 临时测试使用
const PATH = "./source";

export const main = async () => {
  const cf = new FileSorter(PATH);
  cf.start();
};

main();
