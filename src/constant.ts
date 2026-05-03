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
  // 按画幅分类（横图/竖图/方图）
  BY_FRAME: "byFrame",
  // 按文件名（不含扩展名）分类
  BY_NAME: "byName",
};

// 参数配置选项
export const COMMAND_OPTIONS = {
  [ARGMAP.DIR]: "-d, --directory <dirname>",
  [ARGMAP.TYPE]: "-t, --type <fileType>",
  [ARGMAP.IS_MOVE]: "-m, --move",
  [ARGMAP.BY_FRAME]: "-f, --frame",
  [ARGMAP.BY_NAME]: "-n, --name",
};

// 参数描述
export const COMMAND_ARG_DES = {
  [ARGMAP.DIR]: "select a directory",
  [ARGMAP.TYPE]: "specifying a file type",
  [ARGMAP.IS_MOVE]:
    "If this parameter is added, it will move all your files instead of copying them",
  [ARGMAP.BY_FRAME]:
    "Sort images by aspect ratio (horizontal/vertical/square)",
  [ARGMAP.BY_NAME]:
    "Sort duplicated files by filename (without extension) into folders",
};

// 参数默认值
export const COMMAND_DEFAULT_VALUE = {
  // 默认对当前目录文件进行分类
  [ARGMAP.DIR]: process.cwd(),
  [ARGMAP.TYPE]: "all",
};

// 画幅类型
export const FRAME_TYPE = {
  HORIZONTAL: "horizontal", // 横图
  VERTICAL: "vertical", // 竖图
  SQUARE: "square", // 方图
};

// 支持的图片格式
export const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "tiff",
  "tif",
];

// 命令行describe

export const COMMAND_DES: string = `文件分类命令：sorter\n文件上传命令：upload\n以下参数为sorter命令的参数`;
