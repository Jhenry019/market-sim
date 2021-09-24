import JumpDiffusionModel from ".";


it('generates a non-negative price given a start price', () => {
  const model = new JumpDiffusionModel;
  const startPrice = 100;

  const nextPrice = model.nextPrice(startPrice);
  expect(nextPrice).toBeGreaterThan(-1);
});