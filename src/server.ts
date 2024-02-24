import * as http from 'http';
import { v4 as uuidv4 } from "uuid";
import { errorHandle } from "./errorHandle";
import { Method, Todo } from "./model/server.model";
import { ERROR_MESSAGE } from "./model/errorHandle.model";

const todos: Todo[] = [];
const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const headers: http.OutgoingHttpHeaders = {
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, Content-Length, X-Requested-With",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
      "Content-Type": "application/json",
    };

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    // GET: /todos 取得所有代辦
    if (req.url === "/todos" && req.method === Method.GET) {
      res.writeHead(200, headers);
      res.end(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      );
    }
    // POST: /todos 新增一筆代辦
    else if (req.url === "/todos" && req.method === Method.POST) {
      req.on("end", () => {
        try {
          const title = JSON.parse(body).title;
          if (title !== undefined) {
            todos.push({
              id: uuidv4(),
              title,
            });
            res.writeHead(200, headers);
            res.end(
              JSON.stringify({
                status: "success",
                data: todos,
              })
            );
          } else {
            errorHandle(res, ERROR_MESSAGE.INVALID_TITLE_FIELD_NOT_FOUND);
          }
        } catch (err) {
          errorHandle(res, ERROR_MESSAGE.INVALID_FIELD);
        }
      });
    }
    // DELETE: /todos 刪除所有代辦
    else if (req.url === "/todos" && req.method === Method.DELETE) {
      todos.length = 0;
      res.writeHead(200, headers);
      res.end(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      );
    }
    // DELETE: /todos 刪除一筆代辦
    else if (req.url?.startsWith("/todos/") && req.method === Method.DELETE) {
      const id = req.url.split("/")[2];
      const todoIndex = todos.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        res.writeHead(200, headers);
        res.end(
          JSON.stringify({
            status: "success",
            data: todos,
          })
        );
      } else {
        errorHandle(res, ERROR_MESSAGE.INVALID_ID);
      }
    }
    // DELETE: /todos 更新一筆代辦
    else if (req.url?.startsWith("/todos/") && req.method === Method.PATCH) {
      req.on("end", () => {
        const id = req.url?.split("/")[2];
        const todoIndex = todos.findIndex((todo) => todo.id === id);
        if (todoIndex !== -1) {
          try {
            const title = JSON.parse(body).title;
            if (title !== undefined) {
              todos[todoIndex].title = title;
              res.writeHead(200, headers);
              res.end(
                JSON.stringify({
                  status: "success",
                  data: todos,
                })
              );
            } else {
              errorHandle(res, ERROR_MESSAGE.INVALID_TITLE_FIELD_NOT_FOUND);
            }
          } catch (err) {
            errorHandle(res, ERROR_MESSAGE.INVALID_FIELD);
          }
        } else {
          errorHandle(res, ERROR_MESSAGE.INVALID_ID);
        }
      });
    }
    // OPTIONS: /todos 跨域請求 Preflight Request
    else if (req.method === Method.OPTIONS) {
      res.writeHead(200, headers);
      res.end();
    }
    // 404 Not Found
    else {
      res.writeHead(404, headers);
      res.end(
        JSON.stringify({
          status: "false",
          message: ERROR_MESSAGE.INVALID_ROUTE,
        })
      );
    }
  }
);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
