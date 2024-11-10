import React from 'react';

interface RoundCounterProps {
  round: number;
  maxRounds: number;
}

const RoundCounter: React.FC<RoundCounterProps> = ({ round, maxRounds }) => {
  return (
    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg">
      <div className="text-sm font-medium opacity-75">ROUND</div>
      <div className="text-xl font-bold">{round}/{maxRounds}</div>
    </div>
  );
};

export default RoundCounter;