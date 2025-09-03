import { putNotification } from "../notification/notification";
import type { Authorization } from "@ftypes/api";

// 登录请求参数类型
interface LoginCredentials {
    userName: string;
    password: string;
}

export async function authorizationFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, options);
    if (response.status === 200) {
        return response;
    }
    if (response.status === 500) {
        const errorText = await response.text();
        putNotification({ type: "error", message: `Server error: ${errorText}` });
        throw new Error(`Server error: ${errorText}`);
    }
    putNotification({ type: "error", message: `Unexpected response status: ${response.status}` });
    throw new Error(`Unexpected response status: ${response.status}`);
}

export async function authorizationFetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await authorizationFetch(url, options);
    const data = await response.json();
    return data as T;
}

/**
 * 用户登录
 * @param credentials 登录凭据
 * @returns 授权信息
 */
export async function login(credentials: LoginCredentials): Promise<Authorization> {
    try {
        const authorization = await authorizationFetchJson<Authorization>("/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });
        
        putNotification({ type: "success", message: `欢迎回来，${authorization.userName}!` });
        return authorization;
    } catch (error) {
        putNotification({ type: "error", message: `登录失败: ${(error as Error).message}` });
        throw error;
    }
}