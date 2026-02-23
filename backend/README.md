# HMO MMS Backend

## 技术栈

- FastAPI, SQLAlchemy, Pydantic
- PostgreSQL (asyncpg) / SQLite (aiosqlite)
- Alembic, Loguru, Uvicorn
- pre-commit, ruff
- uv

## 项目结构

```
backend/
├── app/
│   ├── __init__.py            # FastAPI 应用创建
│   ├── main.py                # 应用入口
│   ├── api/                   # API 路由注册
│   ├── core/                  # 核心模块
│   │   ├── config.py          # 配置管理(读取 .env)
│   │   ├── database.py        # 数据库连接和会话
│   │   └── logger.py          # 日志配置
│   ├── handler/               # 请求处理器（路由控制器）
│   ├── model/                 # 数据库模型(SQLAlchemy)
│   │   └── __init__.py        # 数据模型定义
│   ├── schema/                # 数据验证模式(Pydantic)
│   └── utils/                 # 工具函数
│       ├── get_current_user.py # 获取当前用户
│       └── middleware.py      # 中间件（认证等）
│
├── .env                       # 环境变量配置(不提交到 Git)
├── alembic.ini                # Alembic 配置文件
├── pyproject.toml             # 项目依赖配置
└── uv.lock                    # uv 依赖锁定文件
```

## 安装启动

```bash
uv sync
uv run python -m app.main
```

## 环境变量

在 `backend/.env` 文件中配置:

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

