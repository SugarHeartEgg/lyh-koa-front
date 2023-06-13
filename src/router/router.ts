import Router from "@koa/router";

import AuthController from "../controllers/auth";
import UserController from "../controllers/user";

const router = new Router();

// auth 相关路由
router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register);

// users 相关路由
router.get("/users", UserController.listUsers);

// get query 路径上传参 如：api?id=123213&id=312313&id=312313
router.get("/users/user-info", UserController.showUserDetails);
// get params 路由的传值 如: api/:id/:id/:id
router.get("/users/user-info/:id", UserController.showUserDetails);

router.post("/users/user-edit", UserController.updateUser);
router.post("/users/delete", UserController.deleteUser);

export default router;
