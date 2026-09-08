const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#movie-search");
const dropdown = document.querySelector("#dropdown");
const searchStatus = document.querySelector("#search-status");
let searchTimer;

if (searchForm) {
function clearDropdown() {
	dropdown.replaceChildren();
}

function showMovies(movies) {
	clearDropdown();

	movies.forEach((movie) => {
		const link = document.createElement("a");
		const year = movie.year ? ` (${movie.year})` : "";

		link.href = `/movie/${movie.id}?title=${encodeURIComponent(movie.title)}`;
		link.textContent = `${movie.title}${year}`;
		link.setAttribute("role", "option");
		dropdown.appendChild(link);
	});
}

searchForm.addEventListener("submit", (event) => event.preventDefault());

searchInput.addEventListener("input", () => {
	clearTimeout(searchTimer);
	clearDropdown();
	searchStatus.textContent = "";

	const query = searchInput.value.trim();
	if (query.length < 2) return;

	searchStatus.textContent = "Searching...";
	searchTimer = setTimeout(async () => {
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
			const movies = await response.json();

			if (!response.ok) throw new Error(movies.error);

			if (!movies.length) {
				searchStatus.textContent = "No movies found.";
				return;
			}

			showMovies(movies);
			searchStatus.textContent = "";
		} catch (error) {
			searchStatus.textContent = error.message || "Search failed.";
		}
	}, 300);
});

document.addEventListener("click", (event) => {
	if (!searchForm.contains(event.target)) clearDropdown();
});
}
