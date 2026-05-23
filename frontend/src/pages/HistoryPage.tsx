import { useEffect, useState } from "react";
import {
  getSavedWeatherSearches,
  deleteWeatherSearch,
  getCsvExportUrl,
  updateWeatherSearch,
} from "../services/weatherService";
import type { SavedWeatherSearch } from "../types/weather";

function HistoryPage() {
  const [searches, setSearches] = useState<SavedWeatherSearch[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSearches() {
      try {
        const data = await getSavedWeatherSearches();
        setSearches(data);
      } catch {
        setError("Could not load saved weather searches.");
      } finally {
        setLoading(false);
      }
    }

    loadSearches();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteWeatherSearch(id);
      setSearches((currentSearches) =>
        currentSearches.filter((search) => search.id !== id)
      );
    } catch {
      setError("Could not delete this saved search.");
    }
  };

  const handleUpdateNotes = async (search: SavedWeatherSearch) => {
    const newNotes = window.prompt("Update notes:", search.notes);

    if (newNotes === null) {
      return;
    }

    try {
      const updatedSearch = {
        ...search,
        notes: newNotes,
      };

      await updateWeatherSearch(search.id, updatedSearch);

      setSearches((currentSearches) =>
        currentSearches.map((item) =>
          item.id === search.id ? updatedSearch : item
        )
      );
    } catch {
      setError("Could not update notes.");
    }
  };

  return (
    <section>
      <h1>Search History</h1>
      <p>Previously searched weather records saved in the database.</p>

      <a className="export-button" href={getCsvExportUrl()} download>
        Export CSV
      </a>

      {loading && <p className="info-message">Loading saved searches...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="history-grid">
        {searches.map((search) => (
          <div className="history-card" key={search.id}>
            <h2>
              {search.location}, {search.country === "US" ? "USA" : search.country}
            </h2>
            <button
              className="update-button"
              type="button"
              onClick={() => handleUpdateNotes(search)}
            >
              Update Notes
            </button>
            <button
              className="delete-button"
              type="button"
              onClick={() => handleDelete(search.id)}
            >
              Delete
            </button>

            <p>Temperature: {Math.round(search.temperature)}°C</p>
            <p>Humidity: {search.humidity}%</p>
            <p>Wind Speed: {search.windSpeed} m/s</p>
            <p>Condition: {search.weatherCondition}</p>
            <p>Travel Score: {search.travelScore}/100</p>
            <p>Notes: {search.notes}</p>
            <p>
              Searched At:{" "}
              {new Date(search.searchedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HistoryPage;