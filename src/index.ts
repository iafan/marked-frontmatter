import type { TokenizerExtension, RendererExtension } from 'marked'
import { load as parseYaml } from 'js-yaml'
import { renderJson, JsonValue } from 'json-to-frontmatter-html'

/**
 * Parse frontmatter content as YAML or JSON.
 * If content starts with '{', parse as JSON; otherwise parse as YAML.
 */
export function parseFrontmatter(content: string): JsonValue {
  const trimmed = content.trim()
  if (trimmed.startsWith('{')) {
    return JSON.parse(trimmed)
  }
  return parseYaml(trimmed) as JsonValue
}

/**
 * Post-process rendered HTML to convert frontmatter placeholders to actual HTML.
 * Call this after marked.parse() completes and DOM is ready.
 */
export function renderFrontmatterBlocks(): void {
  const containers = document.querySelectorAll<HTMLElement>('.frontmatter-raw')

  for (const container of containers) {
    const content = container.textContent || ''
    if (!content.trim()) continue

    try {
      const data = parseFrontmatter(content)
      const html = renderJson(data)
      // Wrap in frontmatter-specific container for styling
      container.outerHTML = `<div class="frontmatter-container">${html}</div>`
    } catch (error) {
      console.error('Failed to render frontmatter:', error)
    }
  }
}

/**
 * Marked extension that intercepts YAML/JSON frontmatter at the start of documents.
 * Use with: marked.use({ extensions: [frontmatterExtension] })
 */
export const frontmatterExtension: TokenizerExtension & RendererExtension = {
  name: 'frontmatter',
  level: 'block',
  start(src: string) {
    // Only match at the very start of the document
    if (src.match(/^---\r?\n/)) {
      return 0
    }
    return undefined
  },
  tokenizer(src: string) {
    // Match YAML frontmatter: ---\n...\n---
    const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
    if (match) {
      return {
        type: 'frontmatter',
        raw: match[0],
        text: match[1],
      }
    }
    return undefined
  },
  renderer(token) {
    // Escape HTML in the raw content
    const escaped = token.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<div class="frontmatter-raw">${escaped}</div>\n`
  },
}

