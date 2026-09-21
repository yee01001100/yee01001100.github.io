# 🚀 我的个人博客

> 🌏 访问地址: [yee01001100.github.io](https://yee01001100.github.io)

欢迎来到我的个人博客项目仓库！这里记录了我的学习心得、技术分享以及生活随笔。本项目基于 **Hexo** 静态网站生成器，并使用 **Butterfly** 主题进行构建。

---

## 🛠️ 技术栈

本项目使用以下技术构建：

-   **核心框架**: [Hexo](https://hexo.io/zh-cn/) - 一个快速、简洁且高效的博客框架。
-   **主题**: [Butterfly](https://butterfly.js.org/) - 一款基于 Hexo 的 Material Design 风格主题，功能强大且美观。
-   **部署平台**: GitHub Pages
-   **编程语言**: Markdown, HTML, CSS, JavaScript, EJS/Pug (取决于主题模板)

## 📂 仓库分支说明

本仓库同时保存源码与构建产物，用分支区分：

| 分支 | 内容 | 用途 |
| --- | --- | --- |
| `source` | Hexo 源码（文章、站点配置、主题配置） | 日常写作与维护 |
| `main` | `hexo generate` 生成的静态文件 | GitHub Pages 实际发布的站点 |

**因此做开发时必须切到 `source` 分支**——`main` 分支里只有编译结果，没有可编辑的源码。

## ✨ 主题特性

Butterfly 主题为本博客提供了丰富的功能支持。下表区分「主题具备的能力」与「本站当前是否已启用」，未启用的项在 `_config.butterfly.yml` 中配置即可打开：

| 特性 | 主题支持 | 本站是否启用 |
| --- | --- | --- |
| 响应式设计（PC / 平板 / 移动端） | ✅ | ✅ |
| 代码高亮（可切换主题） | ✅ | ✅ |
| 暗黑模式（自动 / 手动切换） | ✅ | ✅ |
| 页面访问统计（不蒜子 PV/UV） | ✅ | ✅ |
| 分享组件（share.js） | ✅ | ✅ |
| 站内搜索（本地搜索 / Algolia / DocSearch） | ✅ | ❌ 未启用（`search.use` 为空） |
| 评论系统（Waline / Twikoo / Gitalk / Utterances / Artalk 等） | ✅ | ❌ 未启用（`comments.use` 为空） |
| 数学公式（MathJax / KaTeX）、广告位等 | ✅ | ❌ 未启用 |

## 📦 本地运行与开发

如果你想克隆本项目并在本地运行，请确保你已安装 [Node.js](https://nodejs.org/) 和 [Git](https://git-scm.com/)。

### 1. 安装 Hexo CLI

```bash
npm install -g hexo-cli
```

### 2. 克隆项目（注意是 `source` 分支）

```bash
git clone -b source https://github.com/yee01001100/yee01001100.github.io.git my-blog
cd my-blog
```

### 3. 获取主题

`themes/butterfly` 在仓库里是以子模块引用（gitlink）的形式记录的，但仓库未包含 `.gitmodules`，所以 **clone 之后该目录是空的、直接构建会失败**，需要手动获取主题：

```bash
rm -rf themes/butterfly
git clone https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

> 也可以用 npm 管理主题：`npm install hexo-theme-butterfly`，站点配置里的 `theme: butterfly` 不需要改动。

### 4. 安装依赖

```bash
npm install
```

### 5. 启动本地服务器

```bash
hexo server
# 或者简写
hexo s
```

启动后，在浏览器访问 `http://localhost:4000` 即可预览博客。

## 🚀 部署流程

本站目前是**本地手动部署**：在 `source` 分支写文章，构建后由 `hexo-deployer-git` 把 `public/` 推送到 `main` 分支，GitHub Pages 再从 `main` 发布。

> 注：仓库的 `.github/` 目录目前只配置了 Dependabot 依赖更新，**尚未配置自动构建部署的工作流**。

### 部署命令

```bash
# 清理缓存
hexo clean

# 生成静态文件
hexo generate
# 或者简写
hexo g

# 部署到 GitHub Pages（推送到 main 分支）
hexo deploy
# 或者简写
hexo d
```

也可以使用 `package.json` 里定义的脚本：`npm run build`、`npm run deploy`、`npm run server`。
