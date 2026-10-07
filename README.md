# Co-Reading Mind Palace (共读伴侣 · 记忆宫殿)

<p align="center">
  <img src="https://images.unsplash.com/photo-1507842229452-774b93198889?auto=format&fit=crop&w=1200&q=80" alt="Co-Reading Mind Palace Banner" width="100%" style="border-radius: 12px; max-height: 360px; object-fit: cover;" />
</p>

<p align="center">
  <strong>基于 Gemini 的 AI 深度共读伴侣 · 跨时空贤哲圆桌会议 · 记忆宫殿知识萃取系统</strong>
</p>

<p align="center">
  <a href="#-核心特性"><img src="https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react" alt="React 19" /></a>
  <a href="#-技术栈"><img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="#-技术栈"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" /></a>
  <a href="#-技术栈"><img src="https://img.shields.io/badge/Gemini_API-2.5_Flash-8e75ff?style=flat-square&logo=google" alt="Gemini API" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="License: MIT" /></a>
</p>

---

## 📖 简介 / Introduction

**Co-Reading Mind Palace (共读伴侣 · 记忆宫殿)** 是一款旨在重构阅读反思体验的深度伴读应用。

阅读的价值不在于「读过多少页」，而在于思想碰撞中的「领悟与内化」。传统的 AI 读书助手往往停留在单调的问答与机械摘要，而本项目通过：
- **苏格拉底式启发对话** 引导主动思考；
- **跨时空贤哲圆桌会议** 引入苏格拉底、王阳明、特德·姜与原书作者多重视角交锋；
- **记忆宫殿萃取引擎** 将碎片化的思考沉淀为结构化卡片与典雅书签；
- **社交分享码（PAL-XXXX）** 支持阅读同好之间的智慧连接。

---

## ✨ 核心特性 / Core Features

### 1. 深度一对一共读 (1-on-1 Deep Reflection)
- 循序渐进的启发式提问，拒绝说教与填鸭，激发读者自己的理解与洞见。
- 智能识别收尾语境（如「今天读完了」、「存入记忆宫殿」），自动圆融总结。
- 对话超时（2 小时）智能归档，避免思考随时间流逝而遗失。

### 2. 贤哲圆桌会议 (Philosophers' Roundtable)
在共读过程中，一键邀请跨时代智者入座圆桌，多元思想碰撞：
- 🏛️ **苏格拉底 (Socrates)**：反诘追问，辨析概念定义，深挖底层逻辑与本质。
- 🎋 **王阳明 (Wang Yangming)**：知行合一，致良知，破除知见障，注重事上练与生命体悟。
- 🌌 **特德·姜 (Ted Chiang)**：硬核哲思、构筑精妙思想实验、审视技术伦理与人文内核。
- 🖋️ **原书作者 (Book Author)**：还原成书初衷、创作心路与核心主旨。
- 各嘉宾拥有专属形象标识、独特的语言节奏与观点争鸣。

### 3. 记忆宫殿知识沉淀 (Mind Palace Knowledge Distillation)
- **卡片萃取**：自动提炼书名、章节、核心脉络与要点启示。
- **书签式流动呈现**：会话沉淀后在对话区呈现燕尾书签卡片，支持随时翻开笔记。
- **跨端同步与分享**：生成专属分享代码（如 `PAL-7K9A`），随时导出 Markdown。

### 4. 沉浸式蓝紫色调与斜杠交互 (Aesthetic & Shortcuts)
- **严肃且活泼的蓝紫色系 (Indigo & Violet)** 统一视觉，点缀典雅的宫殿金琥珀色。
- **快捷指令 `/`**：随时调起名家入席、阶段萃取、灵感抽屉等指令。
- **灵感抽屉 (Inspiration Drawer)**：当不知从何聊起时，提供富有启发性的破冰话题。

### 5. 双端与双语适配 (Responsive & i18n)
- **桌面端 (Desktop)**：宽幅侧边栏 + 记忆宫殿知识库双屏沉浸。
- **移动端 (Mobile)**：拟物化随身掌上伴读界面。
- **中 / 英文国际化 (i18n)**：中英文语境无缝流转。

---

## 🛠️ 技术栈 / Tech Stack

