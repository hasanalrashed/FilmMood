import csv
import sqlite3
import math
import os
import re
from pathlib import Path


MOOD_TAGS = {
    "Funny": (
        "funny", "comedy", "humorous", "hilarious", "humor", "witty", "satire",
        "satirical", "comic",
    ),
    "Whimsical": (
        "whimsical", "quirky", "playful", "eccentric", "surreal", "fantastical",
    ),
    "Romantic": (
        "romantic", "romance", "love", "relationship", "relationships", "passion",
        "heartwarming",
    ),
    "Tense": (
        "tense", "suspenseful", "suspense", "thriller", "intense", "anxiety",
        "anxious", "nerve-wracking",
    ),
    "Dark": (
        "dark", "disturbing", "bleak", "grim", "morbid", "unsettling", "cynical",
        "tragic", "tragic ending",
    ),
    "Thought-provoking": (
        "thought-provoking",
        "thought provoking",
        "philosophical",
        "reflective",
        "intelligent",
        "deep",
        "meaningful",
    ),
    "Violent": ("violent", "violence", "gore", "brutal", "bloody", "action violence"),
}
DATA_DIR = Path(
    os.getenv(
        "MOVIELENS_DATA_DIR",
        Path(__file__).resolve().parent.parent / "data" / "raw" / "ml-32m",
    )
)
GENOME_SCORES_PATH = DATA_DIR.parent / "genome_2021" / "movie_dataset_public_final" / "scores" / "glmer.csv"
DB_PATH = DATA_DIR.parent.parent / "processed" / "mood_profiles.sqlite"


def _normalise(value):
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def _matching_concepts(tag):
    normalised_tag = f" {_normalise(tag)} "
    return {
        mood
        for mood, concepts in MOOD_TAGS.items()
        if any(f" {_normalise(concept)} " in normalised_tag for concept in concepts)
    }


def _build_profiles():
    profiles = {}
    movie_lens_to_tmdb = {}

    with (DATA_DIR / "links.csv").open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            if row["tmdbId"]:
                movie_lens_to_tmdb[row["movieId"]] = row["tmdbId"]

    tag_to_moods = {}
    with GENOME_SCORES_PATH.open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            tag = row["tag"]
            if tag not in tag_to_moods:
                tag_to_moods[tag] = _matching_concepts(tag)
            
            moods = tag_to_moods[tag]
            if not moods:
                continue

            score = float(row["score"])
            movie_profile = profiles.setdefault(row["item_id"], {})
            for mood in moods:
                movie_profile[mood] = max(movie_profile.get(mood, 0.0), score)

    tmdb_profiles = {}
    for movie_lens_id, mood_scores in profiles.items():
        tmdb_id = movie_lens_to_tmdb.get(movie_lens_id)
        if not tmdb_id:
            continue

        tmdb_profiles[tmdb_id] = {
            mood: round(max(0.0, min(1.0, score)), 2)
            for mood, score in mood_scores.items()
        }

    DB_PATH.parent.mkdir(exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("CREATE TABLE IF NOT EXISTS mood_profile (tmdb_id INTEGER, mood TEXT, score REAL, PRIMARY KEY (tmdb_id, mood))")
        conn.execute("DELETE FROM mood_profile")
        
        rows = []
        for tmdb_id, scores in tmdb_profiles.items():
            for mood, score in scores.items():
                rows.append((int(tmdb_id), mood, score))
        
        conn.executemany("INSERT INTO mood_profile (tmdb_id, mood, score) VALUES (?, ?, ?)", rows)
        conn.commit()


def get_mood_profile(tmdb_id):
    """Return 0-1 MovieLens tag scores for a TMDB movie ID."""
    if not DB_PATH.exists():
        _build_profiles()

    profile = {}
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute("SELECT mood, score FROM mood_profile WHERE tmdb_id = ?", (int(tmdb_id),))
        for row in cursor:
            profile[row[0]] = row[1]
            
    return {mood: profile.get(mood, 0.0) for mood in MOOD_TAGS}