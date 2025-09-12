import { ConfigPersistenceer } from "../configPersistenceer";
import { EventManager } from "./eventManager";

export type Config = {
    [key: string]: any;
};
export type ConfigManager = Awaited<ReturnType<typeof createConfigManager>>;
export interface ConfigCase<T> {
    get(): T | undefined;
    set(value: T | undefined): void;
}
export async function createConfigManager(configPersistenceer: ConfigPersistenceer, eventManager: EventManager) {
    let loadPromise: Promise<void> | null = null;
    let config: Config;
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

    /** 更新配置，使持久化 */
    async function update() {
        if (loadPromise) { try { await loadPromise; } catch (e) { } }
        loadPromise = (async () => {
            if (updated) {
                await configPersistenceer.set(config);
                config = await configPersistenceer.get() || {};
                updated = false;
            }
            loadPromise = null;
        })();
        await loadPromise;
    }
    /** 加载配置，覆盖当前配置 */
    async function loadConfig() {
        if (loadPromise) { try { await loadPromise; } catch (e) { } }
        loadPromise = (async () => {
            config = await configPersistenceer.get() || {};
            updated = false;
        })();
        await loadPromise;
    }

    await loadConfig();
    // 请求完成时触发，持久化配置
    eventManager.registerControllerExecuteAfterEvent(async (event) => { await update() });
    return {
        case: <T>(key: string): ConfigCase<T> => ({
            get: () => getConfig(key) as T | undefined,
            set: (value: T | undefined) => setConfig(key, value)
        })
    };
}