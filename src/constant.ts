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
  // 指定类型
  // TYPE: "TYPE",
};

// 参数配置选项
export const COMMAND_OPTIONS = {
  [ARGMAP.DIR]: "-d, --directory <value>",
  // [ARGMAP.TYPE]: "",
};

// 参数描述
export const COMMAND_DES = {
  [ARGMAP.DIR]: "select a directory",
  // [ARGMAP.TYPE]: "",
};

// 参数默认值
export const COMMAND_DEFAULT_VALUE = {
  // 默认对当前目录文件进行分类
  [ARGMAP.DIR]: process.cwd(),
  // [ARGMAP.TYPE]: "all",
};
