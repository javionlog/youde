English | [简体中文](./README.zh-CN.md)

## Introduction

[youde](https://javionlog.github.io/youde) is an end-to-end type-safe full-stack content management application.

## Tech Stack

- [React](https://github.com/facebook/react)
- [React Router](https://github.com/remix-run/react-router)
- [React I18next](https://github.com/i18next/react-i18next)
- [TDesign React](https://github.com/Tencent/tdesign-react)
- [TDesign Mobile Mobile](https://github.com/Tencent/tdesign-mobile-react)
- [Zustand](https://github.com/pmndrs/zustand)
- [Elysia](https://github.com/elysiajs/elysia)
- [Drizzle](https://github.com/drizzle-team/drizzle-orm)

## Features

```
- Written in TypeScript with auto-generated backend APIs for end-to-end type safety
- Responsive UI, operable on both desktop and mobile devices
- Multi-language support
- Dark mode / Light mode switching
- Automatic code validation and formatting on commit
- Admin panel with CSR, frontend content with SSR
- Admin route caching, route data persists during page navigation
- Admin routes auto-generated based on API, no manual configuration needed
- CI/CD, automatic deployment on code commit
- Auto-generated OpenAPI documentation for APIs
- Database preview support with one-click migration
- Multi-environment deployment support
```

## Functions

```
- User
  - Login
  - Registration
  - Password reset
- Permissions
  - RBAC model
  - Menu permissions
  - Button permissions
  - Session management
- Content
  - Backend content publishing
  - Frontend content access
```

## Development

Prerequisites: A database is required (if you don't have one, you can use the test database below)

```shell
# Clone the project
git clone https://github.com/javionlog/youde

# Enter the project directory
cd youde

# Install dependencies
pnpm install

# Enter the api directory
cd apps/api

# Create a .env.dev.local file with the following content
DATABASE_URL = 'postgresql://postgres.tbqgxulnlfiphpgxxyla:Youde@5566.@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres'

# Sync schema to database (skip this step if using the test database)
npm run db-migrate:dev

# Initialize data (skip this step if using the test database)
npm run db-init:dev

# Return to the root directory and start
npm run start:dev
```

API documentation at [http://localhost:3000/doc](http://localhost:3000/doc), Admin panel at [http://localhost:5173](http://localhost:5173), Frontend content at [http://localhost:9000](http://localhost:9000)
