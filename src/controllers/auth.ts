import { Context } from "koa";
import * as argon2 from "argon2";
import { getManager } from "typeorm";
import jwt from "jsonwebtoken";
import { User } from "../entity/user";
import { JWT_SECRET } from "../constants";
import { UnauthorizedException } from "../exceptions";

interface UserType {
  name: string;
  email: string;
  password: string;
}

export default class AuthController {
  // 登录
  public static async login(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const body = ctx.request.body as UserType;

    if (body.name) {
      const user = await userRepository
        .createQueryBuilder()
        .where({ name: body.name })
        .addSelect("User.password")
        .getOne();

      if (!user) {
        throw new UnauthorizedException("用户不存在");
      } else if (await argon2.verify(user.password, body.password)) {
        ctx.status = 200;
        ctx.body = {
          message: "成功",
          token: `Bearer ${jwt.sign({ id: user.id }, JWT_SECRET)}`,
        };
      } else {
        throw new UnauthorizedException("账号或密码错误");
      }
    } else {
      throw new UnauthorizedException("账号或密码错误");
    }
    // ctx.body = "Login controller";
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
