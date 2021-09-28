import { useState, useEffect, useRef, useContext } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { PortfolioProps } from '../components/Portfolio';
import { PortfolioContext } from '../context/portfolio';
import { AlertContext } from '../context/alert';
import { AlertProps } from '../components/Alert';


export type OrderType = 'buyOrder' | 'sellOrder';

interface OrderData {
  /**
   * Data sent from the server 
   * with an 'orderUpdate' event
   * should conform to this
   * structure.
   */
  portfolio: PortfolioProps;
  message: {
    Type: AlertProps["Type"], 
    body: string
  };
};

interface PriceData {
  /** Return structure for usePrice */
  price: {
    current: number;
    change: number;
    changePct: number;
  };
  sendOrder: (nShares: number, Type: OrderType) => void;
};

type PriceUpdate = PriceData["price"] & {symbol: string};

const usePrice = (symbol: string): PriceData => {
  /**
   * The usePrice hook allows components to receive
   * real-time prices for a given symbol. The prices 
   * are received through a websocket connection to 
   * the server. When the price of an instrument
   * changes, the websocket server emits a 'priceUpdate'
   * message to be received by this hook.
   * 
   * The hook can also receive order updates from
   * the server and can send orders to the server.
   */
  const [price, setPrice] = useState<PriceData["price"]>({
    current: null, 
    change: null, 
    changePct: null
  });
  const socketRef = useRef<Socket>();
  const pfolioContext = useContext(PortfolioContext);
  const {sendMessage} = useContext(AlertContext);
  const PRICE_UPDATE_EVENT = "priceUpdate";
  const ORDER_UPDATE_EVENT = "orderUpdate";
  const SOCKET_SERVER_URL = 'http://localhost:5000';

  useEffect(() => {
    // Establish a websocket connection to the server
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    socketRef.current.on(PRICE_UPDATE_EVENT, (mssg: PriceUpdate) => {
      /** Receive updated prices for a given symbol */
      if (mssg.symbol === symbol) {
        setPrice({
          current: mssg.current, 
          change: mssg.change,
          changePct: mssg.changePct
        });
      }
    });

    // Update the portfolio after an order
    // has been processed
    socketRef.current.on(
      ORDER_UPDATE_EVENT, 
      (res: OrderData) => {
        if (res.message.Type !== 'error') {
          pfolioContext.updatePortfolio({
            ...pfolioContext,
            ...res.portfolio
          });
        }
        sendMessage(res.message.body, res.message.Type);
      }
    );

    return () => {socketRef.current.disconnect();}
  }, [symbol]);

  const sendOrder = (nShares: number, Type: OrderType): void => {
    /**
     * Send an order to the server to be processed. Once
     * an order has been processed by the server, an
     * ORDER_UPDATE_EVENT will be sent back to the 
     * frontend.
     */
    socketRef.current.emit(Type, {
      cash: pfolioContext.cash,
      equity: pfolioContext.equity,
      positions: pfolioContext.positions,
      avgPrice: price.current,
      nShares,
      symbol
    });
  }

  return {price, sendOrder};
}

export default usePrice;