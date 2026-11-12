import os
import sys
import time
import base64
import hashlib
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI(title="JARVIS Neural TTS Backend", version="5.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ENVIRONMENT API KEYS & CUSTOM VOICE ID
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_ACTUAL_GEMINI_API_KEY_HERE").strip(' "\'')
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip(' "\'')
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "").strip(' "\'')
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "").strip(' "\'')

# DEFAULT CUSTOM ELEVENLABS VOICE ID (Can be set in .env or Render Env Variables)
DEFAULT_CUSTOM_VOICE_ID = os.getenv("ELEVENLABS_CUSTOM_VOICE_ID", os.getenv("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")).strip(' "\'')

genai.configure(api_key=GEMINI_API_KEY)

# ELEVENLABS DEDICATED CUSTOM JARVIS VOICE PROFILE
ELEVENLABS_VOICES = {
    "jarvis": DEFAULT_CUSTOM_VOICE_ID,
    "custom": DEFAULT_CUSTOM_VOICE_ID
}

# IN-MEMORY AUDIO RESPONSE CACHE & USAGE TRACKER
tts_audio_cache: Dict[str, str] = {}
total_chars_used: int = 0

# ---------------------------------------------------------------------------
# AI MODEL PROVIDER ABSTRACTION & ROUTER
# ---------------------------------------------------------------------------

class BaseAIProvider:
    def __init__(self, name: str):
        self.name = name

    async def generate_response(self, prompt: str) -> Optional[str]:
        raise NotImplementedError

class GeminiProvider(BaseAIProvider):
    def __init__(self):
        super().__init__("gemini-1.5-flash")
        generation_config = {
            "temperature": 0.4,
            "top_p": 0.9,
            "max_output_tokens": 120,
        }
        try:
            self.model = genai.GenerativeModel("gemini-1.5-flash", generation_config=generation_config)
        except Exception:
            self.model = genai.GenerativeModel("gemini-pro", generation_config=generation_config)

    async def generate_response(self, prompt: str) -> Optional[str]:
        try:
            response = self.model.generate_content(prompt)
            if hasattr(response, "text") and response.text:
                return response.text.strip()
            elif hasattr(response, "candidates") and response.candidates:
                parts = response.candidates[0].content.parts
                return "".join([p.text for p in parts if hasattr(p, "text")]).strip()
        except Exception as e:
            print(f"⚠️ GeminiProvider error: {e}")
        return None

class DeepSeekOpenAIProvider(BaseAIProvider):
    def __init__(self):
        super().__init__("deepseek-reasoning")

    async def generate_response(self, prompt: str) -> Optional[str]:
        if not DEEPSEEK_API_KEY and not OPENAI_API_KEY:
            print("ℹ️ DeepSeek/OpenAI key not configured on Render. Using Gemini reasoning engine.")
            gemini = GeminiProvider()
            reasoning_prompt = f"System: Perform deep reasoning & step-by-step logic for Hanzala sir.\nQuery: {prompt}"
            return await gemini.generate_response(reasoning_prompt)

        try:
            import urllib.request
            import json

            api_url = "https://api.deepseek.com/v1/chat/completions" if DEEPSEEK_API_KEY else "https://api.openai.com/v1/chat/completions"
            api_key = DEEPSEEK_API_KEY or OPENAI_API_KEY
            model_name = "deepseek-chat" if DEEPSEEK_API_KEY else "gpt-3.5-turbo"

            payload = {
                "model": model_name,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 120,
                "temperature": 0.3
            }
            req = urllib.request.Request(
                api_url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                }
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"⚠️ DeepSeekOpenAIProvider error: {e}")
            gemini = GeminiProvider()
            return await gemini.generate_response(prompt)

class AIModelRouter:
    def __init__(self):
        self.gemini_provider = GeminiProvider()
        self.deepseek_provider = DeepSeekOpenAIProvider()

    def classify_intent(self, prompt: str) -> str:
        p = prompt.lower()
        coding_keywords = ["code", "python", "kotlin", "function", "script", "bug", "debug", "sql", "java", "html", "class"]
        reasoning_keywords = ["solve", "math", "calculate", "why", "explain", "logic", "prove", "derive"]

        if any(k in p for k in coding_keywords):
            return "coding"
        elif any(k in p for k in reasoning_keywords):
            return "reasoning"
        else:
            return "general"

    async def route_and_execute(self, prompt: str, preference: str = "AUTO") -> Dict[str, str]:
        intent = self.classify_intent(prompt)
        selected_name = "gemini-1.5-flash"

        if preference == "DEEPSEEK_REASONING" or (preference == "AUTO" and intent in ["coding", "reasoning"]):
            primary_provider = self.deepseek_provider
            selected_name = "deepseek-reasoning" if (DEEPSEEK_API_KEY or OPENAI_API_KEY) else "gemini-1.5-flash"
        else:
            primary_provider = self.gemini_provider
            selected_name = "gemini-1.5-flash"

        result = await primary_provider.generate_response(prompt)

        if not result:
            print("🔄 Primary provider failed. Retrying with Gemini 1.5 Flash...")
            result = await self.gemini_provider.generate_response(prompt)
            selected_name = "gemini-1.5-flash"

        final_reply = result or "All systems operational, Hanzala sir. Ready for your next query."
        return {
            "reply": final_reply,
            "model_used": selected_name,
            "intent": intent
        }

