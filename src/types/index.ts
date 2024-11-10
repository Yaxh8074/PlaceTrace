export interface Location {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

export interface GameState {
  score: number;
  round: number;
  maxRounds: number;
  currentLocation: Location | null;
  guessedLocation: [number, number] | null;
  showResults: boolean;
  gameOver: boolean;
  timeExpired: boolean;
}

export interface ScoreBoardProps {
  score: number;
  round: number;
  maxRounds: number;
}