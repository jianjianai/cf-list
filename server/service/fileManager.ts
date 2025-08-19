import { DriveManager, FilePreviewInfo, Folder, File } from "./driveManager";


export type FileManager = ReturnType<typeof createFileManager>;
export function createFileManager(driveManager: DriveManager) {
    return {
        /** 
         * 返回文件列表 
         * @param path 要查的路径
         * @return 如果是一个文件夹，则返回文件夹下的文件和子文件夹列表;如果是一个文件，则返回文件信息;如果文件不存在则返回 undefined.
         * */
        async view(path: string): Promise<(File | Folder)[] | File | undefined> {
            const driveFolder = driveManager.retrieveFolder(path);
            const retrieveDrive = driveManager.retrieveDrive(path);
            // 如果有驱动挂载则优先处理驱动路径，一定是以文件夹的方式显示
            if (driveFolder && driveFolder.length > 0) {
                const files: (File | Folder)[] = driveFolder.map(item => ({ type: "folder", name: item }));
                if (retrieveDrive) {
                    const fileView = await retrieveDrive.drive.view(retrieveDrive.drivePath);
                    // 如果驱动返回的也是文件夹，则合并到文件列表中，如果是文件则忽略
                    if (fileView && Array.isArray(fileView)) {
                        for (const file of fileView) {
                            files.push(file);
                        }
                    }
                }
                return files;
            }
            if (retrieveDrive) {
                return retrieveDrive.drive.view(retrieveDrive.drivePath);
            }
            return undefined;
        },

        /** 
         * 返回文件预览信息
         * @param path 要查的路径
         * @return 返回文件下载链接,如果文件不存在则返回 undefined
         * */
        async previewInfos(path: string): Promise<FilePreviewInfo[] | undefined> {
            const retrieveDrive = driveManager.retrieveDrive(path);
            if (retrieveDrive) {
                return retrieveDrive.drive.previewInfos(retrieveDrive.drivePath);
            }
            return undefined;
        }
    }
}