"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RefreshCw, 
  Loader2,
  X
} from "lucide-react";

interface AppPreviewProps {
  videoUrls: {
    mp4?: string;
    webm?: string;
    gif?: string;
  };
  thumbnail: string;
  title?: string;
  description?: string;
}

const AppPreview: React.FC<AppPreviewProps> = ({ 
  videoUrls, 
  thumbnail, 
  title = "App Preview", 
  description = "Explore the main features and interface of Al Nibras Finance." 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Analytics tracking refs
  const startTimeRef = useRef<number>(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
      
      // Track watch time and completion
      if (currentProgress >= 95 && !video.dataset.completed) {
        console.log("Analytics: Preview Completed");
        video.dataset.completed = "true";
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setIsLoaded(true);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        startTimeRef.current = Date.now();
        console.log("Analytics: Preview Started");
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-black aspect-video shadow-[0_0_50px_rgba(212,175,55,0.1)] border border-[#D4AF37]/20 group"
    >
      {/* Thumbnail / Placeholder */}
      <AnimatePresence>
        {!isPlaying && !isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <img 
              src={thumbnail} 
              alt="Preview Thumbnail" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(212,175,55,0.5)] mb-4"
              >
                <Play className="w-8 h-8 fill-current" />
              </motion.button>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">{title}</h3>
              <p className="text-gray-300 text-xs mt-2 max-w-md">{description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        poster={thumbnail}
        onEnded={() => setIsPlaying(false)}
      >
        {videoUrls.webm && <source src={videoUrls.webm} type="video/webm" />}
        {videoUrls.mp4 && <source src={videoUrls.mp4} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>

      {/* Loading Spinner */}
      {isLoading && isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
          <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      <motion.div 
        animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
        className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12"
      >
        {/* Progress Bar */}
        <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-6 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            style={{ width: `${progress}%` }}
          />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={togglePlay} className="text-white hover:text-[#D4AF37] transition-colors">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            
            <div className="flex items-center gap-3">
              <button onClick={toggleMute} className="text-white hover:text-[#D4AF37] transition-colors">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <span className="text-[10px] font-mono text-gray-400">
                {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"} / {videoRef.current ? formatTime(videoRef.current.duration) : "0:00"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => {
              if (videoRef.current) videoRef.current.currentTime = 0;
              if (!isPlaying) togglePlay();
            }} className="text-white hover:text-[#D4AF37] transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button onClick={toggleFullscreen} className="text-white hover:text-[#D4AF37] transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Analytics/Completion Message Overlay */}
      <AnimatePresence>
        {!isPlaying && isLoaded && progress >= 95 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-16 h-16 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Ready to Start?</h4>
            <p className="text-gray-400 text-xs mt-2 max-w-xs mb-8">You've seen what Al Nibras can do. Start your financial journey today!</p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime = 0;
                  togglePlay();
                }}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Watch Again
              </button>
              <button className="px-8 py-3 bg-[#D4AF37] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F2D06B] transition-all shadow-lg">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper to format time
const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default AppPreview;
