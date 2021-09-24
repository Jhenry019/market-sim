import React, { useContext } from 'react';
import classNames from '../../utils/classNames';
import { SelectedContext } from '../../context/selected';
import usePrice from '../../hooks/usePrice';
import styles from './index.module.scss';


interface BuySellButtonProps {
  // The symbol of the selected instrument
  symbol: string;
};

export default function BuySellButtons({
  symbol
}: BuySellButtonProps): JSX.Element 
{
  const {sendOrder} = usePrice(symbol);
  const {nShares} = useContext(SelectedContext);

  const submitBuyOrder = () => {
    sendOrder(nShares, 'buyOrder');
  }

  const submitSellOrder = () => {
    sendOrder(nShares, 'sellOrder');
  }

  return (
    <>
      <button 
        onClick={submitBuyOrder}
        className={classNames('btn', styles.btnSuccess)}
      >
        Buy
      </button>
      <button 
        onClick={submitSellOrder}
        className={classNames('btn', styles.btnDanger, 'ml-1')}
      >
        Sell
      </button>
    </>
  );
}