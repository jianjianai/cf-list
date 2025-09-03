import { ConfigManager } from "./configManager";
import { User, UserManager } from "./userManager";

export type AuthorizationTokenData = {
    userName: string,// 用户名
    expiresTime: number,// 过期时间
    hash: string,// 数据hash，用于验证数据未被篡改
}
export type AuthorizationManager = ReturnType<typeof createAuthorizationManager>;
export function createAuthorizationManager(configManager: ConfigManager, userManager: UserManager) {
    const configCase = configManager.case<{
        effectiveTime: number, // 授权有效时间，单位秒
    }>("authorization");
    let config = configCase.get();
    if (!config) {
        config = {
            effectiveTime: 14400 // 默认有效时间为4小时
        }
        configCase.set(config);
    }



    /**
     * 验证用户授权
     * @param token 授权token
     * @returns 用户信息或null 如果验证失败则返回null
     */
    async function verifyUserAuthorization(token: string): Promise<User | null> {
        let data: AuthorizationTokenData;
        try {
            data = JSON.parse(atob(token));
        } catch (error) {
            return null;
        }
        if (data.expiresTime < Date.now()) {
            return null;
        }
        const user = userManager.getUser(data.userName);
        if (!user) return null;
        if (data.hash !== await generateAuthorizationTokenHash(data.userName, user.permissions, data.expiresTime, userManager.getPasswordSalt())) {
            return null;
        }
        return user;
    }

    /**
     * 创建用户授权
     * @param user 用户信息
     * @returns 授权token
     */
    async function createUserAuthorization(user: User): Promise<string> {
        const expiresTime = Date.now() + config!.effectiveTime * 1000;
        const authorizationTokenData: AuthorizationTokenData = {
            userName: user.userName,
            expiresTime: expiresTime,
            hash: await generateAuthorizationTokenHash(user.userName, user.permissions, expiresTime, userManager.getPasswordSalt())
        };
        return btoa(JSON.stringify(authorizationTokenData));
    }

    return {
        verifyUserAuthorization,
        createUserAuthorization
    }
}


async function generateAuthorizationTokenHash(userName: string, permissions: string[], expiresTime: number, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${userName}:${permissions.join(",")}:${expiresTime}`);
    const saltBytes = encoder.encode(salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const combinedBuffer = new Uint8Array(hashBuffer.byteLength + saltBytes.byteLength);
    combinedBuffer.set(new Uint8Array(hashBuffer), 0);
    combinedBuffer.set(new Uint8Array(saltBytes), hashBuffer.byteLength);
    const finalHashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer);
    return Array.from(new Uint8Array(finalHashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}