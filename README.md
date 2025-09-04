# cf-list

一个基于 edge function 运行的文件列表

## 功能特性

- 🚀 基于 Cloudflare Workers 的高性能文件浏览
- 📱 响应式设计，支持桌面和移动设备
- 🎨 现代化的用户界面
- 📁 支持多种文件类型预览
- 🔒 用户认证和权限管理
- ⚡ 优化的性能和缓存系统

## 支持的文件类型

- 📖 **文档**: PDF, Markdown, 纯文本
- 🖼️ **图片**: JPG, PNG, GIF, WebP, SVG
- 🎵 **音频**: MP3, WAV, OGG, FLAC
- 🎬 **视频**: MP4, WebM, OGG, AVI

## 技术栈

- **前端**: Vue 3 + TypeScript + Vite
- **后端**: Cloudflare Workers
- **UI组件**: 自定义组件系统
- **代码分割**: 优化的构建配置

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建
pnpm run build

# 部署
pnpm run deploy
```

## 环境变量

需要配置 `CCP` 环境变量来指定配置持久化器：

```json
{
  "name": "配置持久化器名称",
  "args": ["参数1", "参数2"]
}
```

