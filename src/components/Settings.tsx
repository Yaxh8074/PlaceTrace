import React from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { GameSettings } from '../types';

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = (key: keyof GameSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-white/80 text-sm mb-2 block">
                  Time Limit (seconds)
                </label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="30"
                  value={settings.timeLimit}
                  onChange={(e) => handleChange('timeLimit', Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-white text-sm mt-1">{settings.timeLimit}s</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white/80">Allow Movement</label>
                  <input
                    type="checkbox"
                    checked={settings.moveAllowed}
                    onChange={(e) => handleChange('moveAllowed', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-white/80">Allow Pan</label>
                  <input
                    type="checkbox"
                    checked={settings.panAllowed}
                    onChange={(e) => handleChange('panAllowed', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-white/80">Allow Zoom</label>
                  <input
                    type="checkbox"
                    checked={settings.zoomAllowed}
                    onChange={(e) => handleChange('zoomAllowed', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">
                  Number of Rounds
                </label>
                <select
                  value={settings.roundCount}
                  onChange={(e) => handleChange('roundCount', Number(e.target.value))}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2"
                >
                  <option value="3">3 Rounds</option>
                  <option value="5">5 Rounds</option>
                  <option value="10">10 Rounds</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;