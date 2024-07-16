import React from 'react';

function FocusCoins({ coins }) {
  return (
    <div className="focus-coins">
      <span role="img" aria-label="coin">🪙</span>
      <span>{coins} Focus Coins</span>
    </div>
  );
}

export default FocusCoins;