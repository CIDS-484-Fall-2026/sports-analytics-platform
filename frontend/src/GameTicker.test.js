import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import GameTicker from "./GameTicker";

const response = (games, ok = true) => ({
  ok,
  status: ok ? 200 : 503,
  json: async () => ({ games }),
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders all current-week games from the schedule response", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue(
    response([
      { away: "CAR", home: "GB", date: "Thu, Oct 29", time: "8:15 PM ET" },
      { away: "BAL", home: "BUF", date: "Sun, Nov 1", time: "1:00 PM ET" },
    ])
  );

  render(<GameTicker />);

  expect((await screen.findAllByText("CAR @ GB")).length).toBe(2);
  expect(screen.getAllByText("BAL @ BUF")).toHaveLength(2);
  expect(screen.getByRole("region", { name: "Current week NFL games" })).toHaveAttribute(
    "aria-busy",
    "false"
  );
});

test("announces loading and empty schedule states", async () => {
  let resolveResponse;
  jest.spyOn(global, "fetch").mockReturnValue(
    new Promise((resolve) => {
      resolveResponse = resolve;
    })
  );

  render(<GameTicker />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading this week's NFL schedule");

  await act(async () => {
    resolveResponse(response([]));
  });
  expect(screen.getByRole("status")).toHaveTextContent("No NFL games are scheduled this week.");
});

test("shows a retryable error when the schedule cannot be loaded", async () => {
  jest.spyOn(global, "fetch")
    .mockResolvedValueOnce(response([], false))
    .mockResolvedValueOnce(response([{ away: "CAR", home: "GB", date: "Thu, Oct 29", time: "8:15 PM ET" }]));

  render(<GameTicker />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Could not load this week's NFL schedule."
  );

  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  await waitFor(() => expect(screen.getAllByText("CAR @ GB")).toHaveLength(1));
});
