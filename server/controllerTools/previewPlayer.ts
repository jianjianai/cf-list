const fileTypesSuffixConfig: [string[], string[]][] = [
    [[".mp4", ".mkv", ".webm", ".m3u8", ".ts", ".avi", ".mov", ".wmv", ".flv"], ["VideoPlayer"]],
    [[".mp3", ".flac", ".wav"], ["MusicPlayer"]],
    [[".md"], ["MarkdownPlayer"]],
    [[".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg", ".ico", ".tiff",], ["ImgPlayer"]],
    [[".pdf"], ["PDFPlayer"]],
    [[".txt", ".text", ".md", ".yml", ".yaml", ".json"], ["PreTextPlayer"]],
]

const fileTypesSuffix: { [suffix: string]: string[] } = {};
for (const ar of fileTypesSuffixConfig) {
    for (const k of ar[0]) {
        if (!fileTypesSuffix[k]) {
            fileTypesSuffix[k] = [];
        }
        fileTypesSuffix[k].push(...ar[1]);
    }
}
// 去重
for (const k in fileTypesSuffix) {
    fileTypesSuffix[k] = [...new Set(fileTypesSuffix[k])];
}

export function getPreviewBySuffix(suffix: string): string[] {
    return fileTypesSuffix[suffix.toLowerCase()];
}