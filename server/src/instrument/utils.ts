import { PositionParams } from "../portfolio";
import { round } from '../utils';


export interface PriceUpdateData {
  /** The identifier for the instrument. */
  symbol: string;
  /** The current price of the instrument. */
  current: number;
  /** The difference between the current price
   * and the last price in dollar terms.
  */
  change: number;
  /** The difference between the current price
   * and the last price as a percentage.
  */
  changePct: number;
};

export interface OrderData {
  /** The amount of cash currently 
   * held in the portfolio. 
   * */
  cash: number;
  /** The total value of all the
   * positions in the portfolio.
   */
  equity: number;
  /** The positions held in the portfolio. */
  positions: Array<PositionParams>
  /** The number of shares involved 
   * in the transaction.
   */
  nShares: number;
  /** The price of the instrument at the
   * time the order is placed.
  */
  avgPrice: number;
  /** The identifier for the instrument. */
  symbol: string;
};

type PriceChangeObj = {change: number, changePct: number};
export function priceChange(
  prevPrice: number, 
  newPrice: number
): PriceChangeObj 
{
  /**
   * Calculate the change in price for an instrument
   * in dollar terms and as a percentage.
   * @param prevPrice // The last quoted price
   * @param newPrice // The current price 
   */
  const change = round(newPrice - prevPrice);
  return {
    change,
    changePct: round((change / prevPrice) * 100)
  }
}