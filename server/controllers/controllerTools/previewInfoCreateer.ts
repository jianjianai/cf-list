import { FilePreviewInfo } from "../../service/driveManager";

/**
 * 创建一个通用的下载链接预览信息
 * @param url 下载链接
 * **/
export function cGenericDownInfo(url: string): FilePreviewInfo {
    return {
        lable: "文件下载",
        type: "GenericDown",
        previewInfo: {
            url: url,
        }
    }
}

/** * 创建一个 Markdownit 预览信息
 * @param url 下载链接
 * **/
export function cMarkdownitURLPreviewInfo(url: string): FilePreviewInfo {
    return {
        lable: "Markdownit Markdown 预览",
        type: "MarkdownitURLPreview",
        previewInfo: {
            url: url,
        }
    }
}

/** * 创建一个 Markdownit 预览信息
 * @param content Markdown 内容
 * **/
export function cMarkdownitPreviewInfo(content: string): FilePreviewInfo {
    return {
        lable: "Markdownit Markdown 预览",
        type: "MarkdownitPreview",
        previewInfo: {
            content: content,
        }
    }
}


/** * 创建一个 APlayer 音乐预览信息
 * @param url 音乐文件下载链接
 * **/
export function cAPlayerMusicPreviewInfo(url: string): FilePreviewInfo {
    return {
        lable: "APlayer 音乐预览",
        type: "APlayerMusicPreview",
        previewInfo: {
            url: url,
        }
    }
}

/** * 创建一个 Artplayer 视频预览信息
 * @param url 视频文件下载链接
 * **/
export function cArtplayerVideoPreviewInfo(url: string): FilePreviewInfo {
    return {
        lable: "Artplayer 视频预览",
        type: "ArtplayerVideoPreview",
        previewInfo: {
            url: url,
        }
    }
}

/** * 创建一个图片预览信息
 * @param url 图片文件下载链接
 * **/
export function cImgPreviewInfo(url: string): FilePreviewInfo {
    return {
        lable: "图片预览",
        type: "ImgPreview",
        previewInfo: {
            url: url,
        }
    }
}

/** * 创建一个文本预览信息
 * @param content 文本内容
 * **/
export function cPreTextPreviewInfo(content: string): FilePreviewInfo {
    return {
        lable: "纯文本预览",
        type: "PreTextPreview",
        previewInfo: {
            content: content,
        }
    }
}

/** * 创建一个文本文件预览信息
 * @param url 文本文件下载链接
 * **/
export function cPreTextURLPreviewInfo(url: string): FilePreviewInfo {
    return {
        lable: "纯文本预览",
        type: "PreTextURLPreview",
        previewInfo: {
            url: url,
        }
    }
}

/** * 创建一个 PDF 预览信息
 * @param url PDF 文件下载链接
 * **/
export function cPdfVue3PDFPreviewInfo(url: string): FilePreviewInfo {
    return {
        lable: "PDF 预览",
        type: "PdfVue3PDFPreview",
        previewInfo: {
            url: url,
        }
    }
}