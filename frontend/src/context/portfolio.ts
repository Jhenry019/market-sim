import React from 'react';
import { PortfolioProps } from '../components/Portfolio';


export const PortfolioContext = React.createContext({
  cash: undefined,
  equity: undefined,
  positions: [],
  updatePortfolio: (_: PortfolioProps) => {}
});