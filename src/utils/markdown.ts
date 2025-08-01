import MarkdownIt from 'markdown-it'

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: true,        // 允许在源码中使用 HTML 标签
  linkify: true,     // 将文本中的链接自动转换为链接
  typographer: true, // 启用一些语言中性的替换 + 引号美化
})

// 渲染 markdown 文本为 HTML
export const renderMarkdown = (markdownText: string): string => {
  return md.render(markdownText)
}

// 将 markdown 转换为纯文本
export const markdownToText = (markdownText: string): string => {
  const html = md.render(markdownText)
  // 简单的 HTML 标签清理，实际项目中可能需要更完善的清理
  return html.replace(/<[^>]*>/g, '')
}

export default md