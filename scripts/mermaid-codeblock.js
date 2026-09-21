/**
 * 让 ```mermaid 代码块能被 Butterfly 主题渲染成图表
 *
 * 背景：
 *   主题的 Mermaid 渲染 JS（themes/butterfly/layout/includes/third-party/math/mermaid.pug）
 *   最终只处理两种结构：
 *     1. <div class="mermaid-wrap"><pre class="mermaid-src" hidden>…</pre></div>   ← 由主题的 {% mermaid %} 标签生成
 *     2. pre > code.mermaid                                                        ← 由主题的 code_write 逻辑转换
 *
 *   但站点开启了 syntax_highlighter: highlight.js 后，Hexo 会在 markdown 渲染前
 *   就把 ```mermaid 代码块替换成 highlight.js 的 figure 结构，于是上面两种结构都不会出现，
 *   图表只会以 PLAINTEXT 代码块的形式显示出来。
 *
 * 做法：
 *   在 Hexo 的 before_post_render 阶段（早于内置的 backtick_code_block，其优先级为 9）
 *   把 ```mermaid … ``` 直接替换成结构 1，与主题标签插件的输出保持一致。
 *   这样文章里继续写 ```mermaid 即可，无需改成 {% mermaid %} 标签，也不用改主题。
 */

'use strict'

const { escapeHTML } = require('hexo-util')

const MERMAID_BLOCK = /^[ \t]*```mermaid[ \t]*\r?\n([\s\S]*?)^[ \t]*```[ \t]*$/gm

hexo.extend.filter.register(
  'before_post_render',
  data => {
    if (typeof data.content !== 'string' || !data.content.includes('```mermaid')) return data

    data.content = data.content.replace(MERMAID_BLOCK, (match, code) => {
      const trimmed = code.replace(/\s+$/, '')
      return '<div class="mermaid-wrap"><pre class="mermaid-src" data-config="{}" hidden>' +
        escapeHTML(trimmed) +
        '</pre></div>'
    })

    return data
  },
  5 // 必须小于内置 backtick_code_block 的 9，才能抢在 highlight.js 之前处理
)
