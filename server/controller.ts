import { Server } from "./server";
import { Permission, User } from "./service/userManager";


export type RequestHandler = (req: Request, server: Server, user: User) => Promise<Response> | Response;
export interface Controller {
    /** 监听的路径优先字符串之后正则表达式 */
    path: string | RegExp;
    /** 处理函数 */
    handler: RequestHandler;
    /** 权限 */
    permission?: Permission[];
}

const controllers: Controller[] = [];
function matchController(path: string): Controller | undefined {
    return controllers.find(controller => {
        if (typeof controller.path === "string") {
            return controller.path === path;
        } else {
            return controller.path.test(path);
        }
    });
}

/**
 * 注册 Controller
 * @param controller 注册 Controller
 */
export function registerController(controller: Controller) {
    if (typeof controller.path === "string") {
        controllers.unshift(controller);
    } else {
        controllers.push(controller);
    }
}


/**
 * 执行请求
 * @param req 请求 
 * @param permission 权限 
 * @param server 服务器实例
 * @returns 响应
 */
export async function executeController(req: Request, user: User, server: Server): Promise<Response> {
    const pahtname = new URL(req.url).pathname;
    // 查找匹配的 Controller
    const controller = matchController(pahtname);
    if (!controller) {
        return new Response("Not Found", { status: 404 });
    }
    const permission = user.permissions || [];
    // 检查权限 permission 包含全部 Controller 需要的权限才允许访问
    if (controller.permission) {
        for (const perm of controller.permission) {
            if (!permission.includes(perm)) {
                return new Response("Forbidden", { status: 403 });
            }
        }
    }
    // 执行
    try {
        return await controller.handler(req, server, user);
    } catch (error) {
        console.error("Controller error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export function createJsonHandler<T>(handler: (req: Request, server: Server) => Promise<T> | T): RequestHandler {
    return async (req, server) => Response.json(await handler(req, server));
}