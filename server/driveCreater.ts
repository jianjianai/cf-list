import { Drive } from "./service/driveManager";


export interface DriveCreater {
    /** 驱动名称 */
    name: string;
    /** 驱动描述 */
    description?: string;
    /** 驱动创建函数 */
    create: (...args: any[]) => Drive;
    /** 驱动创建函数参数,前端校验 */
    args?: DriveCreateArgsRule[];
}

export type DriveCreateArgsRule = DriveCreateArgsRuleString | DriveCreateArgsRuleBoolean | DriveCreateArgsRuleSelect;
export interface DriveCreateArgsRuleBase{
    /** 参数名称前端显示 */
    name: string;
    /** 参数描述前端显示 */
    description?: string;
    /** 是否必填 */
    required?: boolean;
}
export interface DriveCreateArgsRuleString extends DriveCreateArgsRuleBase {
    type: "string";
    /** 正则校验 */
    regExp?: string;
    /** 默认值 */
    defaultValue?: string;
}
export interface DriveCreateArgsRuleBoolean extends DriveCreateArgsRuleBase {
    type: "boolean";
    /** 是否默认选中 */
    defaultValue?: boolean;
}
export interface DriveCreateArgsRuleSelect extends DriveCreateArgsRuleBase {
    type: "select";
    /** 选项列表 */
    options: {value: string, label: string}[];
    /** 默认选中项 */
    defaultValue?: string;
}

const driveCreaters:DriveCreater[] = [];
export function registerDriveCreater(driveCreater: DriveCreater) {
    driveCreaters.push(driveCreater);
}
export function getDriveCreaters() {
    return driveCreaters;
}
export function getDriveCreater(name: string) {
    return driveCreaters.find(d => d.name === name);
}