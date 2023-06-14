// src/server.ts
import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { JWT_SECRET } from "./constants";
import { logger } from "./log/logger";
import { protectedRouter, unprotectedRouter } from "./router/router";

createConnection()
  .then((connection) => {
    // 初始化 Koa 应用实例
    const app = new Koa();

    // 注册中间件 start
    app.use(logger()); // 日志
    app.use(cors()); // 跨域 cors
    app.use(bodyParser()); // 请求体解析
    // 错误处理中间件
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (error) {
        // 只返回 json 格式的响应
        ctx.status = error.status || 500;
        ctx.body = { status: error.status, message: error.message };
      }
    });
    // 注册中间件 end

    // 响应用户请求
    // 无需 JWT Token 即可访问
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());
    // 注册 JWT 中间件
    app.use(jwt({ secret: JWT_SECRET }).unless({ method: ["GET"] }));
    // 需要 JWT Token 才可访问
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // 运行服务器
    app.listen(8899);
  })
  .catch((err: string) => console.log("TypeORM connection error:", err));
