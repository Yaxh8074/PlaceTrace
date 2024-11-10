import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateDistance } from '../utils/game';
import { MapPin } from 'lucide-react';

interface GuessMapProps {
  onGuess: (coords: [number, number]) => void;
  guessedLocation: [number, number] | null;
  actualLocation: [number, number] | null;
  bearing?: number;
}

const GuessMap: React.FC<GuessMapProps> = ({ onGuess, guessedLocation, actualLocation, bearing }) => {
  const mapRef = useRef<L.Map | null>(null);
  const guessMarkerRef = useRef<L.Marker | null>(null);
  const actualMarkerRef = useRef<L.Marker | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);
  const distanceMarkerRef = useRef<L.Marker | null>(null);
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map', {
        zoomControl: false,
        fadeAnimation: true,
      }).setView([20, 0], 2);

      const tileLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
      }).addTo(map);

      tileLayer.on('loading', () => setIsLoading(true));
      tileLayer.on('load', () => setIsLoading(false));

      const zoomControl = L.control.zoom({
        position: 'topright'
      });
      zoomControl.addTo(map);

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setTempMarker([lat, lng]);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    if (guessMarkerRef.current) mapRef.current.removeLayer(guessMarkerRef.current);
    if (actualMarkerRef.current) mapRef.current.removeLayer(actualMarkerRef.current);
    if (lineRef.current) mapRef.current.removeLayer(lineRef.current);
    if (distanceMarkerRef.current) mapRef.current.removeLayer(distanceMarkerRef.current);

    if (tempMarker) {
      const markerHtml = `
        <div class="relative">
          <div class="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none">
            <div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="w-2 h-2 bg-red-500 rotate-45 -mt-1 shadow-lg"></div>
          </div>
          <div class="absolute -translate-x-1/2 -translate-y-full">
            <div class="w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
      `;

      guessMarkerRef.current = L.marker(tempMarker, {
        icon: L.divIcon({
          className: 'guess-marker',
          html: markerHtml,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        })
      }).addTo(mapRef.current);
    }
  }, [tempMarker]);

  useEffect(() => {
    if (mapRef.current && isExpanded) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 300);
    }
  }, [isExpanded]);

  const handleConfirmGuess = () => {
    if (tempMarker) {
      onGuess(tempMarker);
      setTempMarker(null);
    }
  };

  return (
    <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end gap-3">
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-[400px] h-[250px]' : 'w-56 h-56'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="relative w-full h-full">
          <div id="map" className="w-full h-full rounded-lg overflow-hidden shadow-lg border-2 border-white/20" />
          
          {isLoading && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
      
      {tempMarker && (
        <button
          onClick={handleConfirmGuess}
          className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg transition-colors font-semibold flex items-center gap-2 text-sm"
        >
          <MapPin className="w-4 h-4" />
          Make Guess
        </button>
      )}
    </div>
  );
};

export default GuessMap;