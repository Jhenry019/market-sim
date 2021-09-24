export enum Event {
  NEW_SESSION = "newSession",
  PRICE_UPDATE = "priceUpdate",
  ORDER_UPDATE = "orderUpdate",
  BUY_ORDER = "buyOrder",
  SELL_ORDER = "sellOrder"
}

export const SOCKET_SERVER_URL = "http://localhost:5000";