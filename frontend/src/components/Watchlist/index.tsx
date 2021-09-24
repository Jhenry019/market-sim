import React, { useContext } from 'react';
import Instrument, { InstrumentProps } from '../Instrument';
import { SelectedContext } from '../../context/selected';
import styles from './index.module.scss';


interface WatchlistProps {
  /** A list of instruments */ 
  list: Array<InstrumentProps>
  /** A selector used for testing purposes */
  dataTestId?: string;
}

export default function Watchlist({
  list,
  dataTestId
}: WatchlistProps): JSX.Element 
{
  const selected = useContext(SelectedContext);
  const instruments = list.map(instrument => (
		<Instrument 
			key={instrument.symbol} 
			symbol={instrument.symbol} 
			isSelected={instrument.symbol === selected.symbol}
      dataTestId={instrument.dataTestId}
		/>
	));

  return (
    <div className="col-md-4 mx-auto">
      <div 
        className={styles.watchlist} 
        data-testid={dataTestId}
      >
        <h4 className="text-center pt-3 pb-5">
          Watchlist
        </h4>
        <ul className="list-group px-3 pb-3">
          {instruments}
        </ul>
      </div>
    </div>
  );
}