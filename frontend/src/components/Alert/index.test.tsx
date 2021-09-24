import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Alert from '.';


beforeEach(() => {
  /** The Alert component uses 'setTimeout'
   *  in its useEffect hook. This ensures
   *  that 'setTimeout' gets mocked by
   *  jest.
   */
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

it('renders an Alert with a message', () => {
  render(
    <Alert Type="success" dataTestId="alert">
      Successfully purchased 2 shares of ABC
    </Alert>
  );

  const alert: HTMLElement = screen.getByTestId("alert")
  expect(alert.textContent)
    .toBe("Successfully purchased 2 shares of ABC");

  expect(alert.classList).toContain('success');
  expect(alert.classList).toContain('visible');
  expect(alert).toMatchSnapshot();
});

it('renders an Alert which hides itself after 3 seconds', () => {
  act(() => {
    render(
      <Alert Type="success" dataTestId="alert">
        Successfully sold 1 share of ABC
      </Alert>
    );
    // Allow the timer inside the Alert component to run
    jest.runAllTimers();
  });

  expect(screen.getByTestId("alert").classList)
    .not.toContain('visible')
});

it('renders an Alert with an error className', () => {
  render(
    <Alert Type="error" dataTestId="alert">
      Not enough shares of ABC
    </Alert>
  );
  
  expect(screen.getByTestId("alert").classList)
    .toContain('error');
});