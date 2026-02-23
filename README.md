# HMO Member Management System

湖南大学岳麓幻境社社员管理系统.

## 技术栈

**前端:**

- Next, React, TypeScript
- shadcn/ui, Tailwind CSS
- Zustand, Axios
- ESLint, Stylistic
- pnpm

**后端:**
-
- FastAPI, SQLAlchemy, Pydantic
- PostgreSQL (asyncpg) / SQLite (aiosqlite)
- Alembic, Loguru, Uvicorn
- pre-commit, ruff
- uv

## 安装启动

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 或分别安装
pnpm run install:frontend
pnpm run install:backend
```

### 启动开发服务器

```bash
# 同时启动前端和后端
pnpm dev

# 或分别启动
pnpm run dev:frontend   # 前端: http://localhost:3000
pnpm run dev:backend    # 后端: http://localhost:8000 (根据 .env 配置)
```

## 部署

### 一键部署

```bash
# 安装依赖 + 构建前端
pnpm run deploy

# 然后启动服务
pnpm start

# 或分别启动
pnpm run start:frontend0
pnpm run start:backend
```

## 配置

### 后端环境变量

在 `backend/.env` 中配置:

```env
# 服务器配置
PORT=1234
DEBUG=True

# 数据库配置(PostgreSQL)
DATABASE_URL="postgresql+asyncpg://user:password@localhost:port/db-name"

# 安全配置
SECRET_KEY="your-secret-key-here"
INIT_PASSWORD="superadmin-init-password"
DEFAULT_PASSWORD="reset-user-password"
```

### 前端环境变量

在 `frontend/.env` 中配置:

```env
# API 后端地址 (保证与后端 .env 中 PORT 配置一致)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```
