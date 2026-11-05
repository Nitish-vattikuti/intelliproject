import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "IntelliProject"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    TAGLINE: str = "Agentic AI-Based Intelligent Project Mentor using RAG and Knowledge Graph"
    DESCRIPTION: str = "An autonomous multi-agent mentorship ecosystem guiding engineering students through project ideation, literature RAG, novelty analysis, learning roadmaps, thesis documentation, and viva-voce preparation."
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./intelliproject.db")
    CHROMA_PERSIST_DIR: str = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
    CORS_ORIGINS: list[str] = ["*"]

settings = Settings()
