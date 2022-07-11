export enum operationTypeEnum {
  COPY = 1,
  MOVE = 2,
}

export const ERRCODEMAP = {
  // 文件重复错误码
  EEXIST: "EEXIST",
};

// 参数列表
export const ARGMAP = {
  // 指定目录
  DIR: "directory",
  // 获取当前目录下文件数量 和 所有格式
  INFO: "info",
  // 指定类型
  // TYPE: "getType",
};

// 参数配置选项
export const COMMAND_OPTIONS = {
  [ARGMAP.DIR]: "-d, --directory <dirname>",
  // [ARGMAP.INFO]: "-i, --info",
  // [ARGMAP.TYPE]: "",
};

// 参数描述
export const COMMAND_DES = {
  [ARGMAP.DIR]: "select a directory",
  // [ARGMAP.INFO]: "list info for current directory,like files count..",
  // [ARGMAP.TYPE]: "",
};

// 参数默认值
export const COMMAND_DEFAULT_VALUE = {
  // 默认对当前目录文件进行分类
  [ARGMAP.DIR]: process.cwd(),
  // [ARGMAP.TYPE]: "all",
};