- **前端 (Frontend)**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (矢量图标库)
  - [Motion](https://motion.dev/) (丝滑动画)
  - [React Markdown](https://github.com/remarkjs/react-markdown) (Markdown 渲染)
- **后端 (Backend & Server)**:
  - [Express](https://expressjs.com/)
  - [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) (轻量持久化会话与分享码存储)
- **AI 驱动 (AI Engine)**:
  - [Google Gemini API (@google/genai)](https://github.com/google-gemini/generative-ai-js)
- **工程化 (Dev & Build)**:
  - [Vite 6](https://vitejs.dev/) + [TSX](https://github.com/privatenumber/tsx)

---

## 🚀 快速上手 / Getting Started

### 1. 克隆代码仓库 (Clone Repository)

```bash
git clone https://github.com/<your-username>/co-reading-mind-palace.git
cd co-reading-mind-palace
```

### 2. 安装依赖 (Install Dependencies)

推荐使用 Node.js 18+ 或 20+：

```bash
npm install
```

### 3. 配置环境变量 (Environment Variables)

复制环境配置文件：

```bash
cp .env.example .env
```

打开 `.env` 文件，填入你的 Google Gemini API Key：

```env
GEMINI_API_KEY="AIzaSy..."
```

> 💡 获取 Gemini API Key：可前往 [Google AI Studio](https://aistudio.google.com/) 免费创建获取。应用界面上也内置了自定义 API Key 输入入口，可灵活配置。

### 4. 启动本地开发服务 (Start Development Server)

```bash
npm run dev
```

启动后在浏览器打开：`http://localhost:3000` 即可开始你的共读之旅！

### 5. 生产环境构建 (Build for Production)

```bash
npm run build
npm start
```

---

## 📂 项目结构 / Project Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions 持续集成检查
├── src/
│   ├── components/              # 核心交互组件
│   │   ├── ChatArea.tsx         # 对话区域（含书签、消息流、快捷指令）
│   │   ├── MindPalaceModal.tsx  # 记忆宫殿模态弹窗与笔记卡片
│   │   ├── RoundtableModal.tsx  # 贤哲圆桌嘉宾管理
│   │   └── ...
│   ├── services/
│   │   ├── geminiService.ts     # Gemini API 调用、提示词工程与归纳提炼
│   │   └── roundtableService.ts # 贤哲思想体系与性格 Prompt 构建
│   ├── hooks/                   # 自定义 Hooks
│   ├── types.ts                 # 全局 TypeScript 类型定义
│   ├── i18n.ts                  # 中英双语词典
│   ├── App.tsx                  # 应用主布局与状态中枢
│   ├── main.tsx                 # 前端入口
│   └── index.css                # Tailwind 样式引入
├── server.ts                    # Express 服务端与 SQLite 数据库
├── vite.config.ts               # Vite 构建配置
├── package.json                 # 依赖配置
├── LICENSE                      # MIT 开源协议
└── README.md                    # 项目说明文档
```

---

## 🚢 如何发布到你自己的 GitHub / How to Publish to Your GitHub

你可以通过以下两种简单方式将本项目发布至你个人的 GitHub：

### 方法一：使用 Git 命令行 (标准流程)

1. 在 [GitHub 新建仓库](https://github.com/new)，比如命名为 `co-reading-mind-palace`（不要勾选 Initialize with README）。
2. 在本地项目根目录下执行：

```bash
# 1. 初始化 Git 仓库并创建 main 分支
git init -b main

# 2. 暂存所有文件
git add .

# 3. 提交初始版本
git commit -m "feat: initial release of Co-Reading Mind Palace v1.0.0"

# 4. 关联你的远程 GitHub 仓库 (将 <your-username> 替换为你的 GitHub 账号)
git remote add origin https://github.com/<your-username>/co-reading-mind-palace.git

# 5. 推送到 GitHub
git push -u origin main
```

### 方法二：使用 GitHub CLI (`gh`) 命令行一键创建并推送

如果你已安装 [GitHub CLI](https://cli.github.com/)：

```bash
git init -b main
git add .
git commit -m "feat: initial release of Co-Reading Mind Palace v1.0.0"
gh repo create co-reading-mind-palace --public --source=. --remote=origin --push
```

---

## 🤝 贡献指南 / Contributing

非常欢迎提交 Issue 与 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feat/amazing-feature`)
3. 提交你的修改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送至你的分支 (`git push origin feat/amazing-feature`)
5. 开启一个 Pull Request

---

## 📄 开源许可证 / License

本项目采用 [MIT 许可证](LICENSE)。你可以自由商用、修改与分发，请保留原始版权声明。
