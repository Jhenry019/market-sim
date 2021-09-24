import http from 'http';
import express from 'express';
import cors from 'cors';
import io from 'socket.io';
import { Instrument } from './instrument';
import { OrderData, PriceUpdateData } from './instrument/utils';
import Portfolio from './portfolio';
import { Event } from './socket-vars';
import { 
  round, 
  replacePrivateKey, 
  handleInvalidShareCount, 
  generateMessage 
} from './utils';


const app = express();
const server = http.createServer(app);
const instruments = [
  new Instrument('ABC', 14.57),
  new Instrument('XYZ', 11.06),
  new Instrument('HOLA', 101.03),
  new Instrument('VOL', 44.52),
  new Instrument('UFO', 9.14),
  new Instrument('TAN', 78.93),
  new Instrument('BULL', 19.99),
  new Instrument('BEAR', 21.01),
  new Instrument('HOPE', 12.18),
  new Instrument('GREED', 31.09),
];
const socketServer = new io.Server(server, {
  cors: {
    origin: "*"
  }
});
let newSession = true;

app.use(cors());
socketServer.on("connection", socket => {
  /** When a socket connection is made, the server
   * will listen for PRICE_UPDATE, BUY_ORDER and
   * SELL_ORDER events. The frontend will connect
   * to this server so that it can send and receive
   * data.
  */
  socket.on(Event.PRICE_UPDATE, (data: PriceUpdateData) => {
    /** Send updated price data to the frontend */
    socketServer.emit(Event.PRICE_UPDATE, data);
  });

  socket.on(Event.BUY_ORDER, (data: OrderData) => {
    /** 
     * Listen for an incoming buy order event,
     * process the order and send an object
     * back. The object should contain a message
     * and an object representing the updated portfolio.
    */
    let {cash, equity, positions, nShares, avgPrice, symbol} = data;

    const investment = nShares * avgPrice;
    if (investment > cash) {
      socket.emit(
        Event.ORDER_UPDATE, 
        {
          message: {Type: 'error', body: 'Insufficient funds'},
          portfolio: {}
        },
      );
      return;
    }

    if (!nShares) return handleInvalidShareCount(socket);
    
    positions = Portfolio.addPosition(symbol, avgPrice, nShares, positions);
    cash = round(cash - investment); // to reflect the cash purchase
    equity = round(equity + investment); // to reflect equity gained
    socket.emit(Event.ORDER_UPDATE, {
      message: {
        Type: 'success',
        body: generateMessage(symbol, Event.BUY_ORDER, nShares)
      },
      portfolio: {
        cash,
        equity,
        positions
      }
    });
  });

  socket.on(Event.SELL_ORDER, (data: OrderData) => {
    /**
     * Listen for an incoming sell order, process
     * the order and return the updated portfolio
     * along with a message.
     */
    let {cash, equity, positions, nShares, avgPrice, symbol} = data;
    const proceeds = nShares * avgPrice;
    const matchingPositions = positions.filter(
      pos => pos.symbol === symbol
    );

    if (!nShares) return handleInvalidShareCount(socket);

    if (matchingPositions.length > 0 && 
        matchingPositions[0].nShares >= nShares) {
        positions = Portfolio.reducePosition(
          matchingPositions[0], 
          positions, 
          nShares
        );
        // to reflect the receipt of proceeds
        cash = round(cash + proceeds); 
        // to reflect reduction of equity
        equity = Math.max(round(equity - proceeds), 0); 
        
        socket.emit(Event.ORDER_UPDATE, {
          message: {
            Type: 'success',
            body: generateMessage(symbol, Event.SELL_ORDER, nShares)
          },
          portfolio: {cash, equity, positions}
        });
    } else {
        socket.emit(
          Event.ORDER_UPDATE, 
          {
            message: {
              Type: 'error', 
              body: `Not enough shares of ${symbol}`
            },
            portfolio: {}
          }
        );
    }
  });
});

// Express route handlers
app.get('/', (req, res) => {
  const appData = {instruments, newSession}
  newSession = false;
  res.send(JSON.stringify(appData, replacePrivateKey));
});

server.listen(5000, () => {
  console.log('Listening');
});