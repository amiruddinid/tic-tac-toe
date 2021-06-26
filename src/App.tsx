import React from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>Tic Tac Toe</h1>
        <Game />
      </div>
    </div>
  );
}

export default App;
