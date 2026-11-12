import json
from pathlib import Path

import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

DATA_DIR = Path(__file__).parent / "data"

# ---------- Load data ----------
items = json.loads((DATA_DIR / "items.json").read_text(encoding="utf-8"))

# ---------- Embeddings ----------
embedder = SentenceTransformer("all-MiniLM-L6-v2")
EMB_FILE = DATA_DIR / "embeddings.npy"

if EMB_FILE.exists():
    embeddings = np.load(EMB_FILE)
else:
    texts = [f"{i['title']}. {i['genres']}. {i['summary']}" for i in items]
    embeddings = embedder.encode(texts, normalize_embeddings=True, show_progress_bar=True)
    np.save(EMB_FILE, embeddings)


def search(query: str, k: int = 3):
    q = embedder.encode([query], normalize_embeddings=True)[0]
    scores = embeddings @ q  # cosine similarity (vectors are normalized)
    top = np.argsort(-scores)[:k]
    return [{**items[i], "score": round(float(scores[i]), 3)} for i in top]


def explain(query: str, picks: list) -> str:
    # Simple placeholder. We replace it with a real chat model in Step 7.
    lines = [f"• {p['title']} ({p['year']}): {p['summary'][:120]}…" for p in picks]
    return "Here are my top picks for that vibe:\n" + "\n".join(lines)


# ---------- API ----------
app = FastAPI(title="Vibe Recommender")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str
    top_k: int = 3


class ChatRequest(BaseModel):
    message: str


@app.get("/api/items")
def get_items():
    return items


@app.post("/api/search")
def search_endpoint(req: SearchRequest):
    return search(req.query, req.top_k)


@app.post("/api/chat")
def chat(req: ChatRequest):
    picks = search(req.message, 3)
    reply = explain(req.message, picks)
    return {"reply": reply, "picks": picks}