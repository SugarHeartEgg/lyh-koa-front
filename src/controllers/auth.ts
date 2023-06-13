import { Context } from "koa";
import * as argon2 from "argon2";
import { getManager } from "typeorm";
import { User } from "../entity/user";

interface UserType {
  name: string;
  email: string;
  password: string;
}

export default class AuthController {
  // 登录
  public static async login(ctx: Context) {
    ctx.body = "Login controller";
  }

  // 注册
  public static async register(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const newUser: UserType = new User();
    const body = ctx.request.body as UserType; // 使用类型断言将未知类型转换为 UserType 类型

    newUser.name = body.name;
    newUser.email = body.email;
    newUser.password = await argon2.hash(body.password);

    // 保存到数据库
    const user = await userRepository.save(newUser);

    ctx.status = 201;
    ctx.body = user;
    // ctx.body = "Register controller";
  }
}
