import React, { useEffect } from 'react';
import classNames from '../../utils/classNames';
import direction from '../../utils/priceDirection';
import { calculateReturn } from './utils';
import round from '../../utils/round';
import Position, { PositionProps } from '../Position';
import styles from './index.module.scss';


export interface PortfolioProps {
  /** The amount of cash held in the portfolio */ 
  cash?: number;
  /** The total amount of equity held in the portfolio */ 
  equity?: number;
  /** The equity positions held in the portfolio */
  positions?: Array<PositionProps>;
  /** A selector used in testing environments */
  dataTestId?: string;
};

export const STARTING_CASH_AMT = 1000; 
export default function Portfolio({
  cash,
  equity,
  positions = [],
  dataTestId
}: PortfolioProps): JSX.Element 
{
  const portfolioValue = cash + equity;
  const ROI = calculateReturn(STARTING_CASH_AMT, portfolioValue);
  const DIRECTION = direction(ROI);
  const hasPositions = positions.length !== 0;

  const positionsMarkup = hasPositions && (
    <div className="pt-5">
      <h4 className="text-left">Positions</h4> 
      <ul className="list-group">
        {
          positions.map((pos: PositionProps) => (
            <Position key={pos.symbol} {...pos} />
          ))
        }
      </ul>
    </div>
  );

  const portfolioReturnMarkup = (): string => {
    if (hasPositions || ROI !== 0) return `${ROI}%`;
    return '';
  };

  const portfolioMarkup = cash !== undefined && (
    <div className={styles.portfolioInfo}>
      <h1 className="heading display-5 pb-4">
        {round(portfolioValue)}
        <span 
          className={classNames(
            styles.return,
            DIRECTION.flat && styles.flat,
            DIRECTION.up && styles.up,
            DIRECTION.down && styles.down
          )}
        >
          {portfolioReturnMarkup()}
        </span>
      </h1>
      <span>Cash: </span>
      <span>${cash}</span>
      <br />
      <span>Equity: </span>
      <span>${round(equity)}</span>
    </div>
  );

  useEffect(() => {
    // cache the portfolio data on update
    if (hasPositions || cash !== STARTING_CASH_AMT) {
      sessionStorage.setItem(
        'portfolio', 
        JSON.stringify({
          cash,
          equity, 
          positions
        })
      );
    }
  }, [portfolioValue, positions]);

  return (
    <div className="col-md-4 mx-auto" data-testid={dataTestId}>
      <div className="card card-body text-center mt-5">
        <h4 className="heading display-5 pb-4">
          My Portfolio
        </h4>
        {portfolioMarkup}
        {positionsMarkup}
      </div>
    </div>
  );
}