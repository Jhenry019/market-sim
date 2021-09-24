import React from 'react';
import { screen, render } from '@testing-library/react';
import Position from ".";


it('renders a Position component', () => {
  render(
    <Position 
      symbol="ABC" 
      nShares={3} 
      avgPrice={11.03}
      dataTestId="abc" 
    />
  );
  
  expect(screen.getByText(/shares @/i).textContent)
    .toBe('3 shares @ $11.03/share');
});
