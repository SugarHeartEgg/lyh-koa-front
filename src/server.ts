// src/server.ts
import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { logger } from "./log/logger";
import router from "./router/router";
import "reflect-metadata";
import { createConnection } from "typeorm";

createConnection()
  .then((connection) => {
    // 初始化 Koa 应用实例
    const app = new Koa();

    // 注册中间件 start
    app.use(logger()); // 日志
    app.use(cors()); // 跨域 cors
    app.use(bodyParser()); // 请求体解析
    // 注册中间件 end

    // 响应用户请求
    app.use(router.routes()).use(router.allowedMethods());

    // 运行服务器
    app.listen(8899);
  })
  .catch((err: string) => console.log("TypeORM connection error:", err));
