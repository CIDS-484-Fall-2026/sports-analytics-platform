from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.nfl_model import predict_nfl_game
from backend.schedule import get_current_week_schedule
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
    warnings.filterwarnings("ignore", category=UserWarning) # filters out UserWarnings from sklearn
    return predict_nfl_game(team1, team2)



@app.get("/nfl/current-week")
def get_current_week_games():
    try:
        return get_current_week_schedule()
    except Exception as error:
        # Do not silently substitute sample fixtures when the schedule source
        # is unavailable; let the frontend show a clear retryable error.
        raise HTTPException(
            status_code=503,
            detail="The NFL schedule is temporarily unavailable.",
        ) from error
