# FilmMood

A small, modern web application that summarises a film's mood profile. Discover whether a movie is funny, violent, dark, whimsical, tense, romantic, or thought-provoking before you watch it!

<img src="./screenshots/Home%20Page.png" width="600" alt="Search Page Screenshot">

## Features
- **Dynamic Search**: Instant search results as you type.
- **Mood Profiles**: Visualises the emotional tone of a movie using animated bars.
- **Modern UI**: Smooth animations, minimalist design, and a dynamic ambient background.

<img src="./screenshots/The%20Godfather%20Mood%20Profile.png" width="600" alt="Movie Profile Screenshot">

## How the Mood Scores Work

Instead of relying on basic genre tags, FilmMood calculates a nuanced emotional profile for each movie using the **MovieLens Genome Dataset**:
1. **Tag Mapping**: Hundreds of micro-tags from the dataset are grouped (like *"hilarious"*, *"satire"*, and *"witty"*) into 7 core mood buckets (e.g. *Funny*).
2. **Score Aggregation**: For any given movie, I evaluate its relevance scores across all micro-tags and aggregate the highest values into the core buckets.
3. **Normalisation**: The final scores are calculated and normalised between 0 and 1, ensuring a consistent and accurate representation of the movie's overall vibe.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, React Router
- **Backend**: Python, Flask, SQLite
- **Data**: TMDB API, MovieLens

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 1. Setup the Backend
The backend runs on Python and Flask.

1. Open a terminal in the root directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   flask run
   ```
   *The backend will be running on `http://127.0.0.1:5000`.*

### 2. Setup the Frontend
The frontend is built with React and Vite.

1. Open a **new** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

## Usage
Open your browser and navigate to **`http://localhost:5173`**. Type a movie name in the search bar and click on a result to view its mood profile!

*Disclaimer: This application uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.*<br>
*MovieLens data is provided by GroupLens Research at the University of Minnesota.*