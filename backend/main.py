from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.nfl_model import predict_nfl_game
import warnings

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/nfl/predict")
def predict(team1: str, team2: str):
    warnings.filterwarnings("ignore", category=UserWarning)
    return predict_nfl_game(team1, team2)
