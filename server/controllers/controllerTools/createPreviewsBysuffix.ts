import { FilePreviewInfo } from "../../service/driveManager";
import { cAPlayerMusicPreviewInfo, cArtplayerVideoPreviewInfo, cGenericDownInfo, cImgPreviewInfo, cMarkdownitURLPreviewInfo, cPdfVue3PDFPreviewInfo, cPreTextURLPreviewInfo } from "./previewInfoCreateer";

type CreateFilePreviewInfoByUrl = (url: string) => FilePreviewInfo;
const suffixMap: Record<string, CreateFilePreviewInfoByUrl[]> = {
    // Video formats
    mp4: [cArtplayerVideoPreviewInfo], mkv: [cArtplayerVideoPreviewInfo], webm: [cArtplayerVideoPreviewInfo],
    m3u8: [cArtplayerVideoPreviewInfo], ts: [cArtplayerVideoPreviewInfo], avi: [cArtplayerVideoPreviewInfo],
    mov: [cArtplayerVideoPreviewInfo], wmv: [cArtplayerVideoPreviewInfo], flv: [cArtplayerVideoPreviewInfo],

    // Audio formats
    mp3: [cAPlayerMusicPreviewInfo], flac: [cAPlayerMusicPreviewInfo], wav: [cAPlayerMusicPreviewInfo],

    // Markdown
    md: [cMarkdownitURLPreviewInfo, cPreTextURLPreviewInfo],

    // Image formats
    jpg: [cImgPreviewInfo], jpeg: [cImgPreviewInfo], png: [cImgPreviewInfo], gif: [cImgPreviewInfo],
    bmp: [cImgPreviewInfo], webp: [cImgPreviewInfo], svg: [cImgPreviewInfo], ico: [cImgPreviewInfo], tiff: [cImgPreviewInfo],

    // PDF
    pdf: [cPdfVue3PDFPreviewInfo],

    // Text formats
    txt: [cPreTextURLPreviewInfo], text: [cPreTextURLPreviewInfo], yml: [cPreTextURLPreviewInfo],
    yaml: [cPreTextURLPreviewInfo], json: [cPreTextURLPreviewInfo],
};

/**
 * 根据文件名后缀生成对应的预览信息数组。
 * 
 * 此函数会根据传入的文件名，提取后缀，并查找对应的预览信息创建函数列表，
 * 然后使用这些函数生成预览信息对象。如果没有匹配的后缀，则返回空数组。
 * 
 * @param name 文件名，用于提取后缀判断文件类型。
 * @param url 文件的访问地址，用于生成预览信息。
 * @returns 返回对应文件类型的预览信息数组，如果没有匹配类型则返回空数组。
 */
export function createPreviewsBySuffix(name: string, url: string): FilePreviewInfo[] {
    const suffix = name.split('.').pop()?.toLowerCase();
    const previewCreators = suffix ? suffixMap[suffix] : undefined;
    return previewCreators ? previewCreators.map(fn => fn(url)) : [];
}
