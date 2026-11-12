import json
import re
import pandas as pd

df = pd.read_csv("data/imdb_top_1000.csv")
df = df.dropna(subset=["Series_Title", "Overview", "Poster_Link"])

def bigger_poster(url: str) -> str:
    # The dataset's posters are tiny thumbnails; this asks for a larger version.
    return re.sub(r"_V1_.*\.jpg$", "_V1_UX400.jpg", url)

items = []
for i, row in enumerate(df.itertuples()):
    items.append({
        "id": i,
        "type": "movie",
        "title": row.Series_Title,
        "year": str(row.Released_Year),
        "genres": row.Genre,
        "rating": float(row.IMDB_Rating),
        "summary": row.Overview,
        "poster": bigger_poster(row.Poster_Link),
        "creator": row.Director,
    })

with open("data/items.json", "w", encoding="utf-8") as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f"Saved {len(items)} items")