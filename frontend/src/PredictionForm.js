import { useState } from "react";
import { TEAMS } from "./teams"; // List of NFL teams (name + abbreviation)

function PredictionForm() {
  // Store selected teams
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  // Store backend prediction result
  const [result, setResult] = useState(null);

  // Loading state for button UI
  const [loading, setLoading] = useState(false);

  // Main function: calls FastAPI backend to get prediction
  const getPrediction = async () => {
    setLoading(true);      // Show "Predicting..."
    setResult(null);       // Clear previous result

    try {
      // Send GET request to FastAPI prediction endpoint
      const response = await fetch(
        `http://127.0.0.1:8000/nfl/predict?team1=${team1}&team2=${team2}`
      );

      // Parse JSON returned by backend
      const data = await response.json();

      // Store prediction result so UI can display it
      setResult(data);

    } catch (error) {
      // If backend unreachable or JSON invalid
      setResult({ error: "Failed to reach backend" });
    }

    setLoading(false);     // Reset button state
  };

  return (
    <div style={{ maxWidth: "450px", margin: "20px auto", padding: "20px" }}>
      <h2>NFL Game Prediction</h2>

      {/* Team 1 Dropdown */}
      <label style={{ fontWeight: "bold" }}>Team 1</label>
      <select
        value={team1}
        onChange={(e) => setTeam1(e.target.value)}
        style={{
          display: "block",
          marginBottom: "15px",
          width: "100%",
          padding: "8px"
        }}
      >
        <option value="">Select Team 1</option>
        {TEAMS.map((team) => (
          <option key={team.abbr} value={team.abbr}>
            {team.name}
          </option>
        ))}
      </select>

      {/* Team 2 Dropdown */}
      <label style={{ fontWeight: "bold" }}>Team 2</label>
      <select
        value={team2}
        onChange={(e) => setTeam2(e.target.value)}
        style={{
          display: "block",
          marginBottom: "15px",
          width: "100%",
          padding: "8px"
        }}
      >
        <option value="">Select Team 2</option>
        {TEAMS.map((team) => (
          <option key={team.abbr} value={team.abbr}>
            {team.name}
          </option>
        ))}
      </select>

      {/* Predict Button */}
      <button
        onClick={getPrediction}
        disabled={loading || !team1 || !team2} // Disable until ready
        style={{
          padding: "10px 15px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}
      >
        {loading ? "Predicting..." : "Predict"}
      </button>

      {/* Display backend result */}
      {result && (
        <pre
          style={{
            marginTop: "20px",
            background: "#f4f4f4",
            padding: "15px",
            borderRadius: "4px"
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default PredictionForm;
