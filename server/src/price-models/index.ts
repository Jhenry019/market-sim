import { randnBM, randp } from './utils';


export default class JumpDiffusionModel {
  /**
   * This class implements the Merton jump diffusion model
   * used for pricing stock options. The jump diffusion 
   * model comes from Robert C. Merton's 1975 paper,
   * Option Pricing When Underlying Stock Returns Are Discontinuous.
   * @see https://dspace.mit.edu/handle/1721.1/1899
   */
  private readonly r: number; // risk-free rate of return
  private readonly m: number; // mean jump size
  private readonly v: number; // standard deviation of jump
  private readonly lam: number; // jump intensity 
  private readonly sigma: number; // annual standard deviation
  private readonly dt: number; // time step

  constructor() {
    this.r = 0.05;
    this.m = 0;
    this.v = 0.3;
    this.lam = 1;
    this.sigma = 0.2;
    this.dt = 1 / 1000
  }

  nextPrice(S: number): number {
    /**
     * Generate a new price for an instrument given
     * its current price using the Merton Jump-Diffusion 
     * stochastic differential equation:
     * 
     * dS(t)
     * ----  = (r - sigma^2/2 - lambda*k)*dt + sigma*dW(t) + dJ
     * S(t) 
     * 
     * with:
     * S: the current price of the instrument,
     * k: The expected change in the price if a jump occurs
     * dW: a Weiner process used to simulate trading noise
     * dJ: an independent Poisson process
     * 
     * The differential equation can be broken down into
     * four main components:
     * 
     * 1) drift (r - sigma^2/2): This is the expected long-term
     *    return of an instrument.
     * 2) jump (lambda*k): determines how much a price should
     *    change (jump) in response to a market event.
     * 3) noise (sigma*dW(t)): This makes price movements random.
     * 
     * The first three components form the geometric process
     * in which price movements are not subject to periodic
     * jumps.
     * 
     * 4) dJ: Simulates price jumps resulting from market
     *    events such as earnings reports and acquisitions.
     * 
     * The fourth component is called the Poisson process.
     * 
     * @param S // The current price of an instrument
     * @returns a new simulated price.
     * 
     */
    const drift = (this.r - Math.pow(this.sigma, 2) / 2);
    const jump = this.lam * (this.m + Math.pow(this.v, 2) / 2);
    const noise = this.sigma * Math.sqrt(this.dt) * randnBM();

    const geometricProcess = (drift - jump) * this.dt + noise;
    const poissonProcess = randp(this.lam * this.dt) * randnBM();

    return S * Math.exp(geometricProcess + poissonProcess);
  }
};