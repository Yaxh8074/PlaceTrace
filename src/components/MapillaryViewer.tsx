import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';
import { MAPILLARY_ACCESS_TOKEN } from '../config';
import Timer from './Timer';
import RoundCounter from './RoundCounter';
import Controls from './Controls';

interface MapillaryViewerProps {
  imageId: string;
  round: number;
  maxRounds: number;
  onTimeUp?: () => void;
}

const MapillaryViewer: React.FC<MapillaryViewerProps> = ({
  imageId,
  round,
  maxRounds,
  onTimeUp
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializationAttempts = useRef(0);

  useEffect(() => {
    let viewer: Viewer | null = null;
    let isMounted = true;

    const initViewer = async () => {
      if (!containerRef.current || !isMounted) return;

      try {
        setIsLoading(true);
        setError(null);

        if (viewerRef.current) {
          try {
            await viewerRef.current.remove();
          } catch (e) {
            console.warn('Error removing previous viewer:', e);
          }
          viewerRef.current = null;
        }

        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        if (!isMounted) return;

        viewer = new Viewer({
          accessToken: MAPILLARY_ACCESS_TOKEN,
          container: containerRef.current,
          imageId,
          component: {
            cover: false,
            sequence: false,
            image: true,
            navigation: false,
            bearing: false,
            spatial: false,
            zoom: false
          },
          transitionMode: 'instantaneous',
          renderMode: 'quality',
          baseImageSize: 2048,
          maxImageSize: 4096
        });

        viewerRef.current = viewer;

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Image load timeout'));
          }, 10000);

          viewer!.on('image', () => {
            clearTimeout(timeout);
            if (isMounted) {
              setIsLoading(false);
              resolve(true);
            }
          });

          viewer!.on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
          });
        });

      } catch (error) {
        console.error('Viewer initialization error:', error);
        
        if (isMounted) {
          initializationAttempts.current += 1;
          
          if (initializationAttempts.current < 3) {
            console.log(`Retrying initialization (attempt ${initializationAttempts.current + 1})...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await initViewer();
            return;
          }
          
          setError('Failed to initialize the street view. Please check your connection and try again.');
          setIsLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      if (viewer) {
        try {
          viewer.remove();
        } catch (e) {
          console.warn('Error during cleanup:', e);
        }
      }
    };
  }, [imageId]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ background: '#1a1a1a' }}
      />
      
      {!isLoading && !error && (
        <>
          <Timer initialTime={120} onTimeUp={onTimeUp} />
          <RoundCounter round={round} maxRounds={maxRounds} />
          <Controls />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-5 py-2 rounded-full shadow-lg">
            <span className="text-xs font-medium tracking-wider">PLACE YOUR PIN ON THE MAP</span>
          </div>
        </>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg text-white">Loading view...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-red-500/10 backdrop-blur-sm text-white p-6 rounded-lg max-w-md text-center">
            <h3 className="text-lg font-bold mb-2">Error</h3>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => {
                initializationAttempts.current = 0;
                setError(null);
                setIsLoading(true);
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapillaryViewer;