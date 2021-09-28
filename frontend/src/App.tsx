import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Portfolio, { 
	PortfolioProps, 
	STARTING_CASH_AMT 
} from './components/Portfolio';

import StockPreivew from './components/StockPreview';
import Watchlist from './components/Watchlist';
import Alert, { AlertProps } from './components/Alert';
import { InstrumentProps } from './components/Instrument';
import { PortfolioContext } from './context/portfolio'; 
import { SelectedContext } from './context/selected';
import { AlertContext } from './context/alert';
import './App.css';


interface ResponseData {
	/**
	 * The response given by the server
	 * after the initial get request 
	 * should contain a data object
	 * with an instruments property and
	 * a newSession property.
	 */
	data: {
		instruments: Array<InstrumentProps>;
		newSession: boolean;
	};
}

export default function App(): JSX.Element 
{
	const [selectedInstrument, setSelectedInstrument] = useState({
		symbol: '', 
		nShares: 0, 
		setSelected: (data: typeof SelectedContext) => {
			setSelectedInstrument({...selectedInstrument, ...data})
		}
	});
	const [portfolio, setPortfolio] = useState({
		cash: STARTING_CASH_AMT,
		equity: 0,
		positions: [],
		updatePortfolio: (updatedPortfolio: PortfolioProps) => {
			setPortfolio({...portfolio, ...updatedPortfolio});
		}
	});
	const [instruments, setInstruments] = useState<Array<InstrumentProps>>([]);
	const [alert, setAlert] = useState({
		Type: "success" as AlertProps["Type"],
		message: "",
		sendMessage: (message: string, Type: AlertProps["Type"]) => {
			setAlert({...alert, message, Type});
		}
	});

	useEffect(() => {
		axios.get('http://localhost:5000')
			.then((res: ResponseData) => {
				setInstruments(res.data.instruments);
				setSelectedInstrument({
					...selectedInstrument, 
					symbol: res.data.instruments[0].symbol
				});

				if (sessionStorage.getItem('portfolio')) {
					if (!res.data.newSession) {
						/**
						 * Retrieve the cached portfolio only
						 * if the trading session has not
						 * restarted. If prices reset, the
						 * portfolio should reset as well.
						 */
						setPortfolio({
							...portfolio,
							...JSON.parse(
								sessionStorage.getItem('portfolio')
							)
						});
					}
				}
			});
		}, []);

  return (
		<PortfolioContext.Provider value={portfolio}>
			<SelectedContext.Provider value={selectedInstrument}>
				<AlertContext.Provider value={alert}>
					<Alert Type={alert.Type}>{alert.message}</Alert>
					<div className="app container-fluid">
						<div className="row">
							<Portfolio 
								cash={portfolio.cash} 
								equity={portfolio.equity}
								positions={portfolio.positions}
							/>
							<StockPreivew symbol={selectedInstrument.symbol} />
							<Watchlist list={instruments} />
						</div>
					</div>
				</AlertContext.Provider>
		</SelectedContext.Provider>
	</PortfolioContext.Provider>
  );
}