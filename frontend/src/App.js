import PredictionForm from "./PredictionForm";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #0f0f0f, #1c1c1c, #2a2a2a)",
        color: "white",
        textAlign: "center"
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          marginBottom: "40px"
        }}
      >
        NFL Prediction Dashboard
      </h1>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto"
        }}
      >
        <PredictionForm />
      </div>
    </div>
  );
}

export default App;
