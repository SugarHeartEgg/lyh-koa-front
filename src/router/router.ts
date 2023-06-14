import Router from "@koa/router";

import AuthController from "../controllers/auth";
import UserController from "../controllers/user";

// 分别对应于需要 JWT 中间件保护的路由和不需要保护的路由。
const unprotectedRouter = new Router();
const protectedRouter = new Router();

// auth 相关路由
unprotectedRouter.post("/auth/login", AuthController.login);
unprotectedRouter.post("/auth/register", AuthController.register);

// users 相关路由
protectedRouter.get("/users", UserController.listUsers);
// get query 路径上传参 如：api?id=123213&id=312313&id=312313
protectedRouter.get("/users/user-info", UserController.showUserDetails);
// get params 路由的传值 如: api/:id/:id/:id
protectedRouter.get("/users/user-info/:id", UserController.showUserDetails);
protectedRouter.post("/users/user-edit", UserController.updateUser);
protectedRouter.post("/users/delete", UserController.deleteUser);

export { unprotectedRouter, protectedRouter };
