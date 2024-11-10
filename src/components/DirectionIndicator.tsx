import React from 'react';
import { Navigation } from 'lucide-react';

interface DirectionIndicatorProps {
  bearing: number;
}

const DirectionIndicator: React.FC<DirectionIndicatorProps> = ({ bearing }) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((bearing % 360) / 45)) % 8;
  const direction = directions[index];

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Navigation 
            className="w-5 h-5 text-white" 
            style={{ 
              transform: `rotate(${bearing}deg)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
          <span className="text-white font-medium">{direction}</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <span className="text-white text-sm">{Math.round(bearing)}°</span>
      </div>
    </div>
  );
};

export default DirectionIndicator;