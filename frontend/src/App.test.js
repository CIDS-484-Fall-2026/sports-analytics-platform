import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ games: [] }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Check that the dashboard and both team selectors appear on the page.
test('renders the NFL prediction dashboard and team selectors', async () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /NFL Prediction Dashboard/i })
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Team 1')).toBeInTheDocument();
  expect(screen.getByLabelText('Team 2')).toBeInTheDocument();
  expect(await screen.findByText('No NFL games are scheduled this week.')).toBeInTheDocument();
});
