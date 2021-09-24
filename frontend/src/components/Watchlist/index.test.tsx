import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InstrumentProps } from '../Instrument';
import { SelectedContext } from '../../context/selected';
import Watchlist from '.';


const instruments: Array<InstrumentProps> = [
  {symbol: 'ABC', isSelected: true, dataTestId: "abc"},
  {symbol: 'XYZ', isSelected: false, dataTestId: "xyz"}
];

const context = {
  symbol: 'ABC',
  nShares: 0,
  setSelected: jest.fn()
};

it("renders a watchlist containing two instruments", () => {
  render(
    <SelectedContext.Provider value={context}>
      <Watchlist 
        list={instruments} 
        dataTestId="watchlist"
      />
    </SelectedContext.Provider>
  );

  expect(screen.getByTestId('abc').classList)
    .toContain('selected');
    
  expect(screen.getByTestId('watchlist'))
    .toMatchSnapshot();
});

it("changes the selected instrument", () => {
  /**
   * When an instrument is clicked, it should
   * call the setSelected function (mocked)
   * which changes the selected instrument.
   */
  render(
    <SelectedContext.Provider value={context}>
      <Watchlist 
        list={instruments} 
        dataTestId="watchlist"
      />
    </SelectedContext.Provider>
  );

  fireEvent.click(screen.getByTestId("xyz"));

  expect(context.setSelected)
    .toBeCalledWith({...context, symbol: "XYZ"});
});