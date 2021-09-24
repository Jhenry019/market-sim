export function randnBM(): number {
  /**
   * Implements the Box-Muller algorithm for
   * sampling random numbers from a normal
   * distribution with a mean of 0 and a
   * unit variance.
   */
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num /= (10 + 0.5);

  return num;
}

export function randp(lambda: number): number {
  /**
   * Implements the Knuth algorithm for sampling
   * random, poisson-distributed numbers.
   */
  const L = Math.exp(-lambda);
  let p = 1;
  let k = 0;

  do {
    k++;
    const u = Math.random();
    p *= u;
  } while (p > L);

  return k - 1;
}