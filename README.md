```markdown
# StockSphere - Multi-Stock Comparative Analysis Platform

StockSphere is a web application designed to provide comprehensive stock market insights by allowing users to compare up to four stocks simultaneously, with flexible time-frame views ranging from daily to monthly performance. Users can maintain a list of favorite stocks and see their performance directly upon logging in. The application is secure, responsive, mobile-friendly, and multilingual, supporting both English and Spanish.

## Overview

StockSphere is built with a modern web stack, featuring a ReactJS-based frontend and an Express-based backend. The project is structured into two main parts:

1. **Frontend**
    - **Framework**: ReactJS
    - **Dev Server**: Vite
    - **Styling**: Tailwind CSS with shadcn-ui component library
    - **Routing**: `react-router-dom`
    - **State Management**: React Context
    - **API Requests**: Axios
    - **Localization**: i18next (English and Spanish)
    - **Authentication**: Google OAuth

2. **Backend**
    - **Framework**: Express
    - **Database**: MongoDB with Mongoose
    - **Authentication**: JWT (JSON Web Tokens)
    - **APIs**: Alpha Vantage for stock data
    - **Environment Variables**: Managed via dotenv

The project structure is as follows:
```
/
├── client/                # Frontend code
│   ├── src/
│   │   ├── api/           # API request functions
│   │   ├── components/    # React components
│   │   ├── contexts/      # React context providers
│   │   ├── hooks/         # Custom hooks
│   │   ├── i18n/          # Localization files
│   │   ├── pages/         # Page components
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   └── vite.config.ts     # Vite configuration
└── server/                # Backend code
    ├── controllers/       # Route controllers
    ├── models/            # Mongoose models
    ├── routes/            # Express routes
    ├── services/          # Business logic
    ├── utils/             # Utility functions
    ├── .env               # Environment variables
    └── server.js          # Entry point
```

## Features

- **User Authentication**: Secure login via Google OAuth.
- **Stock Comparison**: Compare up to four stocks simultaneously.
- **Flexible Time-Frames**: View stock performance over daily, weekly, and monthly periods.
- **Favorite Stocks**: Maintain a list of favorite stocks and view their performance on the home page.
- **Responsive Design**: Mobile-friendly and responsive layout.
- **Multilingual Support**: Available in English and Spanish.
- **Stock Data Retrieval**: Fetch stock data using Alpha Vantage API.

## Getting started

### Requirements

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- MongoDB (local or remote instance)

### Quickstart

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/StockSphere.git
   cd StockSphere
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `server/` directory with the following content:
   ```
   PORT=3000
   DATABASE_URL=mongodb://127.0.0.1:27017/stocksphere
   JWT_SECRET=your_jwt_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Install dependencies:**
   ```sh
   npm install
   cd client
   npm install
   cd ../server
   npm install
   ```

4. **Run the application:**
   ```sh
   npm run start
   ```
   This will start both the frontend and backend servers concurrently.

5. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

### License

The project is proprietary (not open source). Copyright (c) 2024.
```