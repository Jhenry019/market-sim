import { round } from '../utils';


export interface PositionParams {
  symbol: string;
  avgPrice: number;
  nShares: number;
};

export class Position {
  /**
   * Models an equity position in a portfolio
   */
  symbol: string;
  avgPrice: number;
  nShares: number;

  constructor({symbol, avgPrice, nShares}: PositionParams) 
  {
    this.symbol     = symbol;
    this.avgPrice   = avgPrice;
    this.nShares    = nShares;
  }
};


export default class Portfolio {
  /** 
   * A collection of static methods used
   * to model a portfolio of equity positions.
  */
  private static _dollarCostAverage(
    oldPrice: number,
    oldShareCount: number,
    newPrice: number,
    newShareCount: number
  ): number 
  {
    /**
     * This method computes a share-weighted average buy price
     * for a position.
     * 
     * @param oldPrice // The last buy price 
     * @param oldShareCount // The number of shares previously held
     * @param newPrice // The most recent buy price
     * @param newShareCount // The number of shares being added to the position
     */
    const totalShares = oldShareCount + newShareCount;
    const oldEquity = oldPrice * oldShareCount;
    const newEquity = newPrice * newShareCount;

    return round((oldEquity + newEquity) / totalShares);
  }

  static addPosition(
    symbol: string, 
    avgPrice: number, 
    nShares: number, 
    positions: Array<PositionParams>
  ): Array<PositionParams>
  {
    /**
     * Add a position to the portfolio if it doesn't already exist,
     * or add to an exisiting position by dollar cost averaging. 
     * 
     * @returns an array of updated positions.
     * 
     * @param symbol // The symbol identifying the instrument being bought
     * @param avgPrice // The price at which the instrument was bought
     * @param nShares // The number of shares being purchased
     * @param positions // The current positions being held
     */
    const position = new Position({symbol, avgPrice, nShares});
    const existingPositions = positions.filter(pos => pos.symbol === symbol);

    if (existingPositions.length === 0) {
      positions.push(position);
    } else {
        const exisitingPosition = existingPositions[0];
        const oldPrice = exisitingPosition.avgPrice;
        const oldShareCount = exisitingPosition.nShares;
        
        exisitingPosition.avgPrice = this._dollarCostAverage(
          oldPrice, 
          oldShareCount,
          avgPrice,  
          nShares
        );
        exisitingPosition.nShares = oldShareCount + nShares;
    }
    return positions;
  }

  static reducePosition(
    position: PositionParams, 
    positions: Array<PositionParams>, 
    nShares: number
  ): Array<PositionParams>
  {
    /**
     * Reduce the number of shares in a given position.
     * 
     * @param position // An object representing the target position
     * @param positions // An array of the current positions
     * @param nShares // The number of shares being sold
     */
    if (nShares === position.nShares) {
      // exit the position entirely if all shares are being sold
      positions = positions.filter(pos => pos !== position);
    } else {
        position.nShares -= nShares;
    }
    return positions;
  }
};