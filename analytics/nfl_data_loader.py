import nfl_data_py as nfl_data
import pandas as pd


def load_nfl_games():
    # Load NFL game data
    games = nfl_data.import_schedules([2023])
    return games


def home_team_win(df):
    # Add a home_win column to DataFrame
    df['home_win'] = (df['home_score'] > df['away_score']).astype(int)
    return df


def add_team_win_pct(df):
    # Count wins per team
    team_wins = df.groupby('home_team')['home_win'].sum()

    # Count total games per team
    team_games = df['home_team'].value_counts()

    # Compute win percentage
    win_pct = team_wins / team_games

    # Create new columns for home and away win percentages
    df['home_win_pct'] = df['home_team'].map(win_pct)
    df['away_win_pct'] = df['away_team'].map(win_pct)

    return df

 
def add_home_indicator(df):
    df['is_home'] = 1
    return df


def add_rolling_point_diff(df):
    # Compute point differential for each game
    df['point_diff'] = df['home_score'] - df['away_score']

    # Keep both home- and away-team rolling features in game order.
    df = df.sort_values(['gameday', 'game_id'])

    # Rolling average for home team
    df['home_point_diff_last3'] = (
        df.groupby('home_team')['point_diff']
        .rolling(3)
        .mean()
        .reset_index(level=0, drop=True)
    )

    # Rolling average for away team
    df['away_point_diff_last3'] = (
        df.groupby('away_team')['point_diff']
        .rolling(3)
        .mean()
        .reset_index(level=0, drop=True)
    )

    return df
