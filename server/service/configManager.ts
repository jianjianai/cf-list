import type { ConfigPersistenceer } from "../configPersistenceer";
import type { EventManager } from "./eventManager";

export type Config = {
    [key: string]: any;
};
export type ConfigManager = Awaited<ReturnType<typeof createConfigManager>>;
export interface ConfigCase<T> {
    get(): T | undefined;
    set(value: T | undefined): void;
}
export async function createConfigManager(configPersistenceer: ConfigPersistenceer, eventManager: EventManager) {
    let config: Config = await configPersistenceer.get() || {};
    let updated = false;
    /** 获取配置 */
    function getConfig(key: string) {
        return config[key];
    }
    /** 设置配置 */
    function setConfig(key: string, value: any) {
        config[key] = value;
        updated = true;
    }
    /** 检查配置是否更新 */
    function isUpdated() {
        return updated;
    }
    /** 更新配置，使持久化 */
    async function update() {
        if (updated) {
            await configPersistenceer.set(config);
            updated = false;
        }
    }

    // 请求完成时触发，持久化配置
    eventManager.registerControllerExecuteAfterEvent(async (event) => { await update(); });
    return {
        case: <T>(key: string): ConfigCase<T> => ({
            get: () => getConfig(key) as T | undefined,
            set: (value: T | undefined) => setConfig(key, value)
        }),
        isUpdated,
        update
    };
}