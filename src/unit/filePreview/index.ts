import { type Component, defineAsyncComponent } from "vue";
import type { APIFile } from "@ftypes/api";
import LoadError from "../smallElements/LoadError.vue";
import Loading from "../smallElements/Loading.vue";
import type { MarkdownitPreviewInfo } from "./preview/MarkdownitPreview.vue";
import type { PreTextPreviewPreviewInfo } from "./preview/PreTextPreview.vue";


export type ViewComponent<T> = {
    component: Component<{ file: APIFile, previewInfo: T }>,
    lable: string,
};


function defineViewComponent<T>(name: string, f: () => Promise<Component<{ file: APIFile, previewInfo: T }>>): ViewComponent<T> {
    return {
        component: defineAsyncComponent({
            errorComponent: LoadError,
            loadingComponent: Loading,
            loader: f
        }),
        lable: name,
    }
}
export type PIB<T extends keyof typeof previewComponents, P> = { type: T, previewInfo: P };
export type URLPreviewInfo = { url: string };
export type URLPIB<T extends keyof typeof previewComponents> = PIB<T, URLPreviewInfo>;

export type PreviewInfo =
    URLPIB<"GenericDown"> |
    URLPIB<"MarkdownitURLPreview"> |
    PIB<"MarkdownitPreview", MarkdownitPreviewInfo>|
    URLPIB<"APlayerMusicPreview"> |
    URLPIB<"ArtplayerVideoPreview">|
    URLPIB<"ImgPreview">|
    PIB<"PreTextPreview", PreTextPreviewPreviewInfo>|
    URLPIB<"PreTextURLPreview">|
    URLPIB<"PdfVue3PDFPreview">;

export const previewComponents = {
    "GenericDown": defineViewComponent("文件下载", () => import("./urlPreview/GenericDown.vue")),
    "MarkdownitURLPreview": defineViewComponent("Markdownit Markdown 预览", () => import("./urlPreview/MarkdownitURLPreview.vue")),
    "MarkdownitPreview": defineViewComponent("Markdownit Markdown 预览", () => import("./preview/MarkdownitPreview.vue")),
    "APlayerMusicPreview": defineViewComponent("APlayer音乐预览", () => import("./urlPreview/APlayerMusicPreview.vue")),
    "ArtplayerVideoPreview": defineViewComponent("Artplayer视频预览", () => import("./urlPreview/ArtplayerVideoPreview.vue")),
    "ImgPreview": defineViewComponent("图片预览", () => import("./urlPreview/ImgPreview.vue")),
    "PreTextPreview": defineViewComponent("纯文本预览", () => import("./preview/PreTextPreview.vue")),
    "PreTextURLPreview": defineViewComponent("纯文本预览", () => import("./urlPreview/PreTextURLPreview.vue")),
    "PdfVue3PDFPreview": defineViewComponent("PDF预览", () => import("./urlPreview/PdfVue3PDFPreview.vue")),
}