router = AIModelRouter()

# ---------------------------------------------------------------------------
# REQUEST & RESPONSE MODELS
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    message: str
    model_preference: Optional[str] = "AUTO"

class TtsRequest(BaseModel):
    text: str
    voice_key: Optional[str] = "adam"
    style: Optional[str] = "natural"

# ---------------------------------------------------------------------------
# FASTAPI ENDPOINTS
# ---------------------------------------------------------------------------

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "JARVIS Neural TTS & Multi-Model AI Brain",
        "elevenlabs_configured": bool(ELEVENLABS_API_KEY),
        "custom_voice_id": DEFAULT_CUSTOM_VOICE_ID,
        "elevenlabs_status": "Active" if bool(ELEVENLABS_API_KEY) else "ELEVENLABS_API_KEY Missing on Server",
        "total_chars_used": total_chars_used,
        "version": "5.1.0"
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        user_msg = request.message.strip() if request.message else ""
        pref = request.model_preference or "AUTO"

        if not user_msg:
            return {
                "reply": "Please speak or enter a valid command, Hanzala sir.",
                "model_used": "system"
            }

        res = await router.route_and_execute(user_msg, preference=pref)
        return {
            "reply": res["reply"],
            "model_used": res["model_used"],
            "intent": res["intent"]
        }

    except Exception as e:
        return {
            "reply": f"Issue encountered, Hanzala sir: {str(e)}",
            "model_used": "system_error"
        }

@app.post("/tts")
async def generate_neural_tts(request: TtsRequest):
    global total_chars_used, tts_audio_cache

    if not ELEVENLABS_API_KEY:
        return {
            "status": "fallback",
            "message": "ElevenLabs API key not configured on server. Falling back to built-in TTS."
        }

    clean_text = request.text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    v_key = (request.voice_key or "jarvis").lower().strip()
    voice_id = ELEVENLABS_VOICES.get(v_key, DEFAULT_CUSTOM_VOICE_ID)

    # Check Audio Cache with unique voice key
    cache_key = f"{v_key}_{voice_id}_{request.style}_{clean_text}"
    cache_hash = hashlib.md5(cache_key.encode("utf-8")).hexdigest()

    if cache_hash in tts_audio_cache:
        print(f"⚡ TTS Cache Hit for: '{clean_text[:30]}...'")
        return {
            "status": "success",
            "audio_base64": tts_audio_cache[cache_hash],
            "cached": True,
            "chars_used": total_chars_used
        }

    try:
        import urllib.request
        import json

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

        # Precision Refined Baritone Settings (30-40 Age Perceived Profile)
        stability = 0.68          # Composed, intelligent, non-monotone stability
        similarity_boost = 0.85   # Rich baritone fidelity & clarity
        style_exaggeration = 0.10 # Controlled, natural human speech without movie trailer drama

        if request.style == "professional":
            stability = 0.75
            style_exaggeration = 0.05
        elif request.style == "cinematic":
            stability = 0.60
            style_exaggeration = 0.20
        elif request.style == "alert":
            stability = 0.50
            style_exaggeration = 0.25

        payload = {
            "text": clean_text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.65,
                "similarity_boost": 0.85
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "xi-api-key": ELEVENLABS_API_KEY,
                "Accept": "audio/mpeg"
            }
        )

        with urllib.request.urlopen(req, timeout=12) as resp:
            audio_data = resp.read()
            audio_base64 = base64.b64encode(audio_data).decode("utf-8")

            # Cache response
            tts_audio_cache[cache_hash] = audio_base64
            total_chars_used += len(clean_text)

            print(f"🔊 Generated ElevenLabs Neural Audio ({len(clean_text)} chars, Voice: {request.voice_key})")

            return {
                "status": "success",
                "audio_base64": audio_base64,
                "cached": False,
                "chars_used": total_chars_used
            }

    except Exception as e:
        import urllib.error
        if isinstance(e, urllib.error.HTTPError):
            err_body = e.read().decode('utf-8', errors='ignore') if hasattr(e, 'read') else ''
            print(f"❌ ElevenLabs HTTP Error {e.code}: {e.reason} | Body: {err_body}")
            return {
                "status": "fallback",
                "message": f"ElevenLabs HTTP {e.code} Error: {e.reason}"
            }
        else:
            print(f"⚠️ ElevenLabs TTS API error: {e}")
            return {
                "status": "fallback",
                "message": f"ElevenLabs API error: {str(e)}"
            }

@app.post("/preview_voice")
async def preview_voice(request: TtsRequest):
    request.text = "Hello Hanzala sir. This is your personal neural AI voice preview."
    return await generate_neural_tts(request)

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting JARVIS Phase 5 Neural TTS Backend on http://0.0.0.0:8000 ...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
