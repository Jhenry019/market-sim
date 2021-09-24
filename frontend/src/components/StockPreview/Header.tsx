import React from 'react';
import classNames from '../../utils/classNames';
import direction from '../../utils/priceDirection';
import styles from './index.module.scss';


interface HeaderProps {
  // The symbol of the selected instrument
  symbol: string;
  // The price of the selected instrument
  price: number;
  // The change in price calculated as a percentage
  priceChange: number;
}

export default function Header({
  symbol,
  price,
  priceChange
}: HeaderProps): JSX.Element 
{
  const DIRECTION = direction(priceChange);

  return (
    <>
      <h4 className="heading display-5 pb-3">
        {symbol}
      </h4>
      <div>
        <h1 id="headerPrice">${price}</h1>
        <span 
          className={classNames(
            styles.priceChange,
            DIRECTION.flat && styles.flat,
            DIRECTION.up && styles.up,
            DIRECTION.down && styles.down
          )}
        >
          {priceChange}%
        </span>
      </div>
    </>
  );
}