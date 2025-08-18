export interface APIFile {
    type: "file";
    /** 文件名 */
    name: string;
    /** 文件大小 */
    size?: number;
    /** 文件修改时间 */
    lastModified?: number;
    /** 文件下载信息,如果没有则需要获取 */
    downloadInfo?: APIFileDownloadInfo;
    /** 文件预览信息,如果没有则需要获取 */
    previewInfo?: APIFilePreviewInfo;
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

export type APIFileDownloadInfo = APIFileDownloadInfoURL;
export type APIFilePreviewInfo = APIFileDownloadInfo;
export type APIFileList = (APIFile | APIFolder)[];

export interface APIFileDownloadInfoURL{
    type: "url";
    /** 文件下载链接 */
    url: string;
}

export type previewType = "download";