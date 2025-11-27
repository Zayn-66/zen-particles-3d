import React, { useEffect, useRef } from 'react';
import { initializeHandTracking, stopHandTracking } from '../services/handTracking';
import { useStore } from '../store';

const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setHandStatus = useStore(state => state.setHandStatus);

  useEffect(() => {
    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: 320,
              height: 240,
              facingMode: "user"
            }
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener('loadeddata', () => {
              if (videoRef.current) {
                initializeHandTracking(videoRef.current, setHandStatus);
              }
            });
          }
        } catch (err) {
            console.error("Camera denied or not available", err);
        }
      }
    };

    startCamera();

    return () => {
      stopHandTracking();
      // Stop tracks
      if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject as MediaStream;
         stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setHandStatus]);

  // Hidden video element, solely for processing
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="fixed bottom-4 right-4 w-32 h-24 object-cover opacity-50 rounded-lg z-50 pointer-events-none border border-white/20"
      style={{ transform: 'scaleX(-1)' }} // Mirror locally for intuitive feel, though data processing doesn't care
    />
  );
};

export default CameraFeed;
