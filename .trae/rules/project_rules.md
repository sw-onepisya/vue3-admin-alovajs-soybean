# 项目规范文档

## 上下文

未明确说明的情况下、应使用的技术栈
- UI 框架: Vue 3
- UI 组件库: Naive UI
- 图标方案: Iconify (通过 `unplugin-icons` 和 `@unocss/preset-icons` 集成), 本地 SVG 图标 (通过 `vite-plugin-svg-icons` 和 `unplugin-icons` 的 `FileSystemIconLoader`)
- CSS 方案: UnoCSS (原子化 CSS, 预设包括 `presetWind` 和自定义的 `presetSoybeanAdmin`)
- 状态管理: Pinia
- 路由: Vue Router (通过 `@elegant-router/vue` 自动生成和管理)
- 构建工具: Vite
- 编程语言: TypeScript
- 包管理器: pnpm
- Linting: ESLint (配合 `@antfu/eslint-config`)
- 格式化: Prettier (通过 ESLint 插件集成)

## 1. 引言与总则

本文档定义了本项目开发过程中需要遵循的各项规则、约定和最佳实践，旨在确保团队协作高效、代码质量高、项目可维护性强。所有参与项目开发的成员，包括人类开发者和 AI 协作伙伴，都必须严格遵守本规范。

### 1.1 项目目标与愿景

*   描述: 简要阐述项目的核心目标、解决的问题和期望达成的愿景。
*   本项目旨在构建一个现代化、高性能、可扩展性强的后台管理系统前端界面，提供流畅的用户体验和高效的开发流程。

### 1.2 核心开发原则

本项目鼓励采用高效的开发模式，并强调以下核心原则：

