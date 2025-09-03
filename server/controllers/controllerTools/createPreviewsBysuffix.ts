import { FilePreviewInfo } from "../../service/driveManager";
import { cAPlayerMusicPreviewInfo, cArtplayerVideoPreviewInfo, cGenericDownInfo, cImgPreviewInfo, cMarkdownitURLPreviewInfo, cPdfVue3PDFPreviewInfo, cPreTextURLPreviewInfo } from "./previewInfoCreateer";

type CreateFilePreviewInfoByUrl = (url: string) => FilePreviewInfo;
// 后缀对应的预览信息创建函数
const fileTypesSuffixConfig: [string[], CreateFilePreviewInfoByUrl[]][] = [
    [["mp4", "mkv", "webm", "m3u8", "ts", "avi", "mov", "wmv", "flv"], [cArtplayerVideoPreviewInfo],],
    [["mp3", "flac", "wav"], [cAPlayerMusicPreviewInfo]],
    [["md"], [cMarkdownitURLPreviewInfo, cPreTextURLPreviewInfo]],
    [["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "tiff",], [cImgPreviewInfo]],
    [["pdf"], [cPdfVue3PDFPreviewInfo]],
    [["txt", "text", "md", "yml", "yaml", "json"], [cPreTextURLPreviewInfo]],
]

const fileTypesSuffix: { [suffix: string]: CreateFilePreviewInfoByUrl[] } = {};
for (const ar of fileTypesSuffixConfig) {
    for (const k of ar[0]) {
        if (!fileTypesSuffix[k]) {
            fileTypesSuffix[k] = ar[1];
        }
        fileTypesSuffix[k].push(...ar[1]);
    }
}
// 去重
for (const k in fileTypesSuffix) {
    fileTypesSuffix[k] = [...new Set(fileTypesSuffix[k])];
}

/** 根据文件名后缀创建预览信息
 * @param name 文件名
 * @param url 下载链接
 * @returns 返回一个预览信息数组，如果没有匹配的后缀则返回空数组
 */
export function createPreviewsBySuffix(name: string, url: string): FilePreviewInfo[] {
    const arrays = [];
    const suffix = name.split('.').pop()?.toLowerCase();
    if (suffix && fileTypesSuffix[suffix]) {
        const creators = fileTypesSuffix[suffix];
        for (const creator of creators) {
            const previewInfo = creator(url);
            if (previewInfo) {
                arrays.push(previewInfo);
            }
        }
    }
    arrays.push(cGenericDownInfo(url)); // 添加通用下载链接预览信息
    return arrays;
}