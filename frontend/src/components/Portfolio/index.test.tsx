import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { SelectedContext } from '../../context/selected';
import Portfolio from '.';


const positions = [
  {symbol: "ABC", nShares: 3, avgPrice: 11.03, dataTestId: "abc"},
  {symbol: "VOL", nShares: 2, avgPrice: 75.01, dataTestId: "vol"},
];

const context = {
  symbol: 'ABC',
  nShares: 0,
  setSelected: jest.fn()
};

it('renders a portfolio with 2 positions', () => {
  render(
    <Portfolio 
      cash={1000} 
      equity={0} 
      positions={positions}
      dataTestId="portfolio"
    />
  );
  expect(screen.getByTestId("portfolio")).toMatchSnapshot();
});

it("changes the selected instrument", () => {
  /**
   * Clicking on one of the portfolio positions
   * should change the selected instrument. 
   */
  render(
    <SelectedContext.Provider value={context}>
      <Portfolio 
        cash={1000} 
        equity={0} 
        positions={positions}
        dataTestId="portfolio"
      />
    </SelectedContext.Provider>
  );
  
  fireEvent.click(screen.getByTestId("vol"));
  expect(context.setSelected).toBeCalledWith({
    ...context,
    symbol: "VOL",
    nShares: 2
  });
});