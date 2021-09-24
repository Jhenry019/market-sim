import React from 'react';
import { render, screen, fireEvent, RenderResult } from '@testing-library/react';
import { SelectedContext } from '../../context/selected';
import Header from './Header';
import SharesInput from './SharesInput';


interface TContext {
  symbol: string, 
  nShares: number, 
  setSelected: typeof jest.fn
};

function setUp({
  symbol = "ABC",
  nShares = 0,
  setSelected = jest.fn()
}: TContext): RenderResult {
  /** Set up the render result
   * for the SharesInput 
   * component.
   */
  return render(
    <SelectedContext.Provider 
      value={{
        symbol, 
        nShares, 
        setSelected
      }}
    >
      <SharesInput dataTestId="shares-input" />
    </SelectedContext.Provider>
  );
}

describe("Header", () => {
  it('renders a Header component', () => {
    const headerProps = {
      symbol: "ABC",
      price: 14.57,
      priceChange: 0.02
    };

    const {container} = render(
      <Header {...headerProps} />
    );
    expect(container.querySelector(".heading").textContent).toBe("ABC");
    expect(container.querySelector("#headerPrice").textContent)
      .toBe(`$${headerProps.price}`);
    expect(container.querySelector(".priceChange").textContent)
      .toBe(`${0.02}%`);

    // The price should have a green background to indicate that
    // the instrument's price has increased.
    expect(container.querySelector(".priceChange").classList)
      .toContain('up');
  });
});
  
describe("SharesInput", () => {
  it('increases the share count when the plus button is clicked', () => {
    const context = {
      symbol: 'ABC',
      nShares: 0,
      setSelected: jest.fn()
    };

    const {container} = setUp(context); // render the SharesInput component 
    const addSharesBtn: HTMLElement = container.querySelector('#addShares');

    fireEvent.click(addSharesBtn);
    expect(context.setSelected).toBeCalledWith({
      symbol: context.symbol,
      setSelected: context.setSelected,
      nShares: context.nShares + 1
    });
  });
  
  it('decreases the share count when the minus button is clicked', () => {
    const context = {
      symbol: 'ABC',
      nShares: 1,
      setSelected: jest.fn()
    };

    const {container} = setUp(context);
    const minusSharesBtn: HTMLElement = container.querySelector('#minusShares');

    fireEvent.click(minusSharesBtn);
    expect(context.setSelected).toBeCalledWith({
      symbol: context.symbol,
      setSelected: context.setSelected,
      nShares: 0
    });
  });

  it('changes the share count using an input element', () => {
    const context = {
      symbol: 'ABC',
      nShares: 0,
      setSelected: jest.fn()
    };

    setUp(context);

    const input = screen.getByTestId("shares-input") as HTMLInputElement;
    fireEvent.change(
      input,
      {target: {value: 2}}
    )
    expect(context.setSelected).toBeCalledWith({
      symbol: context.symbol,
      setSelected: context.setSelected,
      nShares: 2
    });
  });
});