import round from "../../utils/round"


export const calculateReturn = (startAmt: number, currentAmt: number) => {
  return round((currentAmt / startAmt - 1) * 100);
}