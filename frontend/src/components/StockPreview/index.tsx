import React, { useState, useEffect } from 'react';
import usePrice from '../../hooks/usePrice';
import SharesInput from './SharesInput';
import Header from './Header';
import BuySellButtons from './BuySellButtons';
import styles from './index.module.scss';


interface StockPreviewProps {
  // The symbol identifying the selected instrument
  symbol: string;
}

export default function StockPreview({
  symbol
}: StockPreviewProps): JSX.Element 
{
  const {price} = usePrice(symbol);
  const [preview, setPreview] = useState({
    prevSymbol: symbol,
    prevPrice: price.current,
    priceIsAccurate: true
  });

  useEffect(() => {
    /** 
     * When the symbol is changed, the
     * price should reflect that of the new 
     * symbol instead of the previous symbol. 
     * If not, the displayed price is inaccurate 
     * and a loader will be shown instead of 
     * the selected instrument. 
     * 
     * This prevents users from buying an 
     * instrument at an incorrect price and 
     * making a risk-free profit.
    */
    const previewObj = {
      ...preview, 
      prevSymbol: symbol, 
      prevPrice: price.current
    };
    
    if (symbol !== preview.prevSymbol &&
        price.current === preview.prevPrice) {
        setPreview({...previewObj, priceIsAccurate: false});
    } else {
        setPreview({...previewObj, priceIsAccurate: true})
    }
  }, [symbol, price]);

  const loaderMarkup = (
    <i 
      className="fas fa-spinner fa-spin" 
      style={{
        fontSize: '3em', 
        padding: '20px 10px',
        width: '100%', 
        textAlign: 'center'
      }} 
    />
  );

  const previewContentMarkup = (
    <> 
      <Header 
        symbol={symbol} 
        price={price.current} 
        priceChange={price.change} 
      />
      <div className={styles.footer}>
        <SharesInput />
        <BuySellButtons symbol={symbol} />
      </div>
    </>
  );

  return (
    <div className="col-md-4 mx-auto mb-2">
      <div className="card card-body text-center mt-5">
        {preview.priceIsAccurate 
          ? previewContentMarkup 
          : loaderMarkup
        }
      </div>
    </div>
  );
}