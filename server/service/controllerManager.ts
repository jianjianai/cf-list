import { Server } from "../server";

export type RequestHandler = (req: Request, server: Server) => Promise<Response> | Response;
export interface Controller {
    /** 监听的路径优先字符串之后正则表达式 */
    path: string | RegExp;
    /** 处理函数 */
    handler: RequestHandler;
    /** 权限 */
    permission?: string[];
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


export function registerController(controller: Controller) {
    if (typeof controller.path === "string") {
        controllers.unshift(controller);
    } else {
        controllers.push(controller);
    }
}



export async function executeController(req: Request, permission: string[], server: Server): Promise<Response> {
    const pahtname = new URL(req.url).pathname;
    // 查找匹配的 Controller
    const controller = matchController(pahtname);
    if (!controller) {
        return new Response("Not Found", { status: 404 });
    }
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
        return await controller.handler(req, server);
    } catch (error) {
        console.error("Controller error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export function createJsonHandler<T>(handler: (req: Request, server: Server) => Promise<T> | T): RequestHandler {
    return async (req, server) => Response.json(await handler(req, server));
}