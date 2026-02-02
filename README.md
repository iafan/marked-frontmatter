# marked-frontmatter

Marked extension for rendering YAML/JSON frontmatter as HTML tree tables.

## Installation

```bash
npm install marked-frontmatter json-to-frontmatter-html tree-to-html marked
```

Or install from GitHub:

```json
{
  "dependencies": {
    "marked": "^17.0.0",
    "marked-frontmatter": "github:iafan/marked-frontmatter",
    "json-to-frontmatter-html": "github:iafan/json-to-frontmatter-html",
    "tree-to-html": "github:iafan/tree-to-html"
  }
}
```

## Usage

```typescript
import { marked } from 'marked'
import { frontmatterExtension, renderFrontmatterBlocks } from 'marked-frontmatter'

// Register the extension
marked.use({ extensions: [frontmatterExtension] })

// Parse markdown
const markdown = `---
title: My Document
author:
  name: John Doe
  email: john@example.com
tags:
  - typescript
  - markdown
---

# Content here
`

const html = marked.parse(markdown)
document.body.innerHTML = html

// Post-process to render frontmatter
renderFrontmatterBlocks()
```

## How It Works

1. The extension detects YAML frontmatter at the start of a document (between `---` delimiters)
2. During parsing, it outputs a placeholder `<div class="frontmatter-raw">...</div>`
3. Call `renderFrontmatterBlocks()` after the DOM is ready to convert placeholders to tree tables

The frontmatter is rendered using [json-to-frontmatter-html](https://github.com/iafan/json-to-frontmatter-html), which uses [tree-to-html](https://github.com/iafan/tree-to-html) for consistent styling.

## JSON Frontmatter

The extension also supports JSON frontmatter:

```markdown
---
{
  "title": "My Document",
  "version": "1.0.0"
}
---
```

If the frontmatter content starts with `{`, it's parsed as JSON; otherwise as YAML.

## API

### `frontmatterExtension`

Marked extension object. Register with `marked.use({ extensions: [frontmatterExtension] })`.

### `renderFrontmatterBlocks(): void`

Post-process the DOM to convert frontmatter placeholders to rendered HTML.

### `parseFrontmatter(content: string)`

Parse frontmatter content string as YAML or JSON. Returns a plain JavaScript object.

## Output HTML Structure

```html
<div class="frontmatter-container">
  <div class="tree-container">
    <table class="tree-table">
      <!-- Key-value rows -->
    </table>
  </div>
</div>
```

The outer `.frontmatter-container` allows styling frontmatter separately from regular tree blocks.

## Styling

Uses tree-to-html classes for the tree structure. Add styles for `.frontmatter-container` to customize the frontmatter appearance:

```css
.frontmatter-container {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #0066cc;
}

.frontmatter-container .tree-comment {
  color: #333;
  font-style: normal;
}
```

## License

This is free and unencumbered software released into the public domain (Unlicense).
