export type ConfigPersistenceer = {
    get: () => Promise<any>,
    set: (config: any) => Promise<void>
}

type ConfigPersistenceerCreateer = (...args: any[]) => ConfigPersistenceer | Promise<ConfigPersistenceer>;
const ConfigPersistenceerCreateers: { [key: string]: ConfigPersistenceerCreateer } = {};

/**
 * 注册配置文件持久化实现
 * @param name 名称
 * @param createer 创建器
 */
export function regConfigPersistenceerCreateer(name: string, createer: ConfigPersistenceerCreateer) {
    ConfigPersistenceerCreateers[name] = createer;
}

/**
 * 获取配置文件持久化实现
 * @param name 名称
 * @returns 创建器
 */
export function getConfigPersistenceer(name: string): ConfigPersistenceerCreateer | undefined {
    return ConfigPersistenceerCreateers[name];
}