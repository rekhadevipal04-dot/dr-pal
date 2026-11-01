import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Maximize2, MousePointer, Sparkles, ChevronRight } from 'lucide-react';

interface VideoScrubberProps {
  id: string;
  folderPath: string; // e.g. "/videos/video_1_frames"
  totalFrames: number; // e.g. 300 or 50
  title: string;
  subtitle: string;
  tag: string;
  stepNumber: number;
  highlightText?: string;
  onBookAppointmentClick?: () => void;
}

export const VideoScrubber: React.FC<VideoScrubberProps> = ({
  id,
  folderPath,
  totalFrames,
  title,
  subtitle,
  tag,
  stepNumber,
  highlightText,
  onBookAppointmentClick,
}) => {
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  // Helper to format frame filename: ezgif-frame-001.jpg
  const getFrameUrl = useCallback((frameNum: number) => {
    const padded = String(Math.max(1, Math.min(totalFrames, frameNum))).padStart(3, '0');
    return `${folderPath}/ezgif-frame-${padded}.jpg`;
  }, [folderPath, totalFrames]);

  // Preload first few frames and critical points
  useEffect(() => {
    let loadedCount = 0;
    const preloadFrames = Math.min(25, totalFrames);
    for (let i = 1; i <= preloadFrames; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / preloadFrames) * 100));
      };
    }
  }, [getFrameUrl, totalFrames]);

  // Autoplay loop functionality
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const intervalMs = totalFrames > 100 ? 33 : 80; // 30fps for 300 frames, ~12fps for 50 frames

    const loop = (timestamp: number) => {
      if (timestamp - lastPlayTimeRef.current >= intervalMs) {
        lastPlayTimeRef.current = timestamp;
        setCurrentFrame((prev) => (prev >= totalFrames ? 1 : prev + 1));
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, totalFrames]);

  // Mouse wheel scroll scrubbing when hovering
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Only capture wheel scrubbing if user is actively hovering over container
    if (isHovered) {
      e.preventDefault();
      setIsPlaying(false);
      const delta = e.deltaY;
      const step = totalFrames > 100 ? (Math.abs(delta) > 50 ? 3 : 1) : 1;
      
      setCurrentFrame((prev) => {
        if (delta > 0) {
          return Math.min(totalFrames, prev + step);
        } else {
          return Math.max(1, prev - step);
        }
      });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    setCurrentFrame(parseInt(e.target.value, 10));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(1);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <section id={id} className="relative py-12 lg:py-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Tag & Section Details */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Walkthrough #{stepNumber}
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{tag}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
            <MousePointer className="w-3.5 h-3.5 text-cyan-500 animate-bounce" />
            <span>Hover & Scroll Wheel to Scrub</span>
          </div>
        </div>

        {/* Video Scrubber Container */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative w-full aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 shadow-xl border-2 border-slate-200/80 transition-all duration-300 hover:shadow-2xl hover:border-cyan-400"
        >
          {/* Active Frame Image */}
          <img
            src={getFrameUrl(currentFrame)}
            alt={`${title} - frame ${currentFrame}`}
            className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-100"
            loading="eager"
          />

          {/* Top HUD Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>1080p HD Walkthrough</span>
            </div>
            
            <div className="bg-slate-900/80 backdrop-blur-md text-cyan-300 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border border-white/20">
              Frame: {String(currentFrame).padStart(3, '0')} / {totalFrames}
            </div>
          </div>

          {/* Bottom White Gradient Overlay with Typography (As instructed in the Clinic Guide) */}
          <div className="absolute bottom-0 inset-x-0 pt-16 pb-6 px-6 sm:px-8 bg-gradient-to-t from-white/95 via-white/85 to-transparent flex flex-col justify-end pointer-events-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 block mb-1">
                  {highlightText || "Interactive Cinematic Tour"}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                  {title}
                </h3>
                <p className="mt-1 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {onBookAppointmentClick && (
                <button
                  onClick={onBookAppointmentClick}
                  className="self-start md:self-auto shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 shadow-md shadow-cyan-500/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Book Appointment
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Scrubbing Bar & Controls Row */}
            <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
                title={isPlaying ? "Pause automatic animation" : "Play continuous animation"}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Reset to beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Progress Slider */}
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min="1"
                  max={totalFrames}
                  value={currentFrame}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600 focus:outline-none"
                  aria-label="Frame scrubber slider"
                />
              </div>

              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Fullscreen view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights beneath scrubber */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/90 rounded-xl p-3 border border-slate-200/70 shadow-xs">
            <span className="block text-base font-bold text-slate-800">100% Sterile</span>
            <span className="text-xs text-slate-500">Autoclaved Class-B Standards</span>
          </div>
          <div className="bg-white/90 rounded-xl p-3 border border-slate-200/70 shadow-xs">
            <span className="block text-base font-bold text-cyan-700">Digital Dentistry</span>
            <span className="text-xs text-slate-500">Low Radiation 3D X-Ray</span>
          </div>
          <div className="bg-white/90 rounded-xl p-3 border border-slate-200/70 shadow-xs">
            <span className="block text-base font-bold text-slate-800">Comfort Chair</span>
            <span className="text-xs text-slate-500">Ergonomic Memory Foam</span>
          </div>
          <div className="bg-white/90 rounded-xl p-3 border border-slate-200/70 shadow-xs">
            <span className="block text-base font-bold text-cyan-700">Zero Wait Time</span>
            <span className="text-xs text-slate-500">Pre-Scheduled Slot Assurance</span>
          </div>
        </div>
      </div>
    </section>
  );
};
