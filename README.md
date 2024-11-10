# PlaceTrace 🌍

PlaceTrace is an immersive geo-guessing game inspired by GeoGuessr, built with React, TypeScript, and MapillaryJS. Players are dropped into random street-view locations worldwide and must guess their position on a map, earning points based on the accuracy of their guesses.
live here: https://placetrace.netlify.app/


## 🎮 Features

- **Immersive Street View**: High-quality 360° panoramic views powered by MapillaryJS
- **Interactive Map**: Leaflet-based map with custom markers and animations
- **Real-time Scoring**: Dynamic scoring system based on distance accuracy
- **Time Pressure**: 120-second countdown timer for each round
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Compass Navigation**: Real-time bearing indicator for orientation
- **Round Tracking**: Clear progress indication through 5 rounds
- **Share Results**: Easy sharing of final scores on social media

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yaxh8074/placetrace.git
cd placetrace
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Mapillary access token:
```env
VITE_MAPILLARY_ACCESS_TOKEN=your_token_here
```

4. Start the development server:
```bash
npm run dev
```

## 🎯 How to Play

1. **Start Game**: The game begins with a street view of a random location
2. **Explore**: Use your mouse to look around in 360°
3. **Make Guess**: Click on the map to place your guess marker
4. **Score Points**: Points are awarded based on how close your guess is
5. **Complete Rounds**: Play through all 5 rounds to get your final score
6. **Share Results**: Share your score with friends and challenge them

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Street View**: MapillaryJS
- **Map**: Leaflet with custom styling
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks

## 📦 Project Structure

```
src/
├── components/
│   ├── MapillaryViewer.tsx   # Street view component
│   ├── GuessMap.tsx          # Interactive map component
│   ├── ScoreBoard.tsx        # Score display
│   ├── Timer.tsx             # Countdown timer
│   ├── Compass.tsx           # Bearing indicator
│   ├── Controls.tsx          # Game controls
│   └── RoundCounter.tsx      # Round progress
├── data/
│   └── locations.ts          # Game locations data
├── types/
│   └── index.ts              # TypeScript definitions
├── utils/
│   └── game.ts              # Game logic utilities
└── App.tsx                  # Main application component
```

## 🎮 Game Mechanics

### Scoring System

The scoring system is based on an exponential decay function:
```typescript
score = Math.round(Math.max(0, 5000 * Math.exp(-distance/2000)))
```

- Perfect guess: 5000 points
- Distance affects points exponentially
- Minimum score: 0 points

### Round Structure

- 5 rounds per game
- 120 seconds per round
- Automatic submission when time expires
- Final score is the sum of all round scores

## 🔧 Configuration

### Custom Locations

Add your own locations in `src/data/locations.ts`:
```typescript
export const LOCATIONS: Location[] = [
  {
    id: 'mapillary-image-id',
    lat: number,
    lng: number,
    name: string
  },
  // ...
];
```

### MapillaryJS Settings

The viewer is configured for optimal performance with:
- High-quality rendering mode
- 4K maximum image size
- Anti-aliasing enabled
- Instant transitions
- Optimized component loading

## 📱 Responsive Design

The game is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices (landscape recommended)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



## 🙏 Acknowledgments

- Mapillary for their excellent street view API
- Leaflet for the mapping functionality
- The React community for amazing tools and support
