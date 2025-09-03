export type ConfigPersistenceer = {
    get: () => Promise<any>,
    set: (config: any) => Promise<void>
}

type ConfigPersistenceerCreateer = (...args: any[]) => ConfigPersistenceer | Promise<ConfigPersistenceer>;
const ConfigPersistenceerCreateers: { [key: string]: ConfigPersistenceerCreateer } = {};

export function regConfigPersistenceerCreateer(name: string, createer: ConfigPersistenceerCreateer) {
    ConfigPersistenceerCreateers[name] = createer;
}

export function getConfigPersistenceer(name: string): ConfigPersistenceerCreateer | undefined {
    return ConfigPersistenceerCreateers[name];
}