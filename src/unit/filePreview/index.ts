import { type Component, defineAsyncComponent } from "vue";
import type { APIFile } from "@ftypes/api";
import LoadError from "../smallElements/LoadError.vue";
import Loading from "../smallElements/Loading.vue";
import type { MarkdownitPreviewInfo } from "./preview/MarkdownitPreview.vue";
import type { PreTextPreviewPreviewInfo } from "./preview/PreTextPreview.vue";


export type ViewComponent<T> = Component<{ file: APIFile, previewInfo: T }>;


function defineViewComponent<T>(f: () => Promise<Component<{ file: APIFile, previewInfo: T }>>): ViewComponent<T> {
    return defineAsyncComponent({
        errorComponent: LoadError,
        loadingComponent: Loading,
        loader: f
    })
}
export type PIB<T extends keyof typeof previewComponents, P> = { type: T, previewInfo: P, lable: string };
export type URLPreviewInfo = { url: string };
export type URLPIB<T extends keyof typeof previewComponents> = PIB<T, URLPreviewInfo>;

export type PreviewInfo =
    URLPIB<"GenericDown"> |
    URLPIB<"MarkdownitURLPreview"> |
    PIB<"MarkdownitPreview", MarkdownitPreviewInfo> |
    URLPIB<"APlayerMusicPreview"> |
    URLPIB<"ArtplayerVideoPreview"> |
    URLPIB<"ImgPreview"> |
    PIB<"PreTextPreview", PreTextPreviewPreviewInfo> |
    URLPIB<"PreTextURLPreview"> |
    URLPIB<"PdfVue3PDFPreview">;

export const previewComponents = {
    "GenericDown": defineViewComponent(() => import("./urlPreview/GenericDown.vue")),
    "MarkdownitURLPreview": defineViewComponent(() => import("./urlPreview/MarkdownitURLPreview.vue")),
    "MarkdownitPreview": defineViewComponent(() => import("./preview/MarkdownitPreview.vue")),
    "APlayerMusicPreview": defineViewComponent(() => import("./urlPreview/APlayerMusicPreview.vue")),
    "ArtplayerVideoPreview": defineViewComponent(() => import("./urlPreview/ArtplayerVideoPreview.vue")),
    "ImgPreview": defineViewComponent(() => import("./urlPreview/ImgPreview.vue")),
    "PreTextPreview": defineViewComponent(() => import("./preview/PreTextPreview.vue")),
    "PreTextURLPreview": defineViewComponent(() => import("./urlPreview/PreTextURLPreview.vue")),
    "PdfVue3PDFPreview": defineViewComponent(() => import("./urlPreview/PdfVue3PDFPreview.vue")),
}






