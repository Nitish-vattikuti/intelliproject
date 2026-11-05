import os
import json
import httpx
from typing import Optional, Dict, Any, List
from app.core.config import settings

class LLMService:
    """
    LLM Service supporting live Google Gemini API with runtime configuration,
    multi-model resilient fallbacks across versioned flash endpoints, and key persistence.
    """
    CANDIDATE_MODELS = [
        "gemini-3.5-flash",
        "gemini-flash-lite-latest",
        "gemini-flash-latest",
        "gemini-3.8-flash"
    ]

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.model = "gemini-3.5-flash"
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.last_error = ""
        self.is_live = False
        if self.api_key:
            self.is_live = True

    def set_api_key(self, new_key: str):
        self.api_key = new_key.strip()
        settings.GEMINI_API_KEY = self.api_key
        os.environ["GEMINI_API_KEY"] = self.api_key
        
        # Persist to local .env
        try:
            paths = [
                os.path.join(os.getcwd(), ".env"),
                os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
            ]
            for env_path in set(paths):
                with open(env_path, "w") as f:
                    f.write(f"GEMINI_API_KEY={self.api_key}\n")
        except Exception as e:
            print(f"[LLMService] Failed to write .env: {e}")

    def is_connected(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 10)

    async def test_connection(self) -> Dict[str, Any]:
        """
        Actively validates the current API key against Gemini API with resilient model fallback.
        """
        if not self.is_connected():
            self.is_live = False
            self.last_error = "No API key configured."
            return {"connected": False, "message": self.last_error, "model": self.model}

        for candidate in self.CANDIDATE_MODELS:
            url = f"{self.base_url}/{candidate}:generateContent?key={self.api_key}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": "Respond with the single word: READY"}]}
                ],
                "generationConfig": {"temperature": 0.1, "maxOutputTokens": 20}
            }
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            self.model = candidate
                            self.is_live = True
                            self.last_error = ""
                            return {
                                "connected": True,
                                "message": f"Successfully connected live to Google Gemini ({candidate})!",
                                "model": candidate
                            }
                    elif resp.status_code in [404, 429, 500, 502, 503, 504]:
                        continue  # Try next model
                    else:
                        err_data = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
                        err_msg = err_data.get("error", {}).get("message", resp.text[:200])
                        self.last_error = f"HTTP {resp.status_code}: {err_msg}"
            except Exception as ex:
                self.last_error = str(ex)

        self.is_live = False
        return {
            "connected": False,
            "message": f"Gemini connection verification failed: {self.last_error or 'No supported model responded'}",
            "model": self.model
        }

    async def generate_content(self, system_instruction: str, prompt: str) -> str:
        """
        Executes a prompt against live Gemini with automated model fallbacks.
        """
        if not self.is_connected():
            return ""

        models_to_try = [self.model] + [m for m in self.CANDIDATE_MODELS if m != self.model]

        for candidate in models_to_try:
            try:
                url = f"{self.base_url}/{candidate}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [
                        {"role": "user", "parts": [{"text": f"{system_instruction}\n\nTask:\n{prompt}"}]}
                    ],
                    "generationConfig": {
                        "temperature": 0.35,
                        "topP": 0.95,
                        "maxOutputTokens": 8192
                    }
                }
                async with httpx.AsyncClient(timeout=45.0) as client:
                    response = await client.post(url, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                self.model = candidate
                                self.is_live = True
                                return parts[0]["text"]
                    elif response.status_code in [404, 429, 500, 502, 503, 504]:
                        print(f"[LLMService] Model {candidate} returned {response.status_code}, falling back...")
                        continue
                    else:
                        print(f"[LLMService] Gemini API returned {response.status_code} for {candidate}: {response.text[:200]}")
            except Exception as e:
                print(f"[LLMService] Gemini API call error on {candidate}: {e}")

        return ""

llm_service = LLMService()
