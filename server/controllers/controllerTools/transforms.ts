import { APIFile, APIFolder, APIFileList, APIView } from "../../../types/api";
import { Folder, File, FileList } from "../../service/driveManager";

export function folderToAPIFolder(folder: Folder): APIFolder {
    return {
        type: "folder",
        name: folder.name,
        size: folder.size,
        lastModified: folder.lastModified,
    };
}

export function fileToAPIFile(file: File): APIFile {
    return {
        type: "file",
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        previewInfos: file.previewInfos,
    };
}

export function fileListToAPIFileList(fileList: FileList): APIFileList {
    return fileList.map(item => {
        if (item.type === "file") {
            return fileToAPIFile(item);
        } else if (item.type === "folder") {
            return folderToAPIFolder(item);
        } else {
            throw new Error("Unknown item type in file list");
        }
    });
}

export function allToAPI(t: FileList | File, path: string): APIView {
    if (Array.isArray(t)) {
        const aPIFileList = fileListToAPIFileList(t);
        const infoFile = aPIFileList.find(item => item.type === "file" && item.name && item.name.toUpperCase() === "README.MD") as APIFile | undefined;
        return { list: aPIFileList, infoFile: infoFile ? { path: path + "/README.MD", file: infoFile } : null };
    } else {
        return { list: null, infoFile: { file: fileToAPIFile(t), path: path } };
    }
}