from flask import Flask, jsonify, render_template, request

from .tmdb_api import search_movies

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")


@app.get("/movie/<int:movie_id>")
def movie(movie_id):
    title = request.args.get("title", "Selected movie")
    return render_template("movie.html", movie_id=movie_id, title=title)


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