import React from 'react';
import { Trophy, X } from 'lucide-react';
import { HighScore } from '../types';

interface HighScoresProps {
  scores: HighScore[];
}

const HighScores: React.FC<HighScoresProps> = ({ scores }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg"
      >
        <Trophy className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">High Scores</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  className="bg-white/5 rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">
                        {score.playerName}
                      </span>
                      <span className="text-yellow-400 font-bold">
                        {score.score.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/60 text-sm">
                        {formatDate(score.date)}
                      </span>
                      <span className="text-white/60 text-sm">
                        {score.accuracy}% accuracy
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HighScores;