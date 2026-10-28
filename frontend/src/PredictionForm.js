import { useState } from "react";
import { TEAMS } from "./teams";

function PredictionForm() {
  // Remember which teams the user selected and the latest prediction response.
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [result, setResult] = useState(null);
  // Use this flag to show progress and prevent another request while loading.
  const [loading, setLoading] = useState(false);

  // Track the card's small drag offset and where the pointer first grabbed it.
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Start moving the card and remember the pointer's position inside it.
  const startDrag = (event) => {
    setDragging(true);
    setOffset({
      x: event.clientX - pos.x,
      y: event.clientY - pos.y
    });
  };

  // Move the card with the pointer while it is being dragged.
  const onDrag = (event) => {
    if (!dragging) return;
    setPos({
      x: event.clientX - offset.x,
      y: event.clientY - offset.y
    });
  };

  // Stop dragging when the pointer is released or leaves the card.
  const stopDrag = () => {
    setDragging(false);
  };

  // Ask the backend for a prediction using the two selected teams.
  const getPrediction = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/nfl/predict?team1=${team1}&team2=${team2}`
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      // Show a readable message if the backend cannot be reached.
      setResult({ error: "Failed to reach backend" });
    }

    setLoading(false);
  };

  return (
    <div
      className={`prediction-widget${dragging ? " prediction-widget--dragging" : ""}`}
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      <h2 className="prediction-widget__title">NFL Game Prediction</h2>

      {/* Let the user choose the first team from the shared team list. */}
      <label className="prediction-field" htmlFor="team1">
        <span className="prediction-field__label">Team 1</span>
        <select
          id="team1"
          className="prediction-field__select"
          value={team1}
          onChange={(event) => setTeam1(event.target.value)}
        >
          <option value="">Select Team 1</option>
          {TEAMS.map((team) => (
            <option key={team.abbr} value={team.abbr}>
              {team.name}
            </option>
          ))}
        </select>
      </label>

      {/* Let the user choose the opponent. */}
      <label className="prediction-field" htmlFor="team2">
        <span className="prediction-field__label">Team 2</span>
        <select
          id="team2"
          className="prediction-field__select"
          value={team2}
          onChange={(event) => setTeam2(event.target.value)}
        >
          <option value="">Select Team 2</option>
          {TEAMS.map((team) => (
            <option key={team.abbr} value={team.abbr}>
              {team.name}
            </option>
          ))}
        </select>
      </label>

      {/* The button is enabled only after both teams are selected. */}
      <button
        className="prediction-button"
        onClick={getPrediction}
        disabled={loading || !team1 || !team2}
      >
        {loading ? "Predicting..." : "Predict"}
      </button>

      {/* Display the matchup, probability bar, and favored team on success. */}
      {result && !result.error && (
        <section className="prediction-result" aria-live="polite">
          <div className="prediction-result__matchup">
            <div className="prediction-result__team">
              {result.team1}
              <div className="prediction-result__badge" aria-hidden="true">
                {result.team1}
              </div>
            </div>
            <div className="prediction-result__versus">VS</div>
            <div className="prediction-result__team">
              {result.team2}
              <div className="prediction-result__badge" aria-hidden="true">
                {result.team2}
              </div>
            </div>
          </div>

          <p className="prediction-result__label">
            Win Probability ({result.team1})
          </p>
          <div
            className="prediction-result__track"
            role="progressbar"
            aria-label={`${result.team1} win probability`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={result.probability * 100}
          >
            <div
              className="prediction-result__fill"
              style={{ width: `${result.probability * 100}%` }}
            />
          </div>
          <p className="prediction-result__percentage">
            {(result.probability * 100).toFixed(1)}%
          </p>
          <p className="prediction-result__favorite">
            {result.probability > 0.5
              ? `${result.team1} is favored`
              : `${result.team2} is favored`}
          </p>
        </section>
      )}

      {/* Announce backend errors so they are visible to all users. */}
      {result && result.error && (
        <div className="prediction-error" role="alert">
          {result.error}
        </div>
      )}
    </div>
  );
}

export default PredictionForm;
