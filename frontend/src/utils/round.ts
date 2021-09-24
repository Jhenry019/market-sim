export default (value: number, decimalPlaces=2) => {
  return Number(value.toFixed(decimalPlaces));
}