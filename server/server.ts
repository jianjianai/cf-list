import { createDriveManager, Drive, DriveManager } from "./service/driveManager";
import { createFileManager } from "./service/fileManager";


export type Server = ReturnType<typeof createServer>;
export function createServer(rootDrive:Drive){
    const driveManager: DriveManager = createDriveManager();
    driveManager.mount("/", rootDrive);
    // TODO 加载配置文件

    const fileManager = createFileManager(driveManager);
    return {
        rootDrive,
        driveManager,
        fileManager,
    }
}