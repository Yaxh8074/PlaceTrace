import React from 'react';
import { Settings, Flag } from 'lucide-react';

const Controls: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-2">
      <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg">
        <Settings className="w-6 h-6" />
      </button>
      <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg">
        <Flag className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Controls;