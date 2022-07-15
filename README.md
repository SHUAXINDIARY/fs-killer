# 项目简介 - About the Project 

对指定目录下的所有文件进行分类 - Classifies all files in the specified directory


# 使用 - usage

```shell

# 安装 - install
npm i fs-killer -g

# eg：cd [dir]
cd ~/Desktop/imgs

# 执行 - execute
sorter

```

### 所有选项 - all options

```shell

# specifying a directory
sorter -d source

# specifying a file types
sorter -t JPG

# specifying sorter mode - move files
# if not specified, replication is performed
sorter -m 

```

# TODO

### 核心 - core：

- [x] 对文件分类到不同类型的文件夹 - classify files

- [x] 指定要被分类的目录 - specify folder

- [x] 指定分类的类型 - specify file type

- [x] 复制或者移动分类文件 - copy or move classified files

- [ ] 列出目录下所有文件类型 - view a collection of all file types in a directory

- [ ] 操作数量展示 - display number of operation files

### 其他 - other：
  - [x] cli支持 - support cli

  - [ ] 命令行交互优化 - interactional optimization
  

