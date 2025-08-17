export interface File {
    type: "file";
    /** 文件名 */
    name: string;
    /** 文件大小 */
    size?: number;
    /** 文件修改时间 */
    lastModified?: number;
    /** 文件下载 */
    downloadUrl?: FileDownloadInfo;
}

export interface Folder {
    type: "folder";
    /** 文件夹名 */
    name: string;
    /** 文件夹大小 */
    size?: number;
    /** 文件修改时间 */
    lastModified?: number;
}

export interface FileDownloadInfoBase{
    type: string;
}
export type FileDownloadInfo = FileDownloadInfoURL;
export interface FileDownloadInfoURL extends FileDownloadInfoBase {
    type: "url";
    /** 文件下载链接 */
    url: string;
}