import React from 'react';
import { render, screen } from '@testing-library/react';
import Instrument from '.';


it('renders an Instrument', () => {
  render(
    <Instrument 
      symbol="ABC" 
      isSelected={true} 
      dataTestId="abc" 
    />
  );

  const instrument: HTMLElement = screen.getByTestId("abc");
  expect(instrument.classList).toContain("instrument");
  expect(instrument.classList).toContain("selected");
  expect(instrument.textContent).toBe("ABC");
});