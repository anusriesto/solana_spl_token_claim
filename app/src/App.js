import React from 'react';
import ClaimTokens from './components/ClaimTokens';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Merkle Distributor</h1>
      </header>
      <ClaimTokens />
    </div>
  );
};

export default App;
