import React from 'react';


export const SelectedContext = React.createContext({
  symbol: '',
  nShares: 0,
  setSelected: (_: any) => {}
});