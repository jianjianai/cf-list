export interface File {
    type: "file";
    /** 文件名 */
    name: string;
    /** 文件大小 */
    size?: number;
    /** 文件修改时间 */
    lastModified?: number;
    /** 文件下载信息,如果无需二次请求可以得到下载信息可以加上当需要下载时就无需调用downloadInfo获取了 */
    downloadInfo?: FileDownloadInfo;
    /** 文件预览信息,如果无需二次请求可以得到预览信息可以加上当需要预览时就无需调用previewInfo获取了 */
    previewInfo?: FilePreviewInfo;
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
export type FileList = (File | Folder)[];
export type FileDownloadInfo = FileDownloadInfoDirect | FileDownloadInfoProxy;
export type FilePreviewInfo = FileDownloadInfo;
export interface FileDownloadInfoDirect {
    type: "direct";
    /** 文件下载链接 */
    url: string;
}
export interface FileDownloadInfoProxy {
    /** 代理下载将加密下载链接和请求头 */
    type: "proxy";
    /** 文件下载链接 */
    url: string;
    /** 下载所需请求头 */
    headers?: `${string}: ${string}`[];
}




export interface Drive {
    /** 
     * 返回文件列表 
     * @param path 要查的路径
     * @return 如果是一个文件夹，则返回文件夹下的文件和子文件夹列表;如果是一个文件，则返回文件信息;如果文件不存在则返回 undefined.
     * */
    view(path: string): Promise<FileList | File | undefined>;

    /** 
     * 返回文件下载信息
     * @param path 要查的路径
     * @return 返回文件下载链接,如果文件不存在则返回 undefined
     * */
    downloadInfo(path: string): Promise<FileDownloadInfo | undefined>;

    /** 
     * 返回文件预览信息
     * @param path 要查的路径
     * @return 返回文件下载链接,如果文件不存在则返回 undefined
     * */
    previewInfo(path: string): Promise<FilePreviewInfo | undefined>;
}
export type DriveManager = ReturnType<typeof createDriveManager>;
export function createDriveManager() {
    // 挂在的驱动树
    type DriveTree = {
        /** 挂载的路径 */
        next?: { [key: string]: DriveTree };
        /** 挂载的驱动 */
        drive?: Drive;
    };
    const driveTree: DriveTree = {};

    return {
        /**
         * 挂载驱动
         * @param path 挂载路径
         * @param drive 驱动实例
         */
        mount(path: string, drive: Drive) {
            const parts = path.split("/").filter(Boolean); // 分割路径并过滤空字符串
            if (parts.length === 0) {
                driveTree.drive = drive; // 如果路径为空，直接挂载驱动
                return;
            }
            let current = driveTree;
            for (const part of parts) {
                if (!current.next) {
                    current.next = {};
                }
                if (!current.next[part]) {
                    current.next[part] = {};
                }
                current = current.next[part];
            }
            current.drive = drive; // 在最后一部分挂载驱动
        },

        /**
         * 获取当前路径访问文件应该使用的驱动和驱动路径
         * @param path 要查找驱动的路径
         * @return 返回驱动实例和要查找驱动的路径对于当前驱动的路径
         * 例: /a/c 挂在了一个驱动 查找 /a/c/d/e 则返回 /d/e 和驱动实例
         * 如果路径不在挂载的驱动中，返回 undefined
         */
        retrieveDrive(path: string): { drivePath: string, drive: Drive } | undefined {
            const parts = path.split("/").filter(Boolean); // 分割路径并过滤空字符串
            let resultDrive = driveTree.drive;
            let resultIndex = -1;
            let current: DriveTree | undefined = driveTree;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                current = current?.next?.[part];
                if (!current) {
                    break; // 如果当前路径不存在，停止查找
                }
                if (current.drive) {
                    resultDrive = current.drive; // 更新找到的驱动
                    resultIndex = i;
                }
            }
            if (resultDrive) {
                // 返回找到的驱动和剩余路径
                return {
                    drivePath: "/" + parts.slice(resultIndex + 1).join("/"),
                    drive: resultDrive,
                };
            }
            return undefined; // 如果没有找到驱动，返回 undefined
        },

        /**
         * 获取当前文件夹下的全部子文件夹
         * @param path 要查的路径
         * @return 返回文件夹列表 例如：挂载了3个驱动 "/" "/a" "/c/d" path="/" 则返回 ["a", "c"] , path="/c" 则返回 ["d"]   
         */
        retrieveFolder(path: string): string[] {
            const parts = path.split("/").filter(Boolean); // 分割路径并过滤空字符串
            let current: DriveTree | undefined = driveTree;
            for (const part of parts) {
                current = current?.next?.[part];
                if (!current) {
                    return []; // 如果当前路径不存在，返回空数组
                }
            }
            // 返回当前路径下的所有子文件夹
            return Object.keys(current.next || {});
        }
    }
}