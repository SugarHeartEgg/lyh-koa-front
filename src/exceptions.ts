export class BaseException extends Error {
  // 状态码
  status: number;
  // 提示信息
  message: string;
}

// 未发现异常
export class NotFoundException extends BaseException {
  status = 404;

  constructor(msg?: string) {
    super();
    this.message = msg || "无此内容";
  }
}

// 未经授权的异常
export class UnauthorizedException extends BaseException {
  status = 401;
  constructor(msg?: string) {
    super();
    this.message = msg || "尚未登录";
  }
}

// 禁止异常
export class ForbiddenException extends BaseException {
  status = 403;
  constructor(msg?: string) {
    super();
    this.message = msg || "权限不足";
  }
}

// 服务异常
export class ServiceException extends BaseException {
  status = 500;
  constructor(msg?: string) {
    super();
    this.message = msg || "系统故障";
  }
}
