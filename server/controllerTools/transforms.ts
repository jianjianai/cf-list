import { APIFile, APIFolder, APIFileList, APIFileDownloadInfo, APIFilePreviewInfo, APIFileDownloadInfoURL } from "../../types/api";
import { Folder, File, FileList, FileDownloadInfo, FilePreviewInfo, FileDownloadInfoDirect, FileDownloadInfoProxy } from "../service/driveManager";

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
        downloadInfo: file.downloadInfo ? downloadInfoToAPIFileDownloadInfo(file.downloadInfo) : undefined,
        previewInfo: file.previewInfo ? previewInfoToAPIFilePreviewInfo(file.previewInfo) : undefined,
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

export function allToAPI(t: FileList | File): APIFile | APIFileList {
    if (Array.isArray(t)) {
        return fileListToAPIFileList(t);
    } else {
        return fileToAPIFile(t);
    }
}



export function downloadInfoToAPIFileDownloadInfo(downloadInfo: FileDownloadInfo): APIFileDownloadInfo {
    if (downloadInfo.type === "direct") {
        return directDownloadInfoToAPIFileDownloadInfo(downloadInfo);
    }
    if (downloadInfo.type === "proxy") {
        return proxyDownloadInfoToAPIFileDownloadInfo(downloadInfo);
    }
    throw new Error("Unknown download info type");
}

export function previewInfoToAPIFilePreviewInfo(previewInfo: FilePreviewInfo): APIFilePreviewInfo {
    if (previewInfo.type === "direct") {
        return directDownloadInfoToAPIFileDownloadInfo(previewInfo);
    }
    if (previewInfo.type === "proxy") {
        return proxyDownloadInfoToAPIFileDownloadInfo(previewInfo);
    }
    throw new Error("Unknown preview info type");
}













function directDownloadInfoToAPIFileDownloadInfo(downloadInfo: FileDownloadInfoDirect): APIFileDownloadInfoURL {
    return {
        type: "url",
        url: downloadInfo.url,
    };
}
function proxyDownloadInfoToAPIFileDownloadInfo(downloadInfo: FileDownloadInfoProxy): APIFileDownloadInfoURL {
    // TODO
    return {
        type: "url",
        url: downloadInfo.url,
    };
}
