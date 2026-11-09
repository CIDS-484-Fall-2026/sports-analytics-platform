import unittest

import pandas as pd

from analytics.nfl_data_loader import add_rolling_point_diff


class RollingPointDiffTests(unittest.TestCase):
    def test_away_rolling_features_follow_game_chronology(self):
        games = pd.DataFrame(
            [
                ["2023-09-10", "2023_01_DAL_X", 1, "DAL", "X", 10, 0],
                ["2023-09-17", "2023_02_ARI_X", 2, "ARI", "X", 20, 0],
                ["2023-09-24", "2023_03_BUF_X", 3, "BUF", "X", 30, 0],
                ["2023-10-01", "2023_04_ATL_X", 4, "ATL", "X", 40, 0],
            ],
            columns=[
                "gameday",
                "game_id",
                "week",
                "home_team",
                "away_team",
                "home_score",
                "away_score",
            ],
        )

        result = add_rolling_point_diff(games).set_index("week")

        self.assertAlmostEqual(result.loc[3, "away_point_diff_last3"], 20)
        self.assertAlmostEqual(result.loc[4, "away_point_diff_last3"], 30)


if __name__ == "__main__":
    unittest.main()
