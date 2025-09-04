/**
 * File utility functions for better performance and reusability
 */

/**
 * Check if a file is a README file
 */
export function isReadmeFile(fileName: string): boolean {
  return fileName.toUpperCase() === 'README.MD';
}

/**
 * Get file extension from filename
 */
export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot > 0 ? fileName.slice(lastDot + 1).toLowerCase() : '';
}

/**
 * Check if a file is an image
 */
export function isImageFile(fileName: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(fileName));
}

/**
 * Check if a file is a video
 */
export function isVideoFile(fileName: string): boolean {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv'];
  return videoExtensions.includes(getFileExtension(fileName));
}

/**
 * Check if a file is an audio file
 */
export function isAudioFile(fileName: string): boolean {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'];
  return audioExtensions.includes(getFileExtension(fileName));
}

/**
 * Check if a file is a text file
 */
export function isTextFile(fileName: string): boolean {
  const textExtensions = ['txt', 'md', 'rst', 'log', 'csv', 'json', 'xml', 'yaml', 'yml', 'ini', 'cfg', 'conf'];
  return textExtensions.includes(getFileExtension(fileName));
}

/**
 * Check if a file is a PDF
 */
export function isPdfFile(fileName: string): boolean {
  return getFileExtension(fileName) === 'pdf';
}

/**
 * Get human-readable file type description
 */
export function getFileTypeDescription(fileName: string): string {
  const ext = getFileExtension(fileName);
  
  if (isImageFile(fileName)) return '图片文件';
  if (isVideoFile(fileName)) return '视频文件';
  if (isAudioFile(fileName)) return '音频文件';
  if (isTextFile(fileName)) return '文本文件';
  if (isPdfFile(fileName)) return 'PDF文档';
  
  return ext ? `${ext.toUpperCase()} 文件` : '未知文件类型';
}