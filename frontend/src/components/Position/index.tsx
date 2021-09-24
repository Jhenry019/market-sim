import React, { useContext, useEffect } from 'react';
import usePrice from '../../hooks/usePrice';
import classNames from '../../utils/classNames';
import round from '../../utils/round';
import priceDirection from '../../utils/priceDirection';
import { SelectedContext } from '../../context/selected';
import { PortfolioContext } from '../../context/portfolio';
import styles from './index.module.scss';


export interface PositionProps {
  /** The symbol identifying the instrument */ 
  symbol: string;
  /** The number of shares held */ 
  nShares: number;
  /** The average price at which the stock was bought */
  avgPrice: number;
  /** The selector used in testing environments */
  dataTestId?: string;
};

export default function Position({
  symbol,
  nShares,
  avgPrice,
  dataTestId
}: PositionProps): JSX.Element 
{
  const selected = useContext(SelectedContext);
  const portfolio = useContext(PortfolioContext);
  const {price} = usePrice(symbol);
  const marketValue = round(price.current * nShares); 
  const DIRECTION = priceDirection(price.current - avgPrice);

  useEffect(() => {
    /**
     * Update the portfolio's equity value when the price
     * of the instrument changes.
     */
    const changeInEquity = round(price.change * nShares);
    portfolio.updatePortfolio({
      ...portfolio,
      equity: portfolio.equity + changeInEquity
    });
  }, [price]);

  const handleOnClick = () => {
    selected.setSelected({...selected, symbol, nShares});
  }

  return (
    <li 
      className={styles.instrument} 
      onClick={handleOnClick}
      data-testid={dataTestId}
    >
      <div className="ml-3">
        <span className="row">{symbol}</span>
        <span className="row">
          {nShares} shares @ ${avgPrice}/share
        </span>
      </div>
      <span 
        className={classNames(
          styles.pill, 
          DIRECTION.flat && styles.flat,
          DIRECTION.up  && styles.up,
          DIRECTION.down && styles.down
        )}
      >
        {marketValue}
      </span>
    </li>
  );
}