// 预览信息类型定义
export type MarkdownitPreviewInfo = { content: string; };
export type PreTextPreviewPreviewInfo = { content: string; };

export type PIB<T, P> = { type: T, previewInfo: P };
export type URLPreviewInfo = { url: string };
export type URLPIB<T> = PIB<T, URLPreviewInfo>;

export type PreviewInfo =
    | URLPIB<"GenericDown">
    | URLPIB<"MarkdownitURLPreview">
    | PIB<"MarkdownitPreview", MarkdownitPreviewInfo>
    | URLPIB<"APlayerMusicPreview">
    | URLPIB<"ArtplayerVideoPreview">
    | URLPIB<"ImgPreview">
    | PIB<"PreTextPreview", PreTextPreviewPreviewInfo>
    | URLPIB<"PreTextURLPreview">
    | URLPIB<"PdfVue3PDFPreview">;