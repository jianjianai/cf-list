import { generatePasswordHash, generateRandomString } from "../controllers/controllerTools/encryptions";
import { ConfigManager } from "./configManager";

// 权限类型定义
export type Permission = keyof typeof permissionDef;
export const permissionDef = {
    read: { label: "读取", description: "允许读取文件和目录" },
};

interface UserManagerConfig {
    /** 用于密码hash加盐 */
    passwordSalt: string;
    /** 访客默认权限 */
    visitorPermissions: Permission[];
    // 用户列表
    users: ConfigUser[];
}
type ConfigUser = {
    userName: string; // 用户名
    passwordHash: string; // 密码
    permissions: Permission[]; // 权限列表
}

export async function createDefaultUserManagerConfig(): Promise<UserManagerConfig> {
    const salt = generateRandomString(16);
    return {
        passwordSalt: salt,
        visitorPermissions: ["read"], // 访客默认权限
        users: [
            {
                userName: "root",
                passwordHash: await generatePasswordHash("root", salt), // 需要在创建时设置密码
                permissions: Object.keys(permissionDef) as Permission[], // root用户拥有所有权限
            }
        ]
    }
}

export type User = {userName: string;permissions: Permission[];};
export type UserManager = Awaited<ReturnType<typeof createUserManager>>;
export async function createUserManager(configManager:ConfigManager) {
    const configCase = configManager.case<UserManagerConfig>("users");
    let userloading: UserManagerConfig | undefined = configCase.get();
    if(!userloading){
        userloading = await createDefaultUserManagerConfig();
        configCase.set(userloading);
    }
    const config: UserManagerConfig = userloading;

    /** 获取所有用户信息 */
    function getAllUsers():User[] {
        return config.users.map(user => ({
            userName: user.userName,
            permissions: user.permissions
        }));
    }
    /** 验证用户密码 */
    async function verifyUserPassword(userName: string, password: string): Promise<User | null> {
        const user = config.users.find(u => u.userName === userName);
        if (!user) return null;
        const hash = await generatePasswordHash(password, config.passwordSalt);
        if (hash === user.passwordHash) {
            return { userName: user.userName, permissions: user.permissions };
        }
        return null;
    }

    function getUser(userName: string): User | null {
        const user = config.users.find(u => u.userName === userName);
        if (!user) return null;
        return { userName: user.userName, permissions: user.permissions };
    }

    return {
        getConfig: () => {
            return config;
        },
        verifyUserPassword,
        getAllUsers,
        getPasswordSalt: () => config.passwordSalt,
        getUser,
        getVisitorPermissions: () => config.visitorPermissions
    }
}