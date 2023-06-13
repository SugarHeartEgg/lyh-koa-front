import { Context } from "koa";
import { getManager } from "typeorm";
import { User } from "../entity/user";

interface BodyType {
  id: number;
  name: string;
  email: string;
}

export default class UserController {
  public static async listUsers(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const users = await userRepository.find();
    ctx.status = 200;
    ctx.body = users;
    // ctx.body = "ListUsers controller";
  }

  public static async showUserDetails(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    // const query = ctx.query;
    // const params = ctx.params;

    if (ctx?.params?.id) {
      const id = +ctx?.params?.id;
      const user = await userRepository.findOneBy({
        id,
      });

      if (user) {
        ctx.status = 200;
        ctx.body = user;
      } else {
        ctx.status = 500;
      }
    } else {
      ctx.status = 500;
    }

    // ctx.body = `ShowUserDetails controller with ID = ${ctx.params.id}`;
  }

  public static async updateUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const body = ctx.request.body as BodyType;
    let userInfo = await userRepository.findOneBy({ id: body.id });

    if (userInfo) {
      userInfo.name = body?.name;
      userInfo.email = body?.email;

      // 保存到数据库
      const updatedUser = await userRepository.save(userInfo);

      if (updatedUser) {
        ctx.status = 200;
        ctx.body = updatedUser;
      } else {
        ctx.status = 500;
      }
    } else {
      ctx.status = 500;
    }
    // ctx.body = `UpdateUser controller with ID = ${ctx.params.id}`;
  }

  public static async deleteUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const body = ctx.request.body as BodyType;
    await userRepository.delete(body.id);
    ctx.status = 204;
    // ctx.body = `DeleteUser controller with ID = ${ctx.params.id}`;
  }
}
