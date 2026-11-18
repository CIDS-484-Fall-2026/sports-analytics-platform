# NFL Sports Analytics Architecture

The diagram below shows how the React frontend, FastAPI backend, model, analytics
code, and external data sources are connected.

```mermaid
flowchart LR
    Browser[Browser user]

    subgraph Frontend["React frontend - frontend/src"]
        Root[index.js<br/>React root]
        App[App.js<br/>Dashboard layout]
        Ticker[GameTicker.js<br/>Schedule UI]
        Prediction[PredictionForm.js<br/>Team selectors and results]
        Teams[teams.js<br/>Team names and ESPN logo keys]
        Spread[Vegas spread comparison<br/>Frontend-only state]
        ESPN[ESPN team-logo CDN]
    end

    subgraph Backend["FastAPI backend - backend"]
        Main[main.py<br/>App and CORS middleware]
        ScheduleRoute[GET /nfl/current-week]
        PredictRoute[GET /nfl/predict]
        Schedule[schedule.py<br/>Season lookup and 6-hour cache]
        ModelLogic[nfl_model.py<br/>Feature lookup and prediction]
    end

    subgraph Analytics["Analytics and model"]
        Loader[analytics/nfl_data_loader.py<br/>2023 schedule and features]
        Model[analytics/nfl_model.pkl<br/>Trained classifier]
        NFLverse[nfl_data_py / nflverse]
    end

    Browser -->|opens| Root
    Root -->|renders| App
    App --> Ticker
    App --> Prediction

    Prediction -->|selects teams| Teams
    Teams -->|loads logos| ESPN
    Prediction -->|optional spread| Spread
    Spread -->|compares with probability| Prediction

    Ticker -->|GET /nfl/current-week| Main
    Prediction -->|GET /nfl/predict with team parameters| Main
    Main --> ScheduleRoute
    Main --> PredictRoute

    ScheduleRoute --> Schedule
    Schedule -->|cache miss or expiry| NFLverse
    Schedule -->|season, week, games| ScheduleRoute
    ScheduleRoute -->|JSON or HTTP 503| Ticker

    PredictRoute --> ModelLogic
    ModelLogic -->|load and prepare games| Loader
    Loader -->|import_schedules([2023])| NFLverse
    ModelLogic -->|predict_proba(features)| Model
    ModelLogic -->|team names and probability| PredictRoute
    PredictRoute -->|prediction JSON or error JSON| Prediction
```

## Request flows

### Load the current-week schedule

```mermaid
sequenceDiagram
    actor User
    participant Ticker as GameTicker.js
    participant API as FastAPI main.py
    participant Schedule as schedule.py
    participant Cache as Season cache
    participant NFLverse as nfl_data_py

    User->>Ticker: Open dashboard
    Ticker->>API: GET /nfl/current-week
    API->>Schedule: get_current_week_schedule()
    Schedule->>Cache: load_season_schedule(season)
    alt Cache miss or expired
        Cache->>NFLverse: import_schedules([season])
        NFLverse-->>Cache: Season schedule
    end
    Cache-->>Schedule: Schedule DataFrame
    Schedule-->>API: season, week, and games
    API-->>Ticker: JSON response or HTTP 503
    Ticker-->>User: Loading, games, empty, or retry state
```

### Predict a game

```mermaid
sequenceDiagram
    actor User
    participant Form as PredictionForm.js
    participant Teams as teams.js
    participant API as FastAPI main.py
    participant Logic as nfl_model.py
    participant Features as Prepared team features
    participant Model as nfl_model.pkl

    User->>Form: Select Team 1 and Team 2
    Form->>Teams: Get names and logo keys
    User->>Form: Click Predict
    Form->>API: GET /nfl/predict?team1=...&team2=...
    API->>Logic: predict_nfl_game(team1, team2)
    Logic->>Features: Look up both teams
    alt Team not found
        Features-->>Logic: Missing team
        Logic-->>API: Error response
        API-->>Form: team-not-found JSON
    else Both teams found
        Features-->>Logic: Win percentages and point differentials
        Logic->>Model: predict_proba(feature list)
        Model-->>Logic: Win probability
        Logic-->>API: team names and probability
        API-->>Form: Prediction JSON
    end
    Form-->>User: Probability, favorite, and optional spread comparison
```
