from dotenv import load_dotenv
import os

import requests

load_dotenv()

TMDB_READ_ACCESS_TOKEN = os.getenv("TMDB_READ_ACCESS_TOKEN")
TMDB_BASE_URL = "https://api.themoviedb.org/3"


def search_movies(title):
	"""Search TMDB for movies matching the user's title."""
	if not TMDB_READ_ACCESS_TOKEN or not title.strip():
		return []

	headers = {
		"Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}",
		"accept": "application/json",
	}

	response = requests.get(
		f"{TMDB_BASE_URL}/search/movie",
		headers=headers,
		params={
			"query": title.strip(),
			"include_adult": "false",
			"language": "en-US",
			"page": 1,
		},
		timeout=10,
	)
	response.raise_for_status()

	return response.json().get("results", [])[:8]

