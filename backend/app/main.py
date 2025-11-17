from uvicorn import run

from . import create_app
from app.core.config import CONFIG

app = create_app()

if __name__ == "__main__":
    run(
        app,
        host="0.0.0.0",
        port=CONFIG.PORT,
    )