*   DRY (Don't Repeat Yourself)
    *   描述: 避免重复的代码和配置。任何功能或逻辑应力求唯一实现，通过抽象、函数封装、组件化等方式提高复用性。
    *   常用工具函数应集中存放于 `src/utils` 或 `packages/utils`；通用业务组件存放于 `src/components/common` 或 `src/components/custom`；UI 基础组件封装于 `src/components/ui` (如果需要对 Naive UI 进行再封装)。
    *   UI 样式应优先通过 UnoCSS 原子类组合实现，避免手写重复的 CSS。
*   KISS (Keep It Simple, Stupid)
    *   描述: 保持解决方案简单直观。优先选择最简单可行、易于理解、测试和维护的方案。避免不必要的复杂性和过度设计。
    *   函数复杂度应保持较低水平，避免单个函数代码量过大；避免使用过于晦涩或不常用的语言特性，除非有明确的性能或必要性考量。
*   YAGNI (You Ain't Gonna Need It)
    *   描述: 不要过度设计。只实现当前需要的功能，避免基于未来不确定需求而提前构建复杂或通用的结构。
    *   在不确定需求前，不要提前构建过于通用的组件或模块。优先满足当前迭代的需求，后续根据实际情况进行重构和扩展。

## 2. 项目设置与环境

为了保持开发环境一致性和效率，请确保满足以下要求：

### 2.1 集成开发环境 (IDE)

*   描述: 推荐使用的 IDE 及必要的插件配置。
*   推荐使用 VSCode。
*   必须安装和启用的 IDE 插件:
        *   `Vue Language Features (Volar)`: 提供 Vue 3 + TypeScript 的全面支持。
        *   `TypeScript Vue Plugin (Volar)`: Volar 的 TypeScript 插件。
        *   `ESLint`: 用于代码规范检查。
        *   `UnoCSS`: 提供 UnoCSS 的智能提示和高亮。
        *   `EditorConfig for VS Code`: 确保遵循 `.editorconfig` 中的代码风格设置。
        *   `GitLens`: 增强 Git 功能集成。
        *   `Material Icon Theme` (或类似图标主题): 改善文件和文件夹的可视化。
        *   `Vue Devtools` (浏览器插件): Vue 应用调试工具。
*   根据 `.vscode/extensions.json` 推荐安装的插件列表进行安装。

### 2.2 包管理器

*   描述: 项目统一使用的包管理器及其安装和常用命令。
*   项目统一使用 pnpm。
*   通过 `corepack enable pnpm` (如果 Node.js 版本 >= 16.9) 或 `npm install -g pnpm` 安装 pnpm。
*   安装项目依赖的命令: `pnpm install`。

### 2.3 版本控制系统设置

*   描述: Git 等版本控制系统的基本配置要求。
*   项目使用 Git 进行版本控制。
*   确保已配置 Git 用户名和邮箱: `git config --global user.name "Your Name"` 和 `git config --global user.email "your.email@example.com"`。
*   克隆项目仓库: `git clone <repository-url>`。

## 3. 编码规范

代码风格的一致性是提高可读性和可维护性的基石。本项目强制执行以下规范。

### 3.1 格式化

*   描述: 通过自动化工具（如 Prettier, EditorConfig）强制执行的代码格式规则。
*   项目使用 ESLint (集成 Prettier 规则) 和 EditorConfig 自动格式化代码。
*   关键的格式化规则 (主要由 `.editorconfig` 和 ESLint 配置定义):
    *   缩进: `space`, `indent_size = 2` (2个空格)
    *   最大行宽: 通常为 100 或 120 字符 (具体参考 ESLint 配置，`package.json` 中 `eslintConfig` 未直接指定，但 `@antfu/eslint-config` 通常有默认值)。
    *   分号: 通常不使用 (根据 `@antfu/eslint-config` 的默认风格，倾向于无分号)。
    *   引号: 优先使用单引号 (根据 `@antfu/eslint-config` 的默认风格)。
    *   末尾逗号: `comma-dangle` 规则通常设置为 `always-multiline` (多行时需要末尾逗号)。
    *   文件末尾空行: `insert_final_newline = true` (保留)
    *   换行符: `end_of_line = lf` (LF)
    *   行尾空格: `trim_trailing_whitespace = true` (移除)
*   ESLint 配置位于 `eslint.config.js`。

### 3.2 命名约定

*   描述: 清晰、一致的命名有助于理解代码的用途和意图。
*   不同类型元素的命名约定:
    *   组件: PascalCase (例如 `UserProfile.vue`)。文件名与组件名一致。Vue 组件在 `eslint.config.js` 中有特定规则 `vue/component-name-in-template-casing` (PascalCase) 和 `vue/custom-event-name-casing` (camelCase)。
    *   变量和函数: camelCase (例如 `userName`, `getUserProfile`)。
    *   常量: UPPER_SNAKE_CASE (例如 `API_BASE_URL`, `DEFAULT_TIMEOUT`)。
    *   CSS 类名: kebab-case (例如 `user-profile-card`) 或遵循 UnoCSS 的原子类规范。
    *   文件夹: kebab-case (例如 `user-management`) 或 camelCase (例如 `utils`, `hooks`)。
    *   文件 (非组件): camelCase (例如 `userInfo.ts`) 或 kebab-case (例如 `api-helpers.ts`)。
    *   TypeScript 类型和接口: PascalCase (例如 `interface UserInfo`, `type ApiResponse`)。

### 3.3 语言/框架特定规范

*   描述: 针对项目使用的特定编程语言和框架的详细规范。
*   主要语言和框架: TypeScript, Vue.js 3。
*   特定语言/框架的关键规范:
    *   TypeScript:
        *   优先使用 TypeScript，所有 `.js` 文件应逐步迁移或新代码使用 `.ts`。
        *   明确指定所有变量、函数参数和返回值的类型。避免使用 `any` 类型，除非绝对必要且有充分理由，并尽可能使用更具体的类型或 `unknown`。
        *   利用 `tsconfig.json` 中的严格模式选项 (`strict: true`)。
        *   接口和类型定义应清晰、准确，并放置在 `src/typings` 或相关模块的 `.d.ts` 文件中。
    *   Vue.js:
        *   推荐使用 `<script setup>` 语法糖进行组件开发。
        *   Props 定义: 明确 `type`，提供 `default` 值 (如果适用)，并根据需要设置 `required`。
        *   事件触发: 使用 `defineEmits` 显式声明组件触发的事件，事件名使用 camelCase。
        *   组件内部代码顺序: 建议 `<script setup>`, `<template>`, `<style>`。在 `<script setup>` 内部，建议顺序为：`import` 语句, `defineProps`, `defineEmits`, `defineExpose`, 响应式状态 (ref, reactive), 计算属性 (computed), `watch` 侦听器, 生命周期钩子, 方法。
        *   使用 Pinia 进行状态管理，模块化组织 store。
        *   路由配置由 `@elegant-router/vue` 自动生成，页面组件放置在 `src/views` 目录下，并遵循其约定的文件结构和命名。
    *   JavaScript (如用于配置文件等):
        *   优先使用 ES6+ 语法。
        *   使用 ES Modules (`import/export`)。

### 3.4 目录结构

*   描述: 项目的推荐或强制目录结构约定。
*   项目标准目录结构 (部分核心目录):
    ```
    admin/
    ├── .vscode/         # VSCode 编辑器配置
    ├── build/           # Vite 构建相关配置和插件
    │   ├── config/      # 构建相关的配置项 (如代理、时间)
    │   └── plugins/     # Vite 插件集合
    ├── public/          # 静态资源，会被直接复制到构建输出目录
    ├── src/
    │   ├── assets/      # 项目内部使用的静态资源 (图片、SVG 图标等)
    │   │   ├── imgs/
    │   │   └── svg-icon/ # 本地 SVG 图标
    │   ├── components/  # 可复用 Vue 组件
    │   │   ├── advanced/  # 高级/复杂组件
    │   │   ├── common/    # 通用业务组件
    │   │   └── custom/    # 自定义基础组件 (对 Naive UI 的封装或补充)
    │   ├── constants/   # 常量定义
    │   ├── enum/        # 枚举类型
    │   ├── hooks/       # 自定义 Vue Composables
    │   │   ├── business/  # 业务相关 Hooks
    │   │   └── common/    # 通用 Hooks
    │   ├── layouts/     # 布局组件
    │   ├── locales/     # 国际化资源
    │   ├── main.ts      # 应用入口文件
    │   ├── plugins/     # 应用级别插件 (如 NProgress, Dayjs)
    │   ├── router/      # Vue Router 配置 (主要由 elegant-router 管理)
    │   │   ├── elegant/   # elegant-router 生成的路由
    │   │   ├── guard/     # 路由守卫
    │   │   └── routes/    # 手动定义的静态路由
    │   ├── service/     # API 服务 (基于 Axios)
    │   │   ├── api/       # API 模块
    │   │   └── request/   # 请求封装
    │   ├── service-alova/ # API 服务 (基于 Alova)
    │   ├── store/       # Pinia 状态管理
    │   │   └── modules/   # Pinia 模块
    │   ├── styles/      # 全局样式和 SCSS变量
    │   ├── theme/       # 主题配置
    │   ├── typings/     # TypeScript 类型定义文件
    │   ├── utils/       # 通用工具函数
    │   └── views/       # 页面级组件 (路由对应的视图)
    ├── packages/        # Monorepo 子包 (如工具库、UI 组件库等)
    ├── .editorconfig
    ├── .env             # 环境变量配置 (开发环境)
    ├── .env.prod        # 环境变量配置 (生产环境)
    ├── .env.test        # 环境变量配置 (测试环境)
    ├── eslint.config.js # ESLint 配置文件
    ├── package.json     # 项目元数据和依赖
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml # pnpm Monorepo 工作区配置
    ├── tsconfig.json    # TypeScript 配置文件
    ├── uno.config.ts    # UnoCSS 配置文件
    └── vite.config.ts   # Vite 配置文件
    ```
*   各目录作用和文件存放原则:
    *   `src/assets`: 存放会被 Vite 处理的静态资源，如图片、字体、本地 SVG 图标。
    *   `src/components`: 存放可复用的 Vue 组件。`common` 用于业务相关的通用组件，`custom` 用于自定义的基础 UI 组件或对第三方库组件的封装，`advanced` 用于更复杂的组合组件。
    *   `src/views`: 存放页面级组件，通常与路由对应。
    *   `src/router`: 存放路由配置，主要由 `@elegant-router/vue` 插件根据 `src/views` 目录结构自动生成和管理。
    *   `src/store`: 存放 Pinia状态管理模块。
    *   `src/hooks`: 存放自定义的 Vue Composition API Hooks。
    *   `src/utils`: 存放通用的工具函数。
    *   `src/service` 或 `src/service-alova`: 存放 API 请求相关的代码。
    *   `src/layouts`: 存放页面布局组件。
    *   `src/styles`: 存放全局 CSS/SCSS 文件、变量、混合等。
    *   `src/typings`: 存放全局的 TypeScript 类型声明文件。
    *   `public`: 存放不会被 Vite 处理的静态资源，会直接复制到输出目录的根目录。
    *   `build`: 存放 Vite 构建相关的配置文件和插件。
    *   `packages`: 用于 pnpm workspace 管理的本地包。

### 3.5 CSS/Styling 规范

*   描述: 项目使用的样式方法、框架和约定。
*   项目主要使用 UnoCSS (Utility-first CSS 框架)。
*   CSS 框架/库: UnoCSS, 预设包括 `@unocss/preset-wind` (Tailwind CSS v3 兼容) 和自定义的 `@soybeanjs/preset-uno` (在 `uno.config.ts` 中体现为 `presetSoybeanAdmin`)。也集成了 Naive UI 组件库的样式。
*   样式编写规范:
    *   优先使用遵循 CUBE 样式编写规范(Combine, Utils, Block, Except)
	    *  Block 作为基本样式、然后使用 UnoCSS 的 Util class 来作为补充修改。 以此来作为组合、并且 E 是例外、也就是说特殊样式。 
	    * 当然、在 Block 基本样式的时候不需要使用 UnoCSS 的 apply 、我们直接使用 scss 就可以了。
	    * 只有直接在 class 中添加工具类的时候、我们才使用 UnoCSS 作为补充
    *   UnoCSS 配置位于 `uno.config.ts`，包括主题颜色、字体、快捷方式 (`shortcuts`) 等。
    *   避免手写大量自定义 CSS，除非原子类无法满足复杂需求。
    *   组件特定样式可以使用 `<style scoped lang="scss">` (如果需要 SCSS)。
    *   全局样式定义在 `src/styles` 目录下，例如 `src/styles/css/global.css` 和 `src/styles/scss/global.scss`。
    *   UnoCSS 支持暗黑模式，通过 `darkMode: 'class'` 配置，并使用如 `dark:text-white` 这样的类名。
    *   图标通过 UnoCSS 的 `@unocss/preset-icons` 和 `unplugin-icons` 集成，可以直接在模板中使用如 `<div class="i-mdi-home"></div>` 或通过组件 `<icon-mdi-home />` 的形式。

### 3.6 自动化检查工具

*   描述: 项目配置的自动化代码检查和格式化工具，及其运行方式。
*   Lint 工具: ESLint。Stylelint 未在 `package.json` 中直接体现，但 UnoCSS 自身可能包含一些样式相关的检查或转换。
*   ESLint 配置文件: `eslint.config.js`。使用了 `@antfu/eslint-config` 作为基础规则集，并针对 Vue 组件命名和 UnoCSS 属性排序进行了自定义配置。
*   运行检查和自动修复的命令:
    *   `pnpm lint`: 运行 ESLint 检查。
    *   `pnpm lint:fix`: 运行 ESLint 检查并自动修复问题。
    *   `pnpm typecheck`: 运行 TypeScript 类型检查。
*   代码提交前应通过 `pnpm lint` 和 `pnpm typecheck` 检查。项目中配置了 `simple-git-hooks` 和 `lint-staged` (在 `package.json` 的 `scripts` 和 `simple-git-hooks` 配置中)，会在 `pre-commit` 阶段自动运行 Lint 和格式化。

## 4. 版本控制策略

规范的 Git 使用有助于团队协作和项目历史管理。

### 4.1 分支模型

*   描述: 项目采用的分支管理模型（如：Git Flow, GitHub Flow, GitLab Flow 等）。
*   项目推荐采用类似 GitHub Flow 的分支模型，并结合 Conventional Commits。
*   主要分支:
    *   `main`: 主分支，始终保持稳定和可部署状态。所有新功能和修复最终合并到此分支。
    *   `develop`: (可选，如果团队规模较大或有较长发布周期) 开发分支，用于集成各个特性分支，作为 `main` 分支的预发布分支。
*   特性分支、修复分支等的创建、命名约定和生命周期:
    *   特性分支 (`feature/` 或 `feat/`): 从 `main` (或 `develop`) 创建，用于新功能开发。命名规范: `feature/<issue-id>-short-description` 或 `feat/<issue-id>-short-description` (例如 `feat/123-user-login`)。
    *   修复分支 (`fix/`): 从 `main` (或 `develop`, 取决于修复的紧急程度和目标版本) 创建，用于 Bug 修复。命名规范: `fix/<issue-id>-short-description` (例如 `fix/456-button-style-error`)。
    *   其他分支 (如 `chore/`, `docs/`, `refactor/`): 根据提交类型和 Conventional Commits 规范命名，例如 `chore/update-deps`, `docs/readme-update`。
*   禁止直接向 `main` (和 `develop`，如果使用) 分支提交代码。所有变更必须通过 Pull Request (PR) / Merge Request (MR) 进行。

### 4.2 提交信息规范

*   描述: 遵循特定规范（如 Conventional Commits）编写提交信息，以提高可读性并可能用于自动化。
*   严格遵循 Conventional Commits 规范。
*   提交信息的格式和各部分的含义:
    *   格式: `<type>(<scope>): <subject>

[optional body]

[optional footer(s)]`
    *   `<type>`: 必须是以下之一:
        *   `feat`: 新功能 (feature)
        *   `fix`: Bug 修复
        *   `docs`: 文档变更
        *   `style`: 代码风格调整 (不影响代码含义的更改，如空格、格式化、缺少分号等)
        *   `refactor`: 代码重构 (既不是修复 Bug 也不是添加新功能的代码更改)
        *   `perf`: 性能优化
        *   `test`: 添加缺失的测试或更正现有测试
        *   `build`: 影响构建系统或外部依赖项的更改 (例如: gulp, broccoli, npm)
        *   `ci`: 对 CI 配置文件和脚本的更改 (例如: Travis, Circle, BrowserStack, SauceLabs)
        *   `chore`: 其他不修改 `src` 或 `test` 文件的更改 (例如：更新构建任务、包管理器配置等)
        *   `revert`: 撤销先前的提交
    *   `<scope>`: 可选，用于指定提交影响的范围 (例如: `auth`, `user-profile`, `vite-config`)。
    *   `<subject>`: 必需，简明扼要地描述本次提交的目的。使用现在时态的祈使句 (例如: `add login button` 而不是 `added login button` 或 `adds login button`)，首字母小写，末尾不加句号。
    *   正文 (Body): 可选，对提交进行更详细的描述，解释变更的原因和实现方式。每行不超过 72 个字符。
    *   脚注 (Footer): 可选，用于记录不兼容的变更 (BREAKING CHANGE) 或关闭 GitHub Issues (例如: `Closes #123`, `Fixes #456`)。
*   正反例:
    *   正例:
        ```
        feat(auth): implement password recovery via email

        Adds a new endpoint and UI for users to request a password reset link
        to be sent to their registered email address.

        Closes #789
        BREAKING CHANGE: The `resetPassword` API endpoint has changed from /v1/reset to /v2/reset-password.
        ```
    *   反例:
        ```
        update code // ❌ 类型和主题不明确
        Fixed a bug // ❌ 类型不规范，主题不清晰
        chore: update package.json and fix login page style // ❌ 一个提交包含多种类型的变更，应拆分
        ```
*   项目配置了 `commitlint` (通过 `simple-git-hooks` 在 `commit-msg` 钩子中运行) 来强制校验提交信息格式。

### 4.3 Pull Request (PR) / Merge Request (MR) 流程

*   描述: 提交、审查和合并代码的流程。
*   提交 PR/MR 的步骤:
    1.  确保本地分支从最新的 `main` (或 `develop`) 分支更新。
    2.  确保所有代码通过 Lint (`pnpm lint`) 和类型检查 (`pnpm typecheck`)。
    3.  确保所有相关测试通过 (如果项目配置了自动化测试)。
    4.  将本地分支推送到远程仓库。
    5.  在 Git 托管平台 (如 GitHub, GitLab) 上创建 PR/MR，目标分支通常是 `main` (或 `develop`)。
*   PR/MR 需要包含的信息:
    *   清晰的标题，遵循 Conventional Commits 的 `<type>(<scope>): <subject>` 格式。
    *   详细的描述，说明变更的内容、原因和目的。
    *   关联的 Issue 编号 (例如 `Closes #123`)。
    *   变更类型 (新功能、Bug 修复、重构等)。
    *   测试结果或手动测试步骤 (如果适用)。
    *   UI 变更的截图或 GIF (如果适用)。
*   PR/MR 至少需要一名其他团队成员 Code Review 并批准后才能合并。
*   合并前确保 CI/CD 流程通过 (如果配置了)。
*   通常使用 Squash and Merge 或 Rebase and Merge 的方式合并 PR/MR，以保持 `main` 分支的提交历史清晰。

### 4.4 `.gitignore` 文件

*   描述: 需要忽略、不纳入版本控制的文件和目录。
*   项目根目录下的 `.gitignore` 文件定义了需要被 Git 忽略的文件和目录。
*   常见的被忽略内容包括:
    *   `node_modules/`
    *   `dist/`, `build/` (除了项目本身的 `build` 目录，如果是构建产物目录)
    *   `.DS_Store`
    *   `.env*` (除了 `.env.example` 或类似模板文件)
    *   IDE 配置文件 (如 `.idea/`, `.vscode/` 但本项目 `.vscode/settings.json` 和 `.vscode/extensions.json` 被纳入版本控制以统一开发环境)
    *   日志文件 (`*.log`)
    *   临时文件 (`*.tmp`)
    *   pnpm 调试日志 (`pnpm-debug.log`)
*   所有开发者应遵守 `.gitignore` 规则，不提交不必要的文件。

## 5. 依赖管理

*   描述: 如何添加、删除和更新项目依赖库。
*   添加新依赖: `pnpm add <package-name>`
*   添加开发依赖: `pnpm add -D <package-name>`
*   删除依赖: `pnpm remove <package-name>`
*   更新所有依赖: `pnpm update` (谨慎使用，建议逐个更新或按需更新，并测试兼容性)
*   更新特定依赖: `pnpm update <package-name>`
*   选择新库的原则:
    *   活跃维护: 优先选择有持续更新和社区支持的库。
    *   文档齐全: 确保库有清晰、完整的官方文档。
    *   社区支持好: 社区活跃度高，遇到问题更容易找到解决方案。
    *   与项目技术栈兼容: 确保库与 Vue 3, TypeScript, Vite 等核心技术栈良好兼容。
    *   体积和性能: 关注库的体积大小及其对应用性能的潜在影响。
    *   安全性: 检查库是否存在已知的安全漏洞。
    *   许可证: 确保库的许可证与项目需求兼容。
*   统一使用 pnpm 进行依赖管理，优先选择类型定义完善 (`@types/...` 或自带类型) 的库。