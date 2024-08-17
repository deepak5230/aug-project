import React, { useEffect, useState } from 'react';
//import './App.css';

function App() {
  const [coins, setCoins] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    // Fetch data from the API
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
      .then(response => response.json())
      .then(data => setCoins(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const sortedCoins = React.useMemo(() => {
    let sortableItems = [...coins];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [coins, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="App">
      <h1>Cryptocurrency Prices</h1>

      {/* Sort Buttons */}
      <div className="sort-buttons">
        <input className="input"type="text" placeholder = "search by name or folder"/>
        <button className="mkt"onClick={() => requestSort('market_cap')}>
          Sort by Market Cap {sortConfig.key === 'market_cap' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button className="percentage"onClick={() => requestSort('price_change_percentage_24h')}>
          Sort by % Change {sortConfig.key === 'price_change_percentage_24h' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
        </button>
      </div>

      {/* Data Table */}
      <table>
    
        <tbody>
          {sortedCoins.map((coin) => (
            <tr key={coin.id}>
              <td><img src={coin.image} alt={coin.name} width="30" /></td>
              <td>{coin.name}</td>
              <td>{coin.symbol.toUpperCase()}</td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td>${coin.total_volume.toLocaleString()}</td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td>{coin.price_change_percentage_24h.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
