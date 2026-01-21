[English](./README.md) | 简体中文

## 简介

[youde](https://javionlog.github.io/youde) 是一个端到端类型安全的全栈内容管理应用。

## 技术栈

- [React](https://github.com/facebook/react)
- [React Router](https://github.com/remix-run/react-router)
- [React I18next](https://github.com/i18next/react-i18next)
- [TDesign React](https://github.com/Tencent/tdesign-react)
- [TDesign Mobile Mobile](https://github.com/Tencent/tdesign-mobile-react)
- [Zustand](https://github.com/pmndrs/zustand)
- [Elysia](https://github.com/elysiajs/elysia)
- [Drizzle](https://github.com/drizzle-team/drizzle-orm)

## 特性

```
- TypeScript 编写，后端 API 自动生成，端到端类型安全
- 界面响应式，桌面端 / 移动端都可以操作
- 支持多语言切换
- 支持暗黑模式 / 明亮模式切换
- 提交代码自动校验和格式化
- 后台管理 CSR，前台内容 SSR
- 后台路由缓存，页面切换路由数据不丢失
- 后台路由根据 API 自动生成，无需手动配置
- CI / CD，提交代码自动部署
- API 自动生成 OpenAPI 文档
- 支持数据库预览，一键迁移
- 支持多环境部署
```

## 功能

```
- 用户
  - 登录
  - 注册
  - 重置密码
- 权限
  - RBAC 模型
  - 菜单权限
  - 按钮权限
  - 会话管理
- 内容
  - 后台发布内容
  - 前台访问内容
```

## 开发

前置要求：需要准备一个数据库（如果没有，可使用下面的测试数据库）

```shell
# 克隆项目
git clone https://github.com/javionlog/youde

# 进入项目目录
cd youde

# 安装依赖
pnpm install

# 进入 api 目录
cd apps/api

# 新建 .env.dev.local 文件，内容如下
DATABASE_URL = 'postgresql://postgres.tbqgxulnlfiphpgxxyla:Youde@5566.@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres'

# 把 Schema 同步到数据库  (如果使用测试数据库，这步可以跳过)
npm run db-migrate:dev

# 初始化数据  (如果使用测试数据库，这步可以跳过)
npm run db-init:dev

# 回到根目录，启动
npm run start:dev
```

API 文档 [http://localhost:3000/doc](http://localhost:3000/doc)，后台管理 [http://localhost:5173](http://localhost:5173)，前台内容 [http://localhost:9000](http://localhost:9000)
