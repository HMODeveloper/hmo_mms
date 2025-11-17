import logging
import sys
from pathlib import Path
from types import FrameType
from typing import cast

from loguru import logger

from app.core.config import CONFIG

LOG_PATH = Path(CONFIG.LOG_PATH)


# 劫持 FastAPI 日志
class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord):
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno
        # 获取日志调用堆栈信息
        frame, depth = logging.currentframe(), 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = cast(FrameType, frame.f_back)
            depth += 1
        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )


# 替换 FastAPI 的日志记录器
def configure_logging():
    logger.remove()

    # 控制台输出
    logger.add(
        sys.stdout,
        format="<level>{level: <4}</level> | <cyan>{time:HH:mm:ss.SSS}</cyan> | <level>{message}</level>",
        level="DEBUG" if CONFIG.DEBUG else "INFO",
        colorize=True,
    )

    # 文件输出
    logger.add(
        LOG_PATH / "app_{time:YYYY-MM-DD}.log",
        rotation="00:00",  # 每天更新
        retention="7 days",  # 保留7天
        compression="zip",  # 压缩
        encoding="utf-8",
        enqueue=True,
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <4} | {message}",
        level="DEBUG" if CONFIG.DEBUG else "INFO",
    )

    # 劫持标准 logging 模块
    logging.basicConfig(
        handlers=[InterceptHandler()],
        level=0,
    )

    log_pool = [
        "fastapi",
        "uvicorn",
        "uvicorn.error",
        "uvicorn.access",
    ]

    if CONFIG.DEBUG:
        log_pool.extend(["sqlalchemy.engine", "sqlalchemy.engine.Engine"])

    # 指定劫持日志源
    for logger_name in log_pool:
        logging_logger = logging.getLogger(logger_name)
        logging_logger.handlers = [InterceptHandler()]
        logging_logger.propagate = False


configure_logging()
logger.info("Logger 初始化完成!")
