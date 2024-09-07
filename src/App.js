import React, { useState } from 'react';
import './App.css';

function PlayerInput({ playerName, onNameChange, onGuessChange, guess }) {
  return (
    <div className="player-input">
      <input
        type="text"
        placeholder={`Player ${playerName} Name`}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <input
        type="number"
        placeholder={`${playerName}'s Guess`}
        value={guess}
        onChange={(e) => onGuessChange(e.target.value)}
      />
    </div>
  );
}

export default function GameOfRandom() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [range, setRange] = useState(100);
  const [winningScore, setWinningScore] = useState(10);
  const [players, setPlayers] = useState(
    Array.from({ length: numPlayers }, () => ({ name: '', guess: '', score: 0 }))
  );
  const [randomNumber, setRandomNumber] = useState(null);
  const [winner, setWinner] = useState(null);

  const handlePlayerNameChange = (index, newName) => {
    const newPlayers = [...players];
    newPlayers[index].name = newName;
    setPlayers(newPlayers);
  };

  const handlePlayerGuessChange = (index, newGuess) => {
    const newPlayers = [...players];
    newPlayers[index].guess = newGuess;
    setPlayers(newPlayers);
  };

  const handleGenerateRandom = () => {
    // Validation check: Ensure all players have names and guesses
    for (const player of players) {
      if (!player.name.trim()) {
        alert('Please enter all player names.');
        return;
      }
      if (!player.guess.trim()) {
        alert('Please enter all player guesses.');
        return;
      }
    }

    const random = Math.floor(Math.random() * range) + 1;
    setRandomNumber(random);
    let closestDiff = Infinity;
    let winnerIndex = null;

    players.forEach((player, index) => {
      const guess = parseInt(player.guess, 10);
      const diff = Math.abs(guess - random);
      if (diff < closestDiff) {
        closestDiff = diff;
        winnerIndex = index;
      }
    });

    const newPlayers = [...players];
    if (parseInt(players[winnerIndex].guess, 10) === random) {
      newPlayers[winnerIndex].score += 2;
    } else {
      newPlayers[winnerIndex].score += 1;
    }

    setPlayers(newPlayers);

    if (newPlayers[winnerIndex].score >= winningScore) {
      setWinner(newPlayers[winnerIndex].name || `Player ${winnerIndex + 1}`);
    }
  };

  const handleReset = () => {
    setPlayers(players.map(player => ({ ...player, guess: '', score: 0 })));
    setRandomNumber(null);
    setWinner(null);
  };

  const handlePlayerCountChange = (count) => {
    setNumPlayers(count);
    const newPlayers = Array.from({ length: count }, (_, i) => players[i] || { name: '', guess: '', score: 0 });
    setPlayers(newPlayers);
  };

  return (
    <div className="game-container">
      <h1>Lucky Game 2</h1>

      {/* Player Count Selection */}
      <div>
        <label>Number of Players:</label>
        <select value={numPlayers} onChange={(e) => handlePlayerCountChange(parseInt(e.target.value))}>
          {[2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {/* Range Selection */}
      <div>
        <label>Random Number Range:</label>
        <select value={range} onChange={(e) => setRange(parseInt(e.target.value))}>
          <option value={100}>1-100</option>
          <option value={200}>1-200</option>
          <option value={300}>1-300</option>
          <option value={400}>1-400</option>
          <option value={500}>1-500</option>
        </select>
      </div>

      {/* Winning Score Selection */}
      <div>
        <label>Winning Score:</label>
        <select value={winningScore} onChange={(e) => setWinningScore(parseInt(e.target.value))}>
          <option value={10}>10 Points</option>
          <option value={20}>20 Points</option>
          <option value={30}>30 Points</option>
          <option value={40}>40 Points</option>
          <option value={50}>50 Points</option>
        </select>
      </div>

      {/* Player Inputs */}
      {players.map((player, index) => (
        <PlayerInput
          key={index}
          playerName={`Player ${index + 1}`}
          onNameChange={(name) => handlePlayerNameChange(index, name)}
          onGuessChange={(guess) => handlePlayerGuessChange(index, guess)}
          guess={player.guess}
        />
      ))}

      <button className="random-btn" onClick={handleGenerateRandom} disabled={!!winner}>
        Generate Random Number
      </button>

      {randomNumber && <div>Random Number: {randomNumber}</div>}

      {/* Scores */}
      {players.map((player, index) => (
        <div key={index}>{player.name || `Player ${index + 1}`} Score: {player.score}</div>
      ))}

      {winner && <div className="winner-message">{winner} Wins!</div>}

      <button className="reset-btn" onClick={handleReset}>Reset Game</button>
    </div>
  );
}

