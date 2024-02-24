"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const uuid_1 = require("uuid");
const errorHandle_1 = require("./errorHandle");
const server_model_1 = require("./model/server.model");
const errorHandle_model_1 = require("./model/errorHandle.model");
const todos = [];
const server = http.createServer((req, res) => {
    var _a, _b;
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
        "Content-Type": "application/json",
    };
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    // GET: /todos 取得所有代辦
    if (req.url === "/todos" && req.method === server_model_1.Method.GET) {
        res.writeHead(200, headers);
        res.end(JSON.stringify({
            status: "success",
            data: todos,
        }));
    }
    // POST: /todos 新增一筆代辦
    else if (req.url === "/todos" && req.method === server_model_1.Method.POST) {
        req.on("end", () => {
            try {
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    todos.push({
                        id: (0, uuid_1.v4)(),
                        title,
                    });
                    res.writeHead(200, headers);
                    res.end(JSON.stringify({
                        status: "success",
                        data: todos,
                    }));
                }
                else {
                    (0, errorHandle_1.errorHandle)(res, errorHandle_model_1.ERROR_MESSAGE.INVALID_TITLE_FIELD_NOT_FOUND);
                }
            }
            catch (err) {
                (0, errorHandle_1.errorHandle)(res, errorHandle_model_1.ERROR_MESSAGE.INVALID_FIELD);
            }
        });
    }
    // DELETE: /todos 刪除所有代辦
    else if (req.url === "/todos" && req.method === server_model_1.Method.DELETE) {
        todos.length = 0;
        res.writeHead(200, headers);
        res.end(JSON.stringify({
            status: "success",
            data: todos,
        }));
    }
    // DELETE: /todos 刪除一筆代辦
    else if (((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith("/todos/")) && req.method === server_model_1.Method.DELETE) {
        const id = req.url.split("/")[2];
        const todoIndex = todos.findIndex((todo) => todo.id === id);
        if (todoIndex !== -1) {
            todos.splice(todoIndex, 1);
            res.writeHead(200, headers);
            res.end(JSON.stringify({
                status: "success",
                data: todos,
            }));
        }
        else {
            (0, errorHandle_1.errorHandle)(res, errorHandle_model_1.ERROR_MESSAGE.INVALID_ID);
        }
    }
    // DELETE: /todos 更新一筆代辦
    else if (((_b = req.url) === null || _b === void 0 ? void 0 : _b.startsWith("/todos/")) && req.method === server_model_1.Method.PATCH) {
        req.on("end", () => {
            var _a;
            const id = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/")[2];
            const todoIndex = todos.findIndex((todo) => todo.id === id);
            if (todoIndex !== -1) {
                try {
                    const title = JSON.parse(body).title;
                    if (title !== undefined) {
                        todos[todoIndex].title = title;
                        res.writeHead(200, headers);
                        res.end(JSON.stringify({
                            status: "success",
                            data: todos,
                        }));
                    }
                    else {
                        (0, errorHandle_1.errorHandle)(res, errorHandle_model_1.ERROR_MESSAGE.INVALID_TITLE_FIELD_NOT_FOUND);
                    }
                }
                catch (err) {
                    (0, errorHandle_1.errorHandle)(res, errorHandle_model_1.ERROR_MESSAGE.INVALID_FIELD);
                }
            }
            else {
                (0, errorHandle_1.errorHandle)(res, errorHandle_model_1.ERROR_MESSAGE.INVALID_ID);
            }
        });
    }
    // OPTIONS: /todos 跨域請求 Preflight Request
    else if (req.method === server_model_1.Method.OPTIONS) {
        res.writeHead(200, headers);
        res.end();
    }
    // 404 Not Found
    else {
        res.writeHead(404, headers);
        res.end(JSON.stringify({
            status: "false",
            message: errorHandle_model_1.ERROR_MESSAGE.INVALID_ROUTE,
        }));
    }
});
server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
