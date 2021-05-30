# 前端说明

本项目采用的是 React + TypeScript + Material UI 制作，具体架构说明可看[这里](../../)。

## 目录结构

```
simple-pocket-book/
├── android/
├── build/
├── config/
├── electron/
├── ios/
├── public/
├── script/
├── src/
|   ├── assets/
|   ├── components/
|   ├── layouts/
|   ├── mock/
|   ├── reducers/
|   ├── routes/
│   |   └── navigationConfig.ts
|   ├── service/
|   ├── store/
|   ├── theme/
|   ├── types/
|   ├── utils/
|   ├── views/
|   ├── App.tsx
|   ├── index.tsx
|   ├── react-app-env.d.tsx
|   ├── reportWebVitals.tsx
|   ├── service-worker.ts
|   ├── serviceWorkerRegistration.ts
|   ├── setupProxy.js
│   └── setupTests.ts
├── tests/
│   └── e2e/
├── .browserslistrc
├── .editorconfig
├── .env.development
├── .env.production
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .gitlab-ci.yml
├── .lighthouserc.js
├── babel.config.js
├── capacitor.config.json
├── commitlint.config.js
├── jest.config.js
├── nightwatch.conf.js
├── package.json
├── package-lock.json
├── purgecss.config.js
├── styleguide.config.js
├── stylelint.config.js
└── tsconfig.json
```

- `android/` `ios/`：原生 APP 代码，非相关人员请不要进行开发
- `build/`：项目构建结果
- `config/`：webpack 配置
- `electron/`：Electron 相关代码
- `public/`：静态文件，不受webpack影响
- `scripts/`：命令行相关脚本
- `src/`：**项目源代码**
- `tests/`：测试源代码
  - `e2e/`：E2E 测试代码
- `.browserslistrc`：Browserslist 配置文件，配置浏览器兼容性
- `.editorconfig`：编辑器配置
- `.env.development` `.env.production`：环境配置
- `.eslintignore`：忽略不需要 ESLint 检查的目录或文件
- `.eslintrc.js`：ESLint 配置
- `.gitignore`：忽略不需要 Git 提交的目录或文件
- `.gitlab-ci.yml`：Gitlab CI 配置
- `.lighthouserc.js`：lighthouse 检查配置，在 CI 环境下运行
- `babel.config.js`：Babel 配置
- `capacitor.config.json`：Capacitor 配置
- `commitlint.config.js`：commitlint 配置
- `jest.config.js`：Jest 配置
- `nightwatch.conf.js`：Nightwatch.js 配置
- `package.json`
- `package-lock.json`
- `purgecss.config.js`：PurgeCSS 配置
- `styleguide.config.js`：React Styleguidist 配置
- `stylelint.config.js`：stylelint 配置
- `tsconfig.json`：TypeScript 配置

### `src/`

- `reducers/` `store/`：Redux相关代码
- `assets/`：静态文件目录（例如图片）
- `components/`：项目公共组件
- `layouts/`：页面布局组件
- `mock/`：mock，模拟 HTTP 请求
- `routes/`：路由配置目录
  - `navigationConfig.js`：侧边导航配置文件
- `services/`：HTTP 请求封装方法
- `theme/`：页面主题配置（颜色，字体大小等）
- `types/`：公用 Types
- `utils/`：工具 JS 函数
- `views/`：**页面组件**
- `App.tsx`：根组件
- `index.tsx`：页面入口文件
- `react-app-env.d`：React Types
- `reportWebVitals.ts` `service-worker.ts` `serviceWorkerRegistration.ts`：PWA 相关代码
- `setupProxy.js`：HTTP 代理配置，正式环境不会运行，用于开发时联调 RESTful 接口
- `setupTests.ts`：测试代码公用前置代码

## CLI

### `start`

运行开发模式

```bash
npm start
```

### `electron:run`

运行 Electron 调试项目

```bash
npm run electron:run
```

### `build`

构建生产 bundle

```bash
npm run build
```

### `package:android`/`package:ios`

构建 Android/iOS 移动 APP

```bash
npm run package:android
npm run package:ios
```

> 需要先运行 `npm run build`

