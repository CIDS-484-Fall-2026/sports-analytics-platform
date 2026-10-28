import PredictionForm from "./PredictionForm";
import GameTicker from "./GameTicker";
import "./App.css";

function App() {
  // The page keeps the game ticker above the prediction dashboard.
  return (
    <div className="dashboard">
      <GameTicker />
      <main className="dashboard__content">
        {/* Introduce the dashboard and explain what the prediction tool does. */}
        <p className="dashboard__eyebrow">Game-day insights</p>
        <h1 className="dashboard__title">NFL Prediction Dashboard</h1>
        <p className="dashboard__subtitle">
          Compare two teams and explore the model’s projected win probability.
        </p>
        {/* Keep the prediction form centered and sized for the page. */}
        <div className="dashboard__form">
          <PredictionForm />
        </div>
      </main>
    </div>
  );
}

export default App;