import React, { useContext } from 'react';
import classNames from '../../utils/classNames';
import { SelectedContext } from '../../context/selected';
import styles from './index.module.scss';


interface SharesInputProps {
  /** A selector used in testing environments */
  dataTestId?: string;
}

export default function SharesInput({
  dataTestId
}: SharesInputProps): JSX.Element 
{
  const {
    setSelected, 
    nShares, 
    symbol
  } = useContext(SelectedContext);

  const incrementShareCount = () => {
    setSelected({
      symbol, 
      setSelected, 
      nShares: nShares + 1
    });
  }

  const decrementShareCount = () => {
    if (nShares > 0) {
      setSelected({
        symbol, 
        setSelected, 
        nShares: nShares - 1
      });
    }
  }

  const changeShareCount = (e: React.ChangeEvent) => {
    const target = e.currentTarget as HTMLInputElement;
    const shareCount = target.value;
    setSelected({
      symbol, 
      setSelected, 
      nShares: parseInt(shareCount)
    });
  }

  return (
    <div className="input-group">
      <input 
        data-testid={dataTestId}
        type="number" 
        className={styles.sharesInput} 
        onChange={changeShareCount}
        min="0" 
        placeholder="Shares"
        value={nShares || ""}
      />
      <div className="input-group-append">
        <button 
          id="addShares"
          className={classNames('btn', styles.btnDefault)}
          onClick={incrementShareCount}
        >
          <i className="fa fa-plus"></i>
        </button>
        <button 
          id="minusShares"
          className={classNames('btn', styles.btnDefault)}
          onClick={decrementShareCount}
        >
          <i className="fa fa-minus"></i>
        </button>
      </div>
    </div>
  );
}