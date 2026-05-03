"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.FileSorter = void 0;
var fs_1 = require("fs");
var exifr_1 = require("exifr");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var constant_1 = require("./constant");
var chalk_1 = require("chalk");
var image_size_1 = require("image-size");
var drawProgressBar_1 = require("./upload/drawProgressBar");
// 负责按照扩展名或画幅，对目录中的文件进行分类复制/移动。
var FileSorter = /** @class */ (function () {
    function FileSorter(path, operationType, isMove, byFrame) {
        if (isMove === void 0) { isMove = false; }
        if (byFrame === void 0) { byFrame = false; }
        // 操作目录
        this.BASE_PATH = "";
        // 操作类型
        this.OPERATION_TYPE = "";
        // 删除 or 移动
        this.isMove = false;
        // 按画幅分类
        this.byFrame = false;
        // 保存运行参数，后续所有流程都围绕这些配置执行。
        this.BASE_PATH = path;
        this.OPERATION_TYPE = operationType;
        this.isMove = isMove;
        this.byFrame = byFrame;
    }
    // 校验目标目录是否存在，避免后续流程在无效路径上继续执行。
    FileSorter.prototype.isExistsDir = function () {
        try {
            if (fs_1.existsSync(this.BASE_PATH)) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    };
    // 获取目录下文件类型枚举
    FileSorter.prototype.getAllFileTyps = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, promises_1.readdir(this.BASE_PATH)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.reduce(function (total, item) {
                                var _a;
                                if (_this.isSystemFile(item)) {
                                    return total;
                                }
                                var _type = (_a = item.split(".")) === null || _a === void 0 ? void 0 : _a[1];
                                // 仅收集存在扩展名且未重复的类型。
                                if (item.split(".").length > 1 && !total.includes(_type)) {
                                    total.push(_type);
                                }
                                return total;
                            }, [])];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 判断是否为 macOS 系统文件
    FileSorter.prototype.isSystemFile = function (filename) {
        return filename === ".DS_Store";
    };
    // 判断是否为图片文件
    FileSorter.prototype.isImageFile = function (filename) {
        var _a;
        var ext = (_a = filename.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        return ext ? constant_1.IMAGE_EXTENSIONS.includes(ext) : false;
    };
    // 获取图片画幅类型（异步方法，需要读取 EXIF 信息）
    FileSorter.prototype.getFrameType = function (filePath) {
        return __awaiter(this, void 0, Promise, function () {
            var buffer, dimensions, width, height, exif, _a, error_2;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        buffer = fs_1.readFileSync(filePath);
                        dimensions = image_size_1.imageSize(buffer);
                        if (!dimensions.width || !dimensions.height) {
                            return [2 /*return*/, null];
                        }
                        width = dimensions.width;
                        height = dimensions.height;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, exifr_1["default"].parse(buffer, { pick: ["Orientation"] })];
                    case 2:
                        exif = _c.sent();
                        if ((exif === null || exif === void 0 ? void 0 : exif.Orientation) &&
                            exif.Orientation >= 5 &&
                            exif.Orientation <= 8) {
                            _b = [height, width], width = _b[0], height = _b[1];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        if (width > height) {
                            return [2 /*return*/, constant_1.FRAME_TYPE.HORIZONTAL]; // 横图
                        }
                        else if (width < height) {
                            return [2 /*return*/, constant_1.FRAME_TYPE.VERTICAL]; // 竖图
                        }
                        else {
                            return [2 /*return*/, constant_1.FRAME_TYPE.SQUARE]; // 方图
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _c.sent();
                        console.log(chalk_1["default"].yellow("\u65E0\u6CD5\u8BFB\u53D6\u56FE\u7247\u5C3A\u5BF8: " + filePath));
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // 批量创建目录
    FileSorter.prototype.batchCreateDir = function () {
        return __awaiter(this, void 0, void 0, function () {
            var types, _a, i, dirPath, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.byFrame) return [3 /*break*/, 1];
                        // 按画幅分类时，创建横图、竖图、方图目录
                        types = Object.values(constant_1.FRAME_TYPE);
                        return [3 /*break*/, 5];
                    case 1:
                        if (!(this.OPERATION_TYPE === constant_1.COMMAND_DEFAULT_VALUE[constant_1.ARGMAP.TYPE])) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getAllFileTyps()];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = [this.OPERATION_TYPE];
                        _b.label = 4;
                    case 4:
                        // "all" 模式下按目录内现有扩展名建目录；否则只建指定类型目录。
                        types = _a;
                        _b.label = 5;
                    case 5:
                        i = 0;
                        _b.label = 6;
                    case 6:
                        if (!(i < types.length)) return [3 /*break*/, 11];
                        dirPath = path_1["default"].resolve(this.BASE_PATH, types[i]);
                        // 目录已存在则跳过
                        if (fs_1.existsSync(dirPath)) {
                            return [3 /*break*/, 10];
                        }
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, promises_1.mkdir(dirPath)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        error_3 = _b.sent();
                        if (error_3.code === constant_1.ERRCODEMAP.EEXIST) {
                            return [3 /*break*/, 10];
                        }
                        else {
                            console.log(error_3);
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 10];
                    case 10:
                        i++;
                        return [3 /*break*/, 6];
                    case 11: return [2 /*return*/, true];
                }
            });
        });
    };
    // 读写文件
    FileSorter.prototype.readAndWriteFile = function (readPath, writePath) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, promises_1.readFile(readPath)];
                    case 1:
                        data = _a.sent();
                        promises_1.writeFile(path_1["default"].resolve(writePath), data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 移除已完成分类的源文件（仅在移动模式下调用）
    FileSorter.prototype.removeAllFile = function () {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var dir, dir_1, dir_1_1, dirent, e_1_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, promises_1.opendir(this.BASE_PATH)];
                    case 1:
                        dir = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 13, 14, 19]);
                        dir_1 = __asyncValues(dir);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, dir_1.next()];
                    case 4:
                        if (!(dir_1_1 = _b.sent(), !dir_1_1.done)) return [3 /*break*/, 12];
                        dirent = dir_1_1.value;
                        if (!(dirent.isFile() && !this.isSystemFile(dirent.name))) return [3 /*break*/, 11];
                        if (!this.byFrame) return [3 /*break*/, 7];
                        if (!this.isImageFile(dirent.name)) return [3 /*break*/, 6];
                        return [4 /*yield*/, promises_1.unlink(path_1["default"].resolve(this.BASE_PATH + "/" + dirent.name))];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 11];
                    case 7:
                        if (!(this.OPERATION_TYPE === constant_1.COMMAND_DEFAULT_VALUE[constant_1.ARGMAP.TYPE])) return [3 /*break*/, 9];
                        return [4 /*yield*/, promises_1.unlink(path_1["default"].resolve(this.BASE_PATH + "/" + dirent.name))];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 9:
                        if (!(dirent.name.split(".")[1] === this.OPERATION_TYPE)) return [3 /*break*/, 11];
                        return [4 /*yield*/, promises_1.unlink(path_1["default"].resolve(this.BASE_PATH + "/" + dirent.name))];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [3 /*break*/, 3];
                    case 12: return [3 /*break*/, 19];
                    case 13:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 19];
                    case 14:
                        _b.trys.push([14, , 17, 18]);
                        if (!(dir_1_1 && !dir_1_1.done && (_a = dir_1["return"]))) return [3 /*break*/, 16];
                        return [4 /*yield*/, _a.call(dir_1)];
                    case 15:
                        _b.sent();
                        _b.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 18: return [7 /*endfinally*/];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    // 获取待处理的文件列表
    FileSorter.prototype.getFilesToProcess = function () {
        var e_2, _a;
        return __awaiter(this, void 0, Promise, function () {
            var files, dir, dir_2, dir_2_1, dirent, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        files = [];
                        return [4 /*yield*/, promises_1.opendir(this.BASE_PATH)];
                    case 1:
                        dir = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 13]);
                        dir_2 = __asyncValues(dir);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, dir_2.next()];
                    case 4:
                        if (!(dir_2_1 = _b.sent(), !dir_2_1.done)) return [3 /*break*/, 6];
                        dirent = dir_2_1.value;
                        // 统一过滤目录项：只处理普通文件，并排除系统文件。
                        if (dirent.isFile() && !this.isSystemFile(dirent.name)) {
                            if (this.byFrame) {
                                // 按画幅模式下，只处理图片文件
                                if (this.isImageFile(dirent.name)) {
                                    files.push(dirent.name);
                                }
                            }
                            else if (this.OPERATION_TYPE === constant_1.COMMAND_DEFAULT_VALUE[constant_1.ARGMAP.TYPE]) {
                                // 分类全部文件
                                files.push(dirent.name);
                            }
                            else if (dirent.name.split(".")[1] === this.OPERATION_TYPE) {
                                // 分类指定类型的文件
                                files.push(dirent.name);
                            }
                        }
                        _b.label = 5;
                    case 5: return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(dir_2_1 && !dir_2_1.done && (_a = dir_2["return"]))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(dir_2)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/, files];
                }
            });
        });
    };
    /**
     * 批量复制或移动文件
     * 根据分类模式将文件复制到对应目录，若为移动模式则在完成后删除源文件
     */
    FileSorter.prototype.batchCopyOrMoveFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, total, processed, _i, files_1, fileName, filePath, frameType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFilesToProcess()];
                    case 1:
                        files = _a.sent();
                        total = files.length;
                        if (total === 0) {
                            console.log(chalk_1["default"].yellow("没有找到需要处理的文件"));
                            return [2 /*return*/];
                        }
                        console.log(chalk_1["default"].cyan("\u5171 " + total + " \u4E2A\u6587\u4EF6\u5F85\u5904\u7406"));
                        processed = 0;
                        _i = 0, files_1 = files;
                        _a.label = 2;
                    case 2:
                        if (!(_i < files_1.length)) return [3 /*break*/, 12];
                        fileName = files_1[_i];
                        filePath = path_1["default"].resolve(this.BASE_PATH + "/" + fileName);
                        if (!this.byFrame) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getFrameType(filePath)];
                    case 3:
                        frameType = _a.sent();
                        if (!frameType) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.readAndWriteFile(filePath, path_1["default"].resolve(this.BASE_PATH + "/" + frameType + "/" + fileName))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 10];
                    case 6:
                        if (!(this.OPERATION_TYPE === constant_1.COMMAND_DEFAULT_VALUE[constant_1.ARGMAP.TYPE])) return [3 /*break*/, 8];
                        // 分类全部文件：按文件扩展名分类到对应目录
                        return [4 /*yield*/, this.readAndWriteFile(filePath, path_1["default"].resolve(this.BASE_PATH + "/" + fileName.split(".")[1] + "/" + fileName))];
                    case 7:
                        // 分类全部文件：按文件扩展名分类到对应目录
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 8:
                        if (!(fileName.split(".")[1] === this.OPERATION_TYPE)) return [3 /*break*/, 10];
                        // 分类指定类型的文件：仅处理匹配指定扩展名的文件
                        return [4 /*yield*/, this.readAndWriteFile(filePath, path_1["default"].resolve(this.BASE_PATH + "/" + fileName.split(".")[1] + "/" + fileName))];
                    case 9:
                        // 分类指定类型的文件：仅处理匹配指定扩展名的文件
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        processed++;
                        // 每处理一个文件都刷新进度条，便于观察长任务执行状态。
                        drawProgressBar_1.drawProgressBar(processed / total, "(" + processed + "/" + total + ")");
                        _a.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 2];
                    case 12:
                        process.stdout.write("\n");
                        if (!this.isMove) return [3 /*break*/, 14];
                        // 移动模式：复制完成后删除源文件
                        console.log(chalk_1["default"].cyan("正在移除源文件..."));
                        return [4 /*yield*/, this.removeAllFile()];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    // 执行入口
    FileSorter.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var operation, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.isExistsDir()];
                    case 1:
                        if (!_b.sent()) return [3 /*break*/, 5];
                        console.log(chalk_1["default"].bgBlue.bold.white("开始执行"));
                        return [4 /*yield*/, this.batchCreateDir()];
                    case 2:
                        operation = _b.sent();
                        _a = operation;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.batchCopyOrMoveFiles()];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4:
                        _a;
                        console.log(chalk_1["default"].bgGreenBright.bold.white("执行完成"));
                        return [3 /*break*/, 6];
                    case 5:
                        console.log(chalk_1["default"].bgRed.bold.white("目录不存在"));
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return FileSorter;
}());
exports.FileSorter = FileSorter;
