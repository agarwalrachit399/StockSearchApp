# [VanguardInvest]( csci571assign3-2205.wl.r.appspot.com/ )

A responsive Angular web application for searching stock information, maintaining a watchlist, and managing a virtual portfolio.

## Table of Contents

1. [Architectural Overview](#architectural-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)

### Architectural Overview

![Project Logo](https://vfunction.com/wp-content/uploads/2024/05/blog-3-tier-application.webp)

The Application utilizes a `Three Layered Architectural Pattern` where the backend containing the REST API's communicate with 3rd party API, databases to fetch the required data. These API's communicate with the standalone Angular Components through various Services. The global state management is handled by creating dedicated services for sharing common data between different components.

- This pattern promotes `modularity` and `reusability` of various Angular Components.
- It also emphasizes a `separation of concerns` and decouples the UI from the underlying business logic.
- It makes the application `scalable` and easier to integrate newer features.


### Features

- **Search Stocks**: Search for stocks by name or ticker symbol and view detailed information like price, market cap, and daily changes.
- **Watchlist**: Add stocks to a personalized watchlist for quick access and tracking.
- **Portfolio**: Track and manage a virtual stock portfolio with buy/sell features.
- **Responsive Design**: Mobile-friendly interface for seamless use across devices.
- **Real-Time Data**: Up-to-date stock information using an external financial data API.

### Technologies Used
- **Frontend**: Angular, TypeScript, Angular Material
- **State Management**: NgRx
- **Styling**: CSS, Angular Material
- **API**: REST API for stock data 
### Getting Started

These instructions will help you set up and run the project locally.

#### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [Angular CLI](https://angular.io/cli) (v12+)
- [MongoDB](https://www.mongodb.com/) (v4+)

#### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/username/stock-explorer.git
   cd stock-explorer
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **API Configuration**:
- Obtain an API key from [Finnhub](https://finnhub.io/) and [Polygon](https://polygon.io/) 
- Create a .env file in the root directory and add your API key:

  ```bash
  FINHUB_API_KEY = your_finnhub_api_key_here
  POLYGON_API_KEY = your_polygon_api_key_here
4. **Set up MongoDB**:
- Ensure MongoDB is running locally or connect to a MongoDB Atlas cluster.
- The application requires two databases:
   - **WatchList**: Stores the user's selected stocks for quick access.
   - **Portfolio**: Stores details about stocks in the user's portfolio with buy/sell history.
- In the .env file, add your MongoDB connection string and database name.

  ```bash
  MONGODB_URI= your_connection_string
  DATABSE_NAME = your_database_name

#### Usage

1. **Build**:
- To build the project for production. The build artifacts will be stored in the `dist/` directory.

  ```bash
  ng build
  ```
2. **Backend Server**:
- To start your application, run the backend sever. The application will be available at `localhost:3000/`

   ```bash
   node server.js
   ```
