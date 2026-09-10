from flask import Flask, jsonify, render_template, request

from .mood import get_mood_profile
from .tmdb_api import get_movie_details, search_movies

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")


@app.get("/movie/<int:movie_id>")
def movie(movie_id):
    try:
        movie_data = get_movie_details(movie_id)
    except Exception:
        return render_template(
            "movie.html",
            movie=None,
            error="Movie details are unavailable right now.",
        ), 502

    if not movie_data:
        return render_template(
            "movie.html",
            movie=None,
            error="Movie details are unavailable right now.",
        ), 503

    return render_template("movie.html", movie={
        "title": movie_data.get("title", "Untitled movie"),
        "year": (movie_data.get("release_date") or "")[:4],
        "poster_path": movie_data.get("poster_path"),
        "runtime": movie_data.get("runtime"),
        "genres": [genre["name"] for genre in movie_data.get("genres", [])],
        "rating": movie_data.get("vote_average"),
        "moods": get_mood_profile(movie_id),
    })


@app.get("/api/search")
def movie_search():
    title = request.args.get("q", "").strip()

    if not title:
        return jsonify([])

    try:
        movies = search_movies(title)
    except Exception:
        return jsonify({"error": "TMDB is unavailable right now."}), 502

    return jsonify([
        {
            "id": movie["id"],
            "title": movie["title"],
            "year": movie.get("release_date", "")[:4],
        }
        for movie in movies
    ])


if __name__ == "__main__":
    app.run(debug=True)