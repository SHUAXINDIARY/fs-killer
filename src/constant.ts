export const ERRCODEMAP = {
  // 文件重复错误码
  EEXIST: "EEXIST",
};

// 参数列表
export const ARGMAP = {
  // 指定目录
  DIR: "directory",
  // 指定要分类的文件类型
  TYPE: "getType",
  // 移动还是复制
  IS_MOVE: "isMove",
};

// 参数配置选项
export const COMMAND_OPTIONS = {
  [ARGMAP.DIR]: "-d, --directory <dirname>",
  [ARGMAP.TYPE]: "-t, --type <fileType>",
  [ARGMAP.IS_MOVE]: "-m, --move",
};

// 参数描述
export const COMMAND_DES = {
  [ARGMAP.DIR]: "select a directory",
  [ARGMAP.TYPE]: "specifying a file type",
  [ARGMAP.IS_MOVE]:
    "If this parameter is added, it will move all your files instead of copying them",
};

// 参数默认值
export const COMMAND_DEFAULT_VALUE = {
  // 默认对当前目录文件进行分类
  [ARGMAP.DIR]: process.cwd(),
  [ARGMAP.TYPE]: "all",
};
