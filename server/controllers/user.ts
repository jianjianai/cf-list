import { Authorization } from "../../types/api";
import { registerController, createJsonHandler } from "../controller";

// 登录请求体类型
interface LoginRequest {
    userName: string;
    password: string;
}

registerController({
    path: "/users/login",
    permission: undefined,
    handler: createJsonHandler(async (req, { userManager, authorizationManager }): Promise<Authorization> => {
        // 验证请求方法
        if (req.method !== 'POST') {
            throw new Error("Method not allowed. Use POST");
        }

        // 解析请求体
        let loginData: LoginRequest;
        try {
            loginData = await req.json();
        } catch (error) {
            throw new Error("Invalid JSON in request body");
        }

        // 验证必需字段
        if (!loginData.userName || !loginData.password) {
            throw new Error("Username and password are required");
        }

        // 验证用户凭据
        const user = await userManager.verifyUserPassword(loginData.userName, loginData.password);
        if (!user) {
            throw new Error("Invalid username or password");
        }

        // 创建授权token
        const token = await authorizationManager.createUserAuthorization(user);

        // 返回授权信息
        return {
            userName: user.userName,
            token: token,
            permissions: user.permissions
        };
    }),
});