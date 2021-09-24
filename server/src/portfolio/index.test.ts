import Portfolio from ".";


it("adds a new position to a portfolio", () => {
  const positions = Portfolio.addPosition('ABC', 14.57, 4, []);

  expect(positions.length).toBe(1);
  expect(positions[0].symbol).toBe('ABC');
  expect(positions[0].avgPrice).toBe(14.57);
  expect(positions[0].nShares).toBe(4);
});

it('dollar cost averages a position', () => {
  const positions = [{
    symbol: 'ABC',
    avgPrice: 14.57,
    nShares: 4
  }];
  const newPositions = Portfolio.addPosition('ABC', 11.01, 2, positions);
  expect(newPositions[0].nShares).toBe(6);
  expect(newPositions[0].avgPrice).toBe(13.38);
});

it("reduces an existing position", () => {
  const positions = [{
    symbol: 'ABC',
    avgPrice: 14.57,
    nShares: 4
  }];

  const newPositions = Portfolio.reducePosition(
    positions[0], 
    positions, 
    2
  );
  expect(newPositions[0].nShares).toBe(2);
});

it('exits a position', () => {
  const positions = [{
    symbol: 'ABC',
    avgPrice: 14.57,
    nShares: 4
  }];

  const newPositions = Portfolio.reducePosition(
    positions[0], 
    positions, 
    4
  );
  expect(newPositions.length).toBe(0);
});