> 环境要求可查询以下文档：
> - [Android](https://capacitorjs.com/docs/android)
> - [iOS](https://capacitorjs.com/docs/ios)

### `package:win`/`package:mac`/`package:linux`

构建 Windows/macOS/Linux 桌面 APP 安装包

```bash
npm run package:win
npm run package:mac
npm run package:linux
```

> 环境要求可查询以下文档：
> - [Windows](https://electronjs.org/docs/development/build-instructions-windows)
> - [macOS](https://electronjs.org/docs/development/build-instructions-macos)
> - [Linux](https://electronjs.org/docs/development/build-instructions-linux)

### `test:unit`

运行单元测试

```bash
npm run test:unit
```

### `test:unit:watch`

使用 watch 模式运行单元测试，用于测试开发过程

```bash
npm run test:unit:watch
```

### `test:coverage`

运行代码覆盖率测试

```bash
npm run test:coverage
```

### `test:e2e`/`test:e2e:chrome`/`test:e2e:firefox`

运行 E2E 测试

```bash
npm run test:e2e # 运行所有环境的 E2E 测试
npm run test:e2e:chrome # 运行 Chrome 环境的 E2E 测试
npm run test:e2e:firefox # 运行 Firefox 环境的 E2E 测试
```

### `lighthouse`

运行 Lighthouse 测试

```bash
npm run lighthouse
```

> 建议在 CI 环境运行

### `lint`/`lint:css`/`lint:js`

运行代码检查

- CSS： 使用 stylelint 检查（包括 CSS-in-JS）
- JS/TS： 使用 ESLint 检查

```bash
npm run lint
npm run lint:css
npm run lint:js
```

### `format`/`format:css`/`format:js`

格式化代码

```bash
npm run format # 格式化所有代码
npm run format:css # 格式化 CSS 代码（包括 CSS-in-JS）
npm run format:js # 格式化 JS/TS 代码
```

> 注意：该命令可能失败，无法格式化的代码请手动处理

### `styleguide`

预览组件文档

```bash
npm run styleguide
```

### `styleguide:build`

生成组件文档

```bash
npm run styleguide:build
```

### `changelog`

生成 `CHANGELOG.md` 文件

```bash
npm run changelog
```

### `analyze`

生成 bundle 分析报告，以便进行性能优化

```bash
npm run analyze
```

## 作业完成情况

由于这不是一个实际的项目，我只能按照我的理解来完成功能，如果有理解不到位的地方，欢迎指正。

除了完成作业的内容，还预置了以下几个界面：

- 登录界面（使用mock）
- 个人中心（使用mock）
  - 个人信息
  - 修改密码
  - 站内信
  
其中登录界面，为了方便展示效果，去掉了登录界面的有效性验证，**手机号和密码输入任意字符串**即可登录

### 加载提供的数据

进入“账单”界面，可加载账单数据，该数据支持分页、筛选和排序

![图片](https://user-images.githubusercontent.com/19792747/120105238-aef6f580-c18a-11eb-9973-64b315d2a213.png)

### 提供下拉框选择月份进行筛选

点击”高级搜索“，可对数据进行筛选，这里我有一点做了跟作业要求不一样，我使用的是”开始时间“”结束时间“这种更灵活的方式（虽然使用月份也可以，但是丧失了高级搜索的灵活性）

同时，高级搜索还支持“账单金额”、“账单类型”和“账单分类”的筛选

切换“账单类型”时，会改变“账单分类”下拉框的数据，符合**对账单分类进行二次筛选**的需求

![图片](https://user-images.githubusercontent.com/19792747/120105287-df3e9400-c18a-11eb-861f-e6148f4e26a4.png)

### 支持使用者添加账单

点击右上角“创建账单”按钮，可以进入创建界面让使用者添加账单

在创建界面，点击“创建账单”会在后台插入一条数据（写入 CSV 文件）

同样，切换“账单类型”时，会改变“账单分类”下拉框的数据

![图片](https://user-images.githubusercontent.com/19792747/120105308-f8474500-c18a-11eb-883d-ab1db8e856a6.png)

### 简单地统计并展示所选月份的收入和支出总金额

进入“账单统计”界面，可以统计所选月份的收入和支出总金额（默认当月）

左侧为统计图，右侧为报表，统计了**月份内的所有账单根据账单分类进行支出金额统计，并可以排序**

![图片](https://user-images.githubusercontent.com/19792747/120105331-1319b980-c18b-11eb-8685-d9cf88761f30.png)
