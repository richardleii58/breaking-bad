// src/OptionPricingCalculator.js
import React, { useState } from 'react';
import './OptionPricingCalculator.css'; // Import the CSS file

function OptionPricingCalculator() {
  // State variables to hold user inputs
  const [ticker, setTicker] = React.useState(""); // For the stock ticker
  const [price, setPrice] = React.useState(null); // For the current price
  const [loading, setLoading] = React.useState(false); // Loading indicator
  const [S0, setS0] = useState(100); // Initial stock price (manual or fetched)
  const [useLivePrice, setUseLivePrice] = useState(false); // Toggle between live price and manual entry
  const [X, setX] = useState(100); // Strike price
  const [r, setR] = useState(0.05); // Risk-free interest rate
  const [q, setQ] = useState(0); // Dividend yield
  const [t, setT] = useState(1); // Time to expiration
  const [v, setV] = useState(0.2); // Volatility

  // State variables for results and error messages
  const [result, setResult] = useState({ C: null, P: null });
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchStockPrice = async () => {
      if (!ticker) return;
  
      setLoading(true); // Show loading spinner
      try {
        // Replace with your API or scraper endpoint
        const response = await fetch(`https://api.example.com/stock?ticker=${ticker}`);
        const data = await response.json();
  
        if (data && data.price) {
          setPrice(data.price); // Set fetched price
          if (useLivePrice) {
            setS0(data.price); // Automatically update S0 if live price is used
          }
        } else {
          setPrice(null); // Handle invalid ticker
          setError("Invalid ticker. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching stock price:", error);
        setPrice(null);
        setError("Failed to fetch stock price. Please try again.");
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };
  
    fetchStockPrice();
  }, [ticker, useLivePrice]); // Re-fetch price if ticker or toggle changes
  

  // Function to handle the calculation when the button is clicked
  const handleCalculate = async () => {
    // Prepare the data to be sent to the backend
    const payload = { S0, X, r, q, t, v };

    try {
      // Make a POST request to the backend
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Update state based on the response
      if (response.ok) {
        setResult({ C: data.C, P: data.P });
        setError(null);
      } else {
        setError(data.error);
        setResult({ C: null, P: null });
      }
    } catch (err) {
      setError('Error connecting to the server.');
      setResult({ C: null, P: null });
    }
  };

  return (
    <div className="container">
      
      <div className="container">
        <div className="title-container">
          <div className="troll-face">
            <img src="https://i.imgur.com/Q7ZV9RN.png" alt="Troll Face" />
          </div>
          <div>
            <h1 className="title">Breaking Bad</h1>
            <h2 className="title">Option Pricing Calculator</h2>
          </div>
          <div className="troll-face">
            <img src="https://i.imgur.com/Q7ZV9RN.png" alt="Troll Face" />
          </div>
        </div>
      </div>

      {/* Introduction to the Black-Scholes Model */}     
    <div className="introduction container">
      <p className="intro-header">
        Welcome to the <span className="highlight">Option Pricing Calculator</span>!
      </p>
      <p className="intro-description">
        This project uses the <span className="highlight">Black-Scholes model</span> to calculate the prices of European call and put options. You can toggle between live or manual stock prices. 
        The Black-Scholes model is a mathematical model that helps estimate the fair value of options, considering factors such as:
      </p>
      <ul className="intro-list">
        <li>Current stock price</li>
        <li>Strike price</li>
        <li>Time to expiration</li>
        <li>Risk-free interest rate</li>
        <li>Volatility</li>
        <li>Dividend yield</li>
      </ul>
      <p className="intro-prompt">
        Please enter the parameters below to see the estimated prices for both call and put options.
      </p>
    </div>

      {/* Input fields for user to enter parameters */}
      
      <div className="stock-input">
        <label>
          Select Stock Ticker:
          <input
            type="text"
            placeholder="Enter stock ticker (e.g., AAPL)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="stock-search"
          />
        </label>

        {useLivePrice && (
          <div className="live-price-container">
            {loading ? (
              <p>Loading price...</p>
            ) : price !== null ? (
              <p>Current Price for {ticker}: ${price.toFixed(2)}</p>
            ) : (
              <p>Enter a valid stock ticker to fetch price.</p>
            )}
          </div>
        )}

        <label>
          <input
            type="checkbox"
            checked={useLivePrice}
            onChange={(e) => setUseLivePrice(e.target.checked)}
          />
          Use Live Price
        </label>

        {!useLivePrice && (
          <div className="manual-price-container">
            <label>
              Initial Stock Price (S0):
              <input
                type="number"
                value={S0}
                onChange={(e) => setS0(Number(e.target.value))}
                disabled={useLivePrice}
              />
            </label>
          </div>
        )}
      </div>
      
      <div className="form-group">
        <label>
          Strike Price (X):
          <input
            type="number"
            value={X}
            onChange={(e) => setX(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Risk-free Interest Rate (r):
          <input
            type="number"
            step="0.01"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Dividend Yield (q):
          <input
            type="number"
            step="0.01"
            value={q}
            onChange={(e) => setQ(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Time to Expiration (t in years):
          <input
            type="number"
            step="0.01"
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Expected Volatility (v):
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={v}
            onChange={(e) => setV(Number(e.target.value))}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={v}
            onChange={(e) => setV(Number(e.target.value))}
          />
          <span>{v.toFixed(2)}</span>
        </label>
      </div>

      {/* Button to trigger the calculation */}
      <button className="calculate-button" onClick={handleCalculate}>Calculate</button>

      {/* Display error message if any */}
      {error && <p className="error-message">{error}</p>}

      {/* Display the results if available */}
      {result.C !== null && result.P !== null && (
        <div className="results">
          <h2>Results:</h2>
          <p>Call Option Price (C): {result.C.toFixed(4)}</p>
          <p>Put Option Price (P): {result.P.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}

export default OptionPricingCalculator;