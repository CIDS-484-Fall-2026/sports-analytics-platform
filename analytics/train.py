from analytics.nfl_data_loader import (
    load_nfl_games,
    home_team_win,
    add_team_win_pct,
    add_home_indicator,
    add_rolling_point_diff,
)
from features import build_features
from model import train_model

print("TRAIN.PY IS RUNNING")

# Load data 
df = load_nfl_games()

# Label wins
df = home_team_win(df)

# Add features
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

print("Rows remaining:", df.shape)

# Build feature matrix
X, y = build_features(df)

# Train model
train_model(X, y)
