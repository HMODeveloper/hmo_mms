# HMO MMS Frontend

## 技术栈

- Next, React, TypeScript
- shadcn/ui, Tailwind CSS
- Zustand, Axios
- ESLint, Stylistic
- pnpm

## 项目结构

```
frontend/
├── src/
│   ├── app/                   # Next.js App Router 目录
│   │   ├── (main)/            # 主应用路由组
│   │   │   ├── dashboard/     # 仪表盘页面
│   │   │   ├── department/    # 部门管理页面
│   │   │   ├── member/        # 成员管理页面
│   │   │   ├── user/          # 用户管理页面
│   │   │   ├── superadmin/    # 超级管理员页面
│   │   │   └── layout.tsx     # 主布局组件
│   │   ├── signup/            # 注册页面
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   └── globals.css        # 全局样式
│   ├── apis/                  # API 接口封装
│   ├── components/            # 业务组件
│   │   ├── bread-nav.tsx      # 面包屑导航
│   │   └── navbar.tsx         # 导航栏
│   ├── contexts/              # React Context
│   │   ├── auth.tsx           # 认证上下文
│   │   └── bread.tsx          # 面包屑上下文
│   ├── stores/                # Zustand 状态管理
│   │   ├── app.ts             # 应用全局状态
│   │   ├── college.ts         # 学院状态
│   │   ├── department.ts      # 部门状态
│   │   └── member.ts          # 成员状态
│   ├── models/                # 数据模型
│   │   ├── department.ts      # 部门模型
│   │   ├── user.ts            # 用户模型
│   │   └── error.ts           # 错误模型
│   ├── schema/                # 数据验证 Schema
│   └── lib/                   # 工具函数
│       ├── client.ts          # 客户端工具
│       ├── server.ts          # 服务端工具[README.md](../README.md)
│       └── config.ts          # 配置
│
├── components/                # shadcn/ui 组件
│   └── ui/                    # UI 组件库
│
├── public/                    # 静态资源
├── .env                       # 环境变量配置(不提交到 Git)
├── components.json            # shadcn/ui 配置
├── tsconfig.json              # TypeScript 配置
├── next.config.ts             # Next.js 配置
├── tailwind.config.ts         # Tailwind CSS 配置
├── uno.config.ts              # UnoCSS 配置
├── eslint.config.mjs          # ESLint 配置
└── package.json               # 项目依赖
```

## 安装启动

```bash
pnpm install
pnpm dev
```

## 环境变量

在 `frontend/.env` 中配置:

```env
# API 后端地址
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```
