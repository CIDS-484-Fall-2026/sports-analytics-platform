import unittest
from datetime import date

import pandas as pd

from backend.schedule import get_current_week_schedule


class CurrentWeekScheduleTests(unittest.TestCase):
    def setUp(self):
        self.games = pd.DataFrame(
            [
                ["2026-10-26", "REG", 7, "20:15", "DAL", "PHI"],
                ["2026-10-29", "REG", 8, "20:15", "CAR", "GB"],
                ["2026-11-01", "REG", 8, "13:00", "BAL", "BUF"],
                ["2026-11-05", "REG", 9, "20:15", "JAX", "BAL"],
            ],
            columns=[
                "gameday",
                "game_type",
                "week",
                "gametime",
                "away_team",
                "home_team",
            ],
        )

    def test_selects_all_games_in_upcoming_week(self):
        calls = []

        def load(season):
            calls.append(season)
            return self.games

        result = get_current_week_schedule(date(2026, 10, 28), load)

        self.assertEqual(calls, [2026])
        self.assertEqual(result["week"], 8)
        self.assertEqual(len(result["games"]), 2)
        self.assertEqual(result["games"][0]["away"], "CAR")
        self.assertEqual(result["games"][0]["date"], "Thu, Oct 29")
        self.assertEqual(result["games"][0]["time"], "8:15 PM")

    def test_uses_prior_calendar_year_for_january_schedule(self):
        calls = []
        get_current_week_schedule(date(2027, 1, 3), lambda season: calls.append(season) or self.games)
        self.assertEqual(calls, [2026])

    def test_returns_empty_schedule_when_season_has_no_future_games(self):
        result = get_current_week_schedule(
            date(2027, 2, 1),
            lambda season: self.games,
        )
        self.assertEqual(result["games"], [])
        self.assertIsNone(result["week"])


if __name__ == "__main__":
    unittest.main()
