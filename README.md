# market-sim
A stock market simulation game built with React and Node. The game simulates a trading session without using real stocks or real money.

### Running the app in a Dev Environment
1) cd server
2) npm install
3) npm run dev
4) cd ../frontend
5) Repeat steps 2 and 3.

The server and frontend should both be running now.
Open a web browser and visit http://localhost:3000

### Running the app in a Production Environment
To run this app in production, you must have Docker installed.

If you do not have Docker installed, visit this link: https://www.docker.com/products/docker-desktop

Navigate to the project root which has a docker-compose.yml file and run:
`docker-compose up --build`

The app should now be running at http://localhost:3000
