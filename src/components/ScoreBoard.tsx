import React from 'react';
import { ScoreBoardProps } from '../types';
import { Trophy } from 'lucide-react';

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, round, maxRounds }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-400" />
        <span className="text-base font-bold text-white">{score.toLocaleString()} points</span>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg px-4 py-2 text-white text-sm">
        Round {round} of {maxRounds}
      </div>
    </div>
  );
};

export default ScoreBoard;