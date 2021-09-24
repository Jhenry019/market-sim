interface PriceDirectionObj {
  flat: boolean;
  up: boolean;
  down: boolean
}

export default (change: number): PriceDirectionObj => {
  /** 
   * Used to determine the direction of
   * a price or equity position.
  */
  return {
    flat: change === 0,
    up: change > 0,
    down: change < 0
  }
}