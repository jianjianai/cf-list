import { FilePreviewInfo } from "../service/driveManager";

/**
 * 创建一个通用的下载链接预览信息
 * @param url 下载链接
 * **/
export function cGenericDownInfo(url: string): FilePreviewInfo {
    return {
        type: "GenericDown",
        previewInfo: {
            url: url,
        }
    }
}