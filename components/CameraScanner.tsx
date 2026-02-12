
import React, { useRef, useState, useCallback } from 'react';

interface CameraScannerProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
  onError: (msg: string) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onClose, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasStarted(true);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDismissedError') {
        onError("Camera permission was denied or dismissed.");
      } else {
        onError("Could not access camera. Please check your device settings.");
      }
      onClose();
    }
  }, [onError, onClose]);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(dataUrl.split(',')[1]);
      
      // Stop stream
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      onClose();
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [startCamera]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 border-[40px] border-black/40 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border-2 border-white/50 rounded-3xl" />
      </div>

      <div className="absolute bottom-12 flex items-center space-x-12">
        <button onClick={onClose} className="p-4 bg-white/10 rounded-full text-white backdrop-blur-md">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
        <button 
          onClick={capture} 
          disabled={!hasStarted}
          className={`w-20 h-20 bg-white rounded-full border-8 border-white/30 flex items-center justify-center transition-opacity ${!hasStarted ? 'opacity-50' : 'opacity-100'}`}
        />
        <div className="w-16" /> {/* Spacer */}
      </div>
      
      <div className="absolute top-12 text-white font-bold text-center px-6">
        {hasStarted ? "Point at a product or receipt" : "Starting camera..."}
      </div>
    </div>
  );
};

export default CameraScanner;
