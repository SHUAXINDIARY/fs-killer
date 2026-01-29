# fs-killer

处理图片文件的终端工具 - Terminal tool for processing image files

## 安装 - Installation

```bash
npm i fs-killer -g
```

## 文件分类 - File Sorter

根据文件类型或图片画幅对文件进行分类整理。

### 基本用法 - Basic Usage

```bash
# 进入目标目录
cd ~/Desktop/imgs

# 执行分类（默认按文件类型分类）
sorter
```

### 命令选项 - Options

| 选项 | 说明 |
|------|------|
| `-d, --directory <dirname>` | 指定要分类的目录（默认当前目录） |
| `-t, --type <fileType>` | 指定要分类的文件类型（默认全部类型） |
| `-m, --move` | 移动文件而非复制 |
| `-f, --frame` | 按画幅分类图片（横图/竖图/方图） |

### 使用示例 - Examples

```bash
# 指定目录
sorter -d ~/Pictures

# 只分类 JPG 文件
sorter -t jpg

# 移动文件（而非复制）
sorter -m

# 按画幅分类图片
sorter -f

# 组合使用：指定目录 + 按画幅分类 + 移动文件
sorter -d ~/Pictures -f -m
```

### 画幅分类说明 - Frame Classification

使用 `-f` 参数时，会根据图片的宽高比将图片分类到以下目录：

| 目录 | 说明 |
|------|------|
| `horizontal/` | 横图（宽 > 高） |
| `vertical/` | 竖图（宽 < 高） |
| `square/` | 方图（宽 = 高） |

支持的图片格式：jpg, jpeg, png, gif, bmp, webp, tiff, tif

## 图片上传 - Image Upload

上传图片到七牛云对象存储。

### 功能特性 - Features

- 上传执行目录内全部图片到七牛云对象存储
- 上传过程进度条展示
- 输出上传结果日志

### 使用方法 - Usage

```bash
# s: SECRET_KEY
# a: ACCESS_KEY  
# b: 上传空间（bucket）
upload -s <SECRET_KEY> -a <ACCESS_KEY> -b <BUCKET>
```

## TODO

### 核心功能 - Core

- [x] 对文件分类到不同类型的文件夹
- [x] 指定要被分类的目录
- [x] 指定分类的类型
- [x] 复制或者移动分类文件
- [x] 按画幅分类图片（横图/竖图/方图）
- [ ] 列出目录下所有文件类型
- [ ] 操作数量展示

### 其他 - Other

- [x] CLI 支持
- [ ] 命令行交互优化

## License

MIT
