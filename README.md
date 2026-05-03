# fs-killer

一个文件整理与图片上传 CLI 工具，提供两个命令：

- `sorter`：按扩展名 / 画幅 / 文件名分组整理文件
- `upload`：上传当前目录图片到七牛云

## 安装

```bash
npm i -g fs-killer
```

安装后可直接使用 `sorter` 和 `upload`。

## 命令一：文件分类（sorter）

### 功能概览

- 默认按文件扩展名分类（如 `jpg`、`mp4`、`txt`）
- 支持只分类指定类型（`-t`）
- 支持按图片画幅分类（`-f`，横图/竖图/方图）
- 支持按文件名（不含扩展名）分组（`-n`，同名文件归档）
- 支持移动模式（`-m`），否则为复制模式

### 基本用法

```bash
# 在当前目录按扩展名分类
sorter

# 指定目录
sorter -d ~/Pictures
```

### 参数说明

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `-d, --directory <dirname>` | 指定操作目录 | 当前目录 |
| `-t, --type <fileType>` | 仅处理指定扩展名；默认处理全部类型 | `all` |
| `-m, --move` | 移动文件（不加该参数时为复制） | `false` |
| `-f, --frame` | 按画幅分类图片到 `horizontal/vertical/square` | `false` |
| `-n, --name` | 按文件名（不含扩展名）归档同名文件 | `false` |

### 使用示例

```bash
# 1) 默认：按扩展名分类
sorter

# 2) 仅分类 jpg
sorter -t jpg

# 3) 按画幅分类图片
sorter -f

# 4) 按文件名归档同名文件（例如 a.jpg + a.png -> a/）
sorter -n

# 5) 指定目录 + 移动模式
sorter -d ~/Desktop/files -m
```

### 模式说明

#### 1) 按扩展名分类（默认）

- 例如 `a.jpg` 会进入 `jpg/a.jpg`
- `-m` 关闭时：复制；`-m` 开启时：复制后删除源文件

#### 2) 按画幅分类（`-f`）

- 仅处理图片文件（`jpg/jpeg/png/gif/bmp/webp/tiff/tif`）
- 根据宽高比分类到：
  - `horizontal/`（宽 > 高）
  - `vertical/`（宽 < 高）
  - `square/`（宽 = 高）
- 会读取 EXIF Orientation，避免旋转图片判断错误

#### 3) 按文件名归档（`-n`）

- 按“文件名（不含扩展名）”分组
- 仅处理同名数量 >= 2 的组
- 例如同目录下有 `a.jpg`、`a.png`，会创建 `a/` 并移动进去
- 若目标重名冲突，会自动生成 `a_1.ext`、`a_2.ext`...

### 参数优先级

当使用 `-n` 时，优先执行“按文件名归档”流程；`-t`、`-f` 在该次执行中不生效。

## 命令二：图片上传（upload）

将当前目录图片上传到七牛云，并在当前目录生成 `uploadResult.json` 记录上传结果。

### 用法

```bash
upload -a <ACCESS_KEY> -s <SECRET_KEY> -b <BUCKET>
```

### 参数说明

| 参数 | 说明 |
| --- | --- |
| `-a, --ak <accessKey>` | 七牛云 AccessKey |
| `-s, --sk <secretKey>` | 七牛云 SecretKey |
| `-b, --bucket <bucket>` | 七牛云空间名 |

### 上传范围

`upload` 仅扫描当前目录，上传以下扩展名文件：

- `jpg`
- `jpeg`
- `png`
- `gif`
- `bmp`
- `svg`

## 常见命令

```bash
# 查看 sorter 帮助
sorter -h

# 查看 upload 帮助
upload -h
```

## License

MIT
