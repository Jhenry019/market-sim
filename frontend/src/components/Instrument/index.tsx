import React, { useContext } from 'react';
import classNames from '../../utils/classNames';
import usePrice from '../../hooks/usePrice';
import direction from '../../utils/priceDirection';
import { SelectedContext } from '../../context/selected';
import styles from './index.module.scss';


export interface InstrumentProps {
  /** The ticker symbol identifying the instrument */
  symbol: string;
  /** Indicates whether the ticker is being previewed */
  isSelected: boolean;
  /** The selector used in testing environments */
  dataTestId?: string;
}

export default function Instrument({
  symbol,
  isSelected,
  dataTestId
}: InstrumentProps): JSX.Element 
{ 
  const {price} = usePrice(symbol); 
  const DIRECTION = direction(price.change);
  const selected = useContext(SelectedContext);

  const changeSelectedInstrument = () => {
    selected.setSelected({
      ...selected, 
      nShares: 0, 
      symbol
    });
  };

  const priceMarkup = price.current && (
    <span>${price.current}</span>
  );

  return (
    <li 
      className={classNames(
        styles.instrument,
        isSelected && styles.selected
      )} 
      onClick={changeSelectedInstrument}
      data-testid={dataTestId}
    >
      <span>{symbol}</span>
      <div>
        <span
          id={`${symbol}--price`} 
          className={classNames(
            styles.pill,
            DIRECTION.flat && styles.flat,
            DIRECTION.up && styles.up,
            DIRECTION.down && styles.down
          )}
        >
          {priceMarkup}
        </span>
      </div>
    </li>
  );
}