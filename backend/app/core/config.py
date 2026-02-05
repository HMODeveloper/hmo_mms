from pathlib import Path

from pydantic_settings import BaseSettings


class AppConfig(BaseSettings):
    """应用配置

    Attributes:
        PORT (int): 服务器端口
        DATABASE_URL (str): 数据库连接字符串
        LOG_PATH (Path): 日志文件路径
        DEBUG (bool): 是否启用调试模式
        SECRET_KEY (str): 用于加密的密钥
        TIME_OUT (int): 请求超时时间，单位秒
        INIT_PASSWORD (str): 初始管理员密码
        DEFAULT_PASSWORD (str): 默认密码, 用于重置用户密码
    """

    PORT: int = 8080
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/test.db"
    LOG_PATH: Path = Path("./logs")
    DEBUG: bool = False
    SECRET_KEY: str = ""
    TIME_OUT: int = 60 * 60
    INIT_PASSWORD: str = ""
    DEFAULT_PASSWORD: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"

    def valid(self):
        if self.SECRET_KEY == "":
            raise Exception("SECRET_KEY 未设置，请在 .env 文件中设置 SECRET_KEY")
        if self.INIT_PASSWORD == "":
            raise Exception("INIT_PASSWORD 未设置，请在 .env 文件中设置 INIT_PASSWORD")
        if self.DEFAULT_PASSWORD == "":
            raise Exception(
                "DEFAULT_PASSWORD 未设置，请在 .env 文件中设置 DEFAULT_PASSWORD"
            )


CONFIG = AppConfig()
