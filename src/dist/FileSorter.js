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
var promises_1 = require("fs/promises");
var path_1 = require("path");
var constant_1 = require("./constant");
var chalk_1 = require("chalk");
var FileSorter = /** @class */ (function () {
    function FileSorter(path, operationType, isMove) {
        if (isMove === void 0) { isMove = false; }
        // 操作目录
        this.BASE_PATH = "";
        // 操作类型
        this.OPERATION_TYPE = "";
        // 删除 or 移动
        this.isMove = false;
        this.BASE_PATH = path;
        this.OPERATION_TYPE = operationType;
        this.isMove = isMove;
    }
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
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, promises_1.readdir(this.BASE_PATH)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.reduce(function (total, item) {
                                var _a;
                                var _type = (_a = item.split(".")) === null || _a === void 0 ? void 0 : _a[1];
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
    // 批量创建目录
    FileSorter.prototype.batchCreateDir = function () {
        return __awaiter(this, void 0, void 0, function () {
            var types, _a, i, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.OPERATION_TYPE === constant_1.COMMAND_DEFAULT_VALUE[constant_1.ARGMAP.TYPE])) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllFileTyps()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = [this.OPERATION_TYPE];
                        _b.label = 3;
                    case 3:
                        types = _a;
                        i = 0;
                        _b.label = 4;
                    case 4:
                        if (!(i < types.length)) return [3 /*break*/, 9];
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, promises_1.mkdir(this.BASE_PATH + "/" + types[i])];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _b.sent();
                        if (error_2.code === constant_1.ERRCODEMAP.EEXIST) {
                            return [3 /*break*/, 8];
                        }
                        else {
                            console.log(error_2);
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 8];
                    case 8:
                        i++;
                        return [3 /*break*/, 4];
                    case 9: return [2 /*return*/, true];
                }
            });
        });
    };
    // 读写文件
    FileSorter.prototype.readAndWriteFile = function (readPath, writePath) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_3;
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
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 移除文件
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
                        _b.trys.push([2, 10, 11, 16]);
                        dir_1 = __asyncValues(dir);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, dir_1.next()];
                    case 4:
                        if (!(dir_1_1 = _b.sent(), !dir_1_1.done)) return [3 /*break*/, 9];
                        dirent = dir_1_1.value;
                        if (!dirent.isFile()) return [3 /*break*/, 8];
                        if (!(this.OPERATION_TYPE === constant_1.COMMAND_DEFAULT_VALUE[constant_1.ARGMAP.TYPE])) return [3 /*break*/, 6];
                        return [4 /*yield*/, promises_1.unlink(path_1["default"].resolve(this.BASE_PATH + "/" + dirent.name))];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(dirent.name.split(".")[1] === this.OPERATION_TYPE)) return [3 /*break*/, 8];
                        return [4 /*yield*/, promises_1.unlink(path_1["default"].resolve(this.BASE_PATH + "/" + dirent.name))];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [3 /*break*/, 3];
                    case 9: return [3 /*break*/, 16];
                    case 10:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 16];
                    case 11:
                        _b.trys.push([11, , 14, 15]);
                        if (!(dir_1_1 && !dir_1_1.done && (_a = dir_1["return"]))) return [3 /*break*/, 13];
                        return [4 /*yield*/, _a.call(dir_1)];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 15: return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    FileSorter.prototype.batchCopyOrMoveFiles = function () {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var dir, dir_2, dir_2_1, dirent, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, promises_1.opendir(this.BASE_PATH)];
                    case 1:
                        dir = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 10, 11, 16]);
                        dir_2 = __asyncValues(dir);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, dir_2.next()];
                    case 4:
                        if (!(dir_2_1 = _b.sent(), !dir_2_1.done)) return [3 /*break*/, 9];
                        dirent = dir_2_1.value;
                        if (!dirent.isFile()) return [3 /*break*/, 8];
                        if (!(this.OPERATION_TYPE === constant_1.COMMAND_DEFAULT_VALUE[constant_1.ARGMAP.TYPE])) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.readAndWriteFile(path_1["default"].resolve(this.BASE_PATH + "/" + dirent.name), path_1["default"].resolve(this.BASE_PATH + "/" + dirent.name.split(".")[1] + "/" + dirent.name))];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(dirent.name.split(".")[1] === this.OPERATION_TYPE)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.readAndWriteFile(path_1["default"].resolve(this.BASE_PATH + "/" + dirent.name), path_1["default"].resolve(this.BASE_PATH + "/" + dirent.name.split(".")[1] + "/" + dirent.name))];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [3 /*break*/, 3];
                    case 9: return [3 /*break*/, 16];
                    case 10:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 16];
                    case 11:
                        _b.trys.push([11, , 14, 15]);
                        if (!(dir_2_1 && !dir_2_1.done && (_a = dir_2["return"]))) return [3 /*break*/, 13];
                        return [4 /*yield*/, _a.call(dir_2)];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 15: return [7 /*endfinally*/];
                    case 16:
                        if (!this.isMove) return [3 /*break*/, 18];
                        return [4 /*yield*/, this.removeAllFile()];
                    case 17:
                        _b.sent();
                        _b.label = 18;
                    case 18: return [2 /*return*/];
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
