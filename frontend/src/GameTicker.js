import { useEffect, useState } from "react";

function GameTicker() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const loadGames = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://127.0.0.1:8000/nfl/current-week", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Schedule request failed (${response.status}).`);
        }

        const data = await response.json();
        if (!data || !Array.isArray(data.games)) {
          throw new Error("The schedule response was invalid.");
        }
        setGames(data.games);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError("Could not load this week's NFL schedule. Please try again.");
          setGames([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadGames();
    return () => controller.abort();
  }, [requestNumber]);

  return (
    <section
      className="game-ticker"
      aria-label="Current week NFL games"
      aria-busy={loading}
    >
      {loading && (
        <p className="game-ticker__message" role="status">
          Loading this week's NFL schedule…
        </p>
      )}
      {!loading && error && (
        <div className="game-ticker__message game-ticker__error" role="alert">
          <span>{error}</span>
          <button
            className="game-ticker__retry"
            type="button"
            onClick={() => setRequestNumber((number) => number + 1)}
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && games.length === 0 && (
        <p className="game-ticker__message" role="status">
          No NFL games are scheduled this week.
        </p>
      )}
      {!loading && !error && games.length > 0 && (
        <div
          className={`game-ticker__track${
            games.length > 1 ? " game-ticker__track--animated" : ""
          }`}
        >
          {(games.length > 1 ? [false, true] : [false]).map((duplicate) => (
            <div
              className="game-ticker__group"
              aria-hidden={duplicate ? "true" : undefined}
              key={duplicate ? "duplicate" : "games"}
            >
              {games.map((game, index) => (
                <span
                  className="game-ticker__game"
                  key={`${game.date}-${game.away}-${game.home}-${index}`}
                >
                  <span className="game-ticker__matchup">
                    {game.away} @ {game.home}
                  </span>
                  <span className="game-ticker__separator" aria-hidden="true">
                    ·
                  </span>
                  <span>{game.date} {game.time}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default GameTicker;
