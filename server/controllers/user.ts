import { APIFile, APIFileList, APIFilePreviewInfo } from "../../types/api";
import { registerController, createJsonHandler } from "../controller";

interface LoginRequest {
    userName: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
}

registerController({
    path: "/users/login",
    permission: undefined,
    handler: createJsonHandler(async (req, { userManager, authorizationManager }): Promise<LoginResponse> => {
        try {
            const body = await req.json() as LoginRequest;
            const { userName, password } = body;

            if (!userName || !password) {
                return {
                    success: false,
                    message: "用户名和密码不能为空"
                };
            }

            const user = await userManager.verifyUserPassword(userName, password);
            if (!user) {
                return {
                    success: false,
                    message: "用户名或密码错误"
                };
            }

            const token = await authorizationManager.createUserAuthorization(user);
            return {
                success: true,
                token,
                message: "登录成功"
            };
        } catch (error) {
            return {
                success: false,
                message: "登录请求处理失败"
            };
        }
    }),
});