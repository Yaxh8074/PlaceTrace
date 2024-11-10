import React, { useState, useCallback, useMemo } from 'react';
import MapillaryViewer from './components/MapillaryViewer';
import GuessMap from './components/GuessMap';
import ScoreBoard from './components/ScoreBoard';
import ResultMap from './components/ResultMap';
import { GameState } from './types';
import { LOCATIONS } from './data/locations';
import { calculateScore, calculateDistance, shuffleArray } from './utils/game';
import { Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    score: 0,
    round: 1,
    maxRounds: 5,
    currentLocation: shuffleArray(LOCATIONS)[0],
    guessedLocation: null,
    showResults: false,
    gameOver: false,
    timeExpired: false,
    locations: shuffleArray(LOCATIONS)
  }));

  const handleGuess = useCallback((coords: [number, number]) => {
    if (!gameState.currentLocation || gameState.showResults) return;
    
    const distance = calculateDistance(gameState.currentLocation, coords);
    const roundScore = calculateScore(gameState.currentLocation, coords);
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + roundScore,
      guessedLocation: coords,
      showResults: true,
      timeExpired: false
    }));
  }, [gameState.currentLocation, gameState.showResults]);

  const handleTimeUp = useCallback(() => {
    if (!gameState.guessedLocation && !gameState.showResults) {
      setGameState(prev => ({
        ...prev,
        showResults: true,
        timeExpired: true,
        guessedLocation: [0, 0]
      }));
    }
  }, [gameState.guessedLocation, gameState.showResults]);

  const handleShare = useCallback(() => {
    const text = `🌍 I scored ${gameState.score} points in PlaceTrace!\n🎯 Can you beat my score?\nPlay now at: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'PlaceTrace Score',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  }, [gameState.score]);

  const nextRound = useCallback(() => {
    if (gameState.round >= gameState.maxRounds) {
      setGameState(prev => ({ ...prev, gameOver: true }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      round: prev.round + 1,
      currentLocation: prev.locations[prev.round],
      guessedLocation: null,
      showResults: false,
      timeExpired: false
    }));
  }, [gameState.round, gameState.maxRounds]);

  const restartGame = useCallback(() => {
    setGameState({
      score: 0,
      round: 1,
      maxRounds: 5,
      currentLocation: shuffleArray(LOCATIONS)[0],
      guessedLocation: null,
      showResults: false,
      gameOver: false,
      timeExpired: false,
      locations: shuffleArray(LOCATIONS)
    });
  }, []);

  if (!gameState.currentLocation) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <MapillaryViewer 
        imageId={gameState.currentLocation.id}
        round={gameState.round}
        maxRounds={gameState.maxRounds}
        onTimeUp={handleTimeUp}
      />

      <div className="absolute top-4 left-4 z-10">
        <ScoreBoard 
          score={gameState.score} 
          round={gameState.round} 
          maxRounds={gameState.maxRounds} 
        />
      </div>

      <GuessMap 
        onGuess={handleGuess}
        guessedLocation={gameState.guessedLocation}
        actualLocation={gameState.showResults ? [gameState.currentLocation.lat, gameState.currentLocation.lng] : null}
      />

      {gameState.showResults && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20 p-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl w-full">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-white text-center">
                {gameState.timeExpired ? "Time's Up!" : `Round ${gameState.round}`}
              </h2>
              
              <div className="relative aspect-[2/1] w-full">
                <ResultMap
                  guessedLocation={gameState.guessedLocation!}
                  actualLocation={[gameState.currentLocation.lat, gameState.currentLocation.lng]}
                />
              </div>

              <div className="flex items-center justify-between px-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">
                    {calculateScore(
                      gameState.currentLocation,
                      gameState.guessedLocation || [0, 0]
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-white/60 mt-1">points</p>
                </div>

                <div className="text-center">
                  <p className="text-xl font-bold text-white">
                    {calculateDistance(
                      gameState.currentLocation,
                      gameState.guessedLocation || [0, 0]
                    ).toLocaleString()} km
                  </p>
                  <p className="text-sm text-white/60 mt-1">from target</p>
                </div>

                <button
                  onClick={nextRound}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
                >
                  {gameState.round >= gameState.maxRounds ? 'Finish Game' : 'Next Round'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState.gameOver && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-30">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Game Over!</h2>
            <p className="text-2xl font-bold text-green-400 mb-6">
              {gameState.score.toLocaleString()} points
            </p>
            <div className="flex gap-3">
              <button
                onClick={restartGame}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={handleShare}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;