import { useState } from "react";
import { TEAMS } from "./teams";

function PredictionForm() {
  // Selected teams
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  // Backend result
  const [result, setResult] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Draggable widget state
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startDrag = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const onDrag = (e) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  };

  const stopDrag = () => {
    setDragging(false);
  };

  // Backend call
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
      setResult({ error: "Failed to reach backend" });
    }

    setLoading(false);
  };

  return (
    <>
      {/* Draggable widget containing BOTH form and prediction card */}
      <div
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          cursor: "grab",
          userSelect: "none",
          width: "450px",
          padding: "20px",
          background: "#1e1e1e",
          borderRadius: "12px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
          color: "white"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "26px",
            fontWeight: "600"
          }}
        >
          NFL Game Prediction
        </h2>

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

        <button
          onClick={getPrediction}
          disabled={loading || !team1 || !team2}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            width: "100%"
          }}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {/* Prediction card now INSIDE the draggable widget */}
        {result && !result.error && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              borderRadius: "12px",
              background: "#2a2a2a",
              boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              color: "white"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
              }}
            >
              <div style={{ textAlign: "center", width: "40%" }}>
                <div style={{ fontSize: "22px", fontWeight: "700" }}>
                  {result.team1}
                </div>
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "#333",
                    borderRadius: "50%",
                    margin: "10px auto"
                  }}
                />
              </div>

              <div style={{ fontSize: "20px", fontWeight: "600" }}>VS</div>

              <div style={{ textAlign: "center", width: "40%" }}>
                <div style={{ fontSize: "22px", fontWeight: "700" }}>
                  {result.team2}
                </div>
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "#333",
                    borderRadius: "50%",
                    margin: "10px auto"
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  fontWeight: "600"
                }}
              >
                Win Probability ({result.team1})
              </div>

              <div
                style={{
                  height: "14px",
                  width: "100%",
                  background: "#444",
                  borderRadius: "7px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${result.probability * 100}%`,
                    height: "100%",
                    background: "#007bff"
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: "10px",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#4da3ff"
                }}
              >
                {(result.probability * 100).toFixed(1)}%
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "10px",
                background: "#3a3a3a",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "600"
              }}
            >
              {result.probability > 0.5
                ? `${result.team1} is favored`
                : `${result.team2} is favored`}
            </div>
          </div>
        )}

        {result && result.error && (
          <div
            style={{
              marginTop: "20px",
              background: "#ffe5e5",
              padding: "15px",
              borderRadius: "4px",
              color: "#b30000",
              fontWeight: "bold"
            }}
          >
            {result.error}
          </div>
        )}
      </div>
    </>
  );
}

export default PredictionForm;
