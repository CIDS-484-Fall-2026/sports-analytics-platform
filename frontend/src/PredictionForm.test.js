import { fireEvent, render, screen } from "@testing-library/react";
import PredictionForm from "./PredictionForm";
import { TEAMS } from "./teams";

afterEach(() => {
  jest.restoreAllMocks();
});

test("provides all 32 NFL teams with logo mappings", () => {
  render(<PredictionForm />);

  expect(TEAMS).toHaveLength(32);
  expect(TEAMS.every((team) => team.logo)).toBe(true);
  expect(screen.getAllByRole("option", { name: /.+/ })).toHaveLength(66);
});

test("shows the selected teams' logos and full labels in the prediction", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    json: async () => ({
      team1: "LA",
      team2: "ARI",
      probability: 0.6,
    }),
  });

  render(<PredictionForm />);
  fireEvent.change(screen.getByLabelText("Team 1"), {
    target: { value: "LA" },
  });
  fireEvent.change(screen.getByLabelText("Team 2"), {
    target: { value: "ARI" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Predict" }));

  expect(
    await screen.findByRole("img", { name: "Los Angeles Rams logo" })
  ).toHaveAttribute(
    "src",
    "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png"
  );
  expect(
    screen.getByRole("img", { name: "Arizona Cardinals logo" })
  ).toHaveAttribute(
    "src",
    "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png"
  );
  expect(
    screen.getByText("Los Angeles Rams", {
      selector: ".prediction-result__team",
    })
  ).toBeInTheDocument();
  expect(
    screen.getByText("Arizona Cardinals", {
      selector: ".prediction-result__team",
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", {
      name: "Los Angeles Rams win probability",
    })
  ).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
