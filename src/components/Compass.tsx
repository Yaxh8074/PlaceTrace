import React, { useEffect, useState } from 'react';
import { Compass as CompassIcon } from 'lucide-react';

interface CompassProps {
  bearing: number;
}

const Compass: React.FC<CompassProps> = ({ bearing }) => {
  const [normalizedBearing, setNormalizedBearing] = useState(0);

  useEffect(() => {
    const normalized = ((bearing % 360) + 360) % 360;
    setNormalizedBearing(normalized);
  }, [bearing]);

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-white/10 backdrop-blur-sm rounded-full px-5 py-1.5 shadow-lg flex items-center gap-2">
        <CompassIcon className="w-4 h-4 text-white" />
        <div className="flex items-center gap-1 text-white">
          <div className="w-32 h-1 bg-white/20 rounded-full relative overflow-hidden">
            <div 
              className="absolute h-full w-1 bg-white rounded-full transition-all duration-300"
              style={{ 
                left: `${(normalizedBearing / 360) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            />
          </div>
          <span className="text-xs font-medium ml-2">{Math.round(normalizedBearing)}°</span>
        </div>
      </div>
    </div>
  );
};

export default Compass;