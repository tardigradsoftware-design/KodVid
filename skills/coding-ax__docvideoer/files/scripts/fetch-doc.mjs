#!/usr/bin/env node

/**
 * 文档抓取工具
 *
 * 从 URL 抓取网页正文内容，提取纯文本/Markdown 格式输出。
 * 基于 @mozilla/readability 提取正文。
 *
 * 用法:
 *   node scripts/fetch-doc.mjs <url>                    # 输出 Markdown
 *   node scripts/fetch-doc.mjs <url> --format text      # 输出纯文本
 *   node scripts/fetch-doc.mjs <url> --out source.md    # 保存到文件
 */

import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import fs from 'node:fs';

/**
 * 从 URL 抓取文档正文
 * @param {string} url - 网页 URL
 * @returns {Promise<{title: string, content: string, textContent: string, excerpt: string}>}
 */
export async function fetchDocument(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    throw new Error('无法从页面提取正文内容');
  }

  return {
    title: article.title || '未命名文档',
    content: article.content || '', // HTML
    textContent: article.textContent || '', // 纯文本
    excerpt: article.excerpt || '',
  };
}

/**
 * 将 HTML 内容转换为简化的 Markdown
 */
function htmlToMarkdown(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // 去除非正文元素
  doc.querySelectorAll('script, style, noscript, iframe, .ad, .advertisement').forEach((el) => el.remove());

  let md = '';

  function processNode(node, indent = '') {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        // 文本节点
        const text = child.textContent.trim();
        if (text) md += indent + text + '\n\n';
      } else if (child.nodeType === 1) {
        const tag = child.tagName.toLowerCase();
        const text = child.textContent.trim();
        if (!text) continue;

        switch (tag) {
          case 'h1':
            md += '# ' + text + '\n\n';
            break;
          case 'h2':
            md += '## ' + text + '\n\n';
            break;
          case 'h3':
            md += '### ' + text + '\n\n';
            break;
          case 'h4':
            md += '#### ' + text + '\n\n';
            break;
          case 'p':
            md += indent + text + '\n\n';
            break;
          case 'li':
            md += indent + '- ' + text + '\n';
            break;
          case 'pre':
          case 'code':
            md += '```\n' + child.textContent + '\n```\n\n';
            break;
          case 'blockquote':
            md += '> ' + text.replace(/\n/g, '\n> ') + '\n\n';
            break;
          case 'strong':
          case 'b':
            md += '**' + text + '**';
            break;
          case 'em':
          case 'i':
            md += '*' + text + '*';
            break;
          case 'a':
            md += '[' + text + '](' + (child.getAttribute('href') || '') + ')';
            break;
          case 'img':
            md += '![' + (child.getAttribute('alt') || '') + '](' + (child.getAttribute('src') || '') + ')';
            break;
          case 'br':
            md += '\n';
            break;
          case 'ul':
          case 'ol':
          case 'div':
          case 'section':
          case 'article':
            processNode(child, indent);
            break;
          default:
            processNode(child, indent);
        }
      }
    }
  }

  processNode(doc.body);
  return md.replace(/\n{3,}/g, '\n\n').trim();
}

// --- CLI 入口 ---------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((a) => a.startsWith('http'));
  const formatIdx = args.indexOf('--format');
  const format = formatIdx !== -1 ? args[formatIdx + 1] : 'markdown';
  const outIdx = args.indexOf('--out');
  const outPath = outIdx !== -1 ? args[outIdx + 1] : null;

  if (!url) {
    console.error('Usage: fetch-doc.mjs <url> [--format text|markdown] [--out <path>]');
    process.exit(1);
  }

  console.error(`Fetching: ${url}`);
  const doc = await fetchDocument(url);

  let output;
  if (format === 'text') {
    output = `# ${doc.title}\n\n${doc.textContent}`;
  } else {
    output = `# ${doc.title}\n\n${htmlToMarkdown(doc.content)}`;
  }

  if (outPath) {
    fs.writeFileSync(outPath, output, 'utf-8');
    console.log(`Saved to: ${outPath}`);
  } else {
    console.log(output);
  }
}

main().catch((err) => {
  console.error('Fetch Error:', err.message);
  process.exit(1);
});
