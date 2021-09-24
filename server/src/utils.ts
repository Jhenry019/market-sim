import io from 'socket.io';
import { Event } from "./socket-vars";


export const round = (value: number) => {
  return Number(value.toFixed(2));
}

export const replacePrivateKey = (key: string, value: any) => {
  /** Prevent private properties from being exposed
   * when using JSON.stringify on a class.
  */
  if (key === "socket") return undefined;
  if (key === "model") return undefined;
  return value;
}

export const handleInvalidShareCount = (socket: io.Socket) => {
  /**
   * Send an order update with an error message 
   * in case the server receives an invalid number 
   * of shares in an order.
  */
  socket.emit(
    Event.ORDER_UPDATE, 
    {
      message: {
        Type: 'error', 
        body: 'Please enter a valid amount of shares'
      },
      portfolio: {}
    }
  );
}

export const generateMessage = (
  symbol: string, 
  orderType: Event.BUY_ORDER | Event.SELL_ORDER, 
  nShares: number
): string => {
  /**
   * Generate a message based on a submitted order.
  */
  const shares = nShares === 1 
    ? `${nShares} share` 
    : `${nShares} shares`;

  const action = orderType === Event.BUY_ORDER 
    ? 'purchased' 
    : 'sold';

  return `Successfully ${action} ${shares} of ${symbol}`;
}