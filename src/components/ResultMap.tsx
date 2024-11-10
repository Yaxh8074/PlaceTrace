import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateDistance } from '../utils/game';

interface ResultMapProps {
  guessedLocation: [number, number];
  actualLocation: [number, number];
  timeExpired?: boolean;
}

const ResultMap: React.FC<ResultMapProps> = ({ guessedLocation, actualLocation, timeExpired }) => {
  const mapRef = useRef<L.Map | null>(null);
  const guessMarkerRef = useRef<L.Marker | null>(null);
  const actualMarkerRef = useRef<L.Marker | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);
  const distanceMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('result-map', {
        zoomControl: true,
        zoomSnap: 0.1,
        worldCopyJump: true
      }).setView([0, 0], 1);

      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear previous markers and line
    if (guessMarkerRef.current) map.removeLayer(guessMarkerRef.current);
    if (actualMarkerRef.current) map.removeLayer(actualMarkerRef.current);
    if (lineRef.current) map.removeLayer(lineRef.current);
    if (distanceMarkerRef.current) map.removeLayer(distanceMarkerRef.current);

    // Add guess marker if not time expired
    if (!timeExpired) {
      guessMarkerRef.current = L.marker(guessedLocation, {
        icon: L.divIcon({
          className: 'guess-marker',
          html: `
            <div class="relative">
              <div class="absolute -top-3 -left-3 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg">
                <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(map);
    }

    // Add actual location marker
    actualMarkerRef.current = L.marker(actualLocation, {
      icon: L.divIcon({
        className: 'actual-marker',
        html: `
          <div class="relative">
            <div class="absolute -top-3 -left-3 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg">
              <div class="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(map);

    if (!timeExpired) {
      // Add line between markers
      lineRef.current = L.polyline([guessedLocation, actualLocation], {
        color: '#6366f1',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10'
      }).addTo(map);

      // Add distance marker at midpoint
      const midLat = (guessedLocation[0] + actualLocation[0]) / 2;
      const midLng = (guessedLocation[1] + actualLocation[1]) / 2;
      const distance = calculateDistance(
        { lat: actualLocation[0], lng: actualLocation[1] },
        guessedLocation
      );

      distanceMarkerRef.current = L.marker([midLat, midLng], {
        icon: L.divIcon({
          className: 'distance-marker',
          html: `
            <div class="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
              <span class="text-sm font-semibold text-gray-900">${distance.toLocaleString()} km</span>
            </div>
          `,
          iconSize: [100, 40],
          iconAnchor: [50, 20]
        })
      }).addTo(map);
    }

    // Fit bounds
    if (timeExpired) {
      map.setView(actualLocation, 8);
    } else {
      const bounds = L.latLngBounds([guessedLocation, actualLocation]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [guessedLocation, actualLocation, timeExpired]);

  return (
    <div id="result-map" className="absolute inset-0 rounded-lg overflow-hidden border border-white/20" />
  );
};

export default ResultMap;