import type { PreviewInfo } from "@/unit/filePreview";

export interface APIFile {
    type: "file";
    /** 文件名 */
    name: string;
    /** 文件大小 */
    size?: number;
    /** 文件修改时间 */
    lastModified?: number;
    /** 文件预览信息,如果没有则需要获取 */
    previewInfos?: APIFilePreviewInfo[];
}

export interface APIFolder {
    type: "folder";
    /** 文件夹名 */
    name: string;
    /** 文件夹大小 */
    size?: number;
    /** 文件修改时间 */
    lastModified?: number;
}


export type APIFilePreviewInfo = PreviewInfo;
export type APIFileList = (APIFile | APIFolder)[];