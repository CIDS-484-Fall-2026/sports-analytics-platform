import joblib

from analytics.nfl_data_loader import (
    load_nfl_games,
    home_team_win,
    add_team_win_pct,
    add_home_indicator,
    add_rolling_point_diff,
)


# Load trained model
model = joblib.load("analytics/nfl_model.pkl")

# Prepare data 
df = load_nfl_games()
df = home_team_win(df)
df = add_team_win_pct(df)
df = add_home_indicator(df)
df = add_rolling_point_diff(df)

# Drop rows missing model features
df = df.dropna(subset=[
    'home_win_pct',
    'away_win_pct',
    'home_point_diff_last3',
    'away_point_diff_last3'
])


def get_team_features(team_name, df):
    team_rows = df[df['home_team'] == team_name]

    if team_rows.empty:
        return None

    latest = team_rows.iloc[-1]

    return {
        "win_pct": latest['home_win_pct'],
        "point_diff_last3": latest['home_point_diff_last3'],
    }


def predict_nfl_game(team1, team2):
    import warnings
    warnings.filterwarnings("ignore", category=UserWarning)

    home = get_team_features(team1, df)
    away = get_team_features(team2, df)

    if home is None or away is None:
        return {
            "error": "One or both teams not found in dataset",
            "team1": team1,
            "team2": team2,
        }

    score_diff = 0

    features = [
        score_diff,
        home["win_pct"],
        away["win_pct"],
        1,
        home["point_diff_last3"],
        away["point_diff_last3"],
    ]

    prob = model.predict_proba([features])[0][1]

    return {
        "team1": team1,
        "team2": team2,
        "probability": float(prob),
    }



