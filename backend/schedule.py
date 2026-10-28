"""Current NFL schedule retrieval backed by the project's nfl_data_py source."""

from datetime import date, datetime
from time import monotonic

import nfl_data_py as nfl_data


_SCHEDULE_CACHE_SECONDS = 6 * 60 * 60
_schedule_cache = {}


def load_season_schedule(season):
    """Load one season from nflverse, refreshing the worker cache every six hours."""
    cached = _schedule_cache.get(season)
    if cached and monotonic() - cached[0] < _SCHEDULE_CACHE_SECONDS:
        return cached[1]

    schedule = nfl_data.import_schedules([season])
    _schedule_cache[season] = (monotonic(), schedule)
    return schedule


def _as_date(value):
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    return date.fromisoformat(str(value)[:10])


def get_current_week_schedule(today=None, schedule_loader=None):
    """Return all games in the first schedule week that has not yet finished."""
    today = today or date.today()
    # NFL seasons cross calendar years; January and February belong to the
    # season that began the previous year.
    season = today.year - 1 if today.month <= 2 else today.year
    schedule_loader = schedule_loader or load_season_schedule
    schedules = schedule_loader(season)

    games = schedules[
        schedules["game_type"].notna()
        & schedules["gameday"].notna()
        & schedules["week"].notna()
    ].copy()
    if games.empty:
        return {"season": season, "week": None, "games": []}

    games["_game_date"] = games["gameday"].map(_as_date)
    remaining = games[games["_game_date"] >= today]
    if remaining.empty:
        return {"season": season, "week": None, "games": []}

    # Select the upcoming week's earliest game, then return the whole week
    # (including earlier games in that week if the user visits mid-week).
    first_game = remaining.sort_values("_game_date").iloc[0]
    week = int(first_game["week"])
    game_type = first_game["game_type"]
    week_games = games[
        (games["week"] == first_game["week"])
        & (games["game_type"] == game_type)
    ].sort_values(["_game_date", "gametime"], na_position="last")

    result = []
    for _, game in week_games.iterrows():
        raw_kickoff = game.get("gametime")
        try:
            if not isinstance(raw_kickoff, str):
                raise ValueError("kickoff time is missing")
            kickoff = raw_kickoff
            kickoff = datetime.strptime(kickoff, "%H:%M").strftime("%I:%M %p").lstrip("0")
        except ValueError:
            kickoff = "Time TBA"
        game_date = game["_game_date"]
        result.append(
            {
                "away": str(game["away_team"]),
                "home": str(game["home_team"]),
                "date": f"{game_date.strftime('%a, %b')} {game_date.day}",
                "time": kickoff,
            }
        )

    return {"season": season, "week": week, "games": result}
