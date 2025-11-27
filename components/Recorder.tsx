

import React, { useState, useEffect, useRef } from 'react';
import { SynthEngine } from '../services/synthEngine';

interface Props {
  engine: SynthEngine | null;
}

export const Recorder: React.FC<Props> = ({ engine }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [loop, setLoop] = useState(false);
  const [duration, setDuration] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
      let interval: any;
      if (isRecording) {
          interval = setInterval(() => setDuration(d => d + 1), 1000);
      } else if (!hasRecording) {
          setDuration(0);
      }
      return () => clearInterval(interval);
  }, [isRecording, hasRecording]);

  const drawWaveform = (buffer: AudioBuffer | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      
      // Clear
      ctx.fillStyle = '#171717'; // neutral-900
      ctx.fillRect(0, 0, w, h);

      if (!buffer) return;

      const data = buffer.getChannelData(0);
      const step = Math.ceil(data.length / w);
      const amp = h / 2;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      
      for(let i = 0; i < w; i++) {
          let min = 1.0;
          let max = -1.0;
          for (let j = 0; j < step; j++) {
              const datum = data[(i * step) + j];
              if (datum < min) min = datum;
              if (datum > max) max = datum;
          }
          // Draw a vertical bar for the range at this pixel
          ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
      }
  };

  const handleRecord = async () => {
      if (!engine) return;
      if (isRecording) {
          const buffer = await engine.stopRecording();
          setIsRecording(false);
          setHasRecording(true);
          drawWaveform(buffer);
      } else {
          engine.clearRecording();
          drawWaveform(null);
          engine.startRecording();
          setIsRecording(true);
          setHasRecording(false);
          setIsPlaying(false);
      }
  };

  const handlePlay = () => {
      if (!engine) return;
      if (isPlaying) {
          engine.stopPlayback();
          setIsPlaying(false);
      } else {
          engine.playRecording(loop);
          setIsPlaying(true);
      }
  };

  const handleClear = () => {
      if (!engine) return;
      engine.clearRecording();
      setHasRecording(false);
      setIsPlaying(false);
      setDuration(0);
      drawWaveform(null);
  };

  const formatTime = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#111] rounded border border-neutral-800 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
             <h2 className="text-xs font-bold text-neutral-500 tracking-[0.2em] uppercase">Tape Recorder</h2>
             <span className={`font-mono text-xs font-bold ${isRecording ? 'text-white animate-pulse' : 'text-neutral-600'}`}>
                 {isRecording ? '● REC' : formatTime(duration)}
             </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
            <button 
                onClick={handleRecord}
                className={`py-2 rounded border text-[10px] font-bold uppercase tracking-wider transition-all
                    ${isRecording 
                        ? 'bg-white text-black border-white' 
                        : 'bg-transparent text-neutral-500 border-neutral-700 hover:text-white hover:border-neutral-500'}
                `}
            >
                {isRecording ? 'Stop' : 'Rec'}
            </button>

            <button 
                onClick={handlePlay}
                disabled={!hasRecording || isRecording}
                className={`py-2 rounded border text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed
                    ${isPlaying 
                        ? 'bg-white text-black border-white' 
                        : 'bg-transparent text-neutral-500 border-neutral-700 hover:text-white hover:border-neutral-500'}
                `}
            >
                {isPlaying ? 'Stop' : 'Play'}
            </button>

            <button 
                onClick={handleClear}
                disabled={isRecording}
                className="bg-transparent border border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-500 py-2 rounded text-[10px] font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
            >
                Clear
            </button>
        </div>

        <div className="flex items-center justify-between">
            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Loop Playback</span>
            <button 
                onClick={() => setLoop(!loop)}
                className={`w-8 h-4 rounded-full relative transition-colors border border-neutral-700 ${loop ? 'bg-white border-white' : 'bg-transparent'}`}
            >
                <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${loop ? 'left-4.5 bg-black' : 'left-0.5 bg-neutral-600'}`}></div>
            </button>
        </div>

        {/* Waveform Canvas Area */}
        <div className="relative w-full h-16 bg-neutral-900 rounded border border-neutral-800 overflow-hidden">
            <canvas ref={canvasRef} width={300} height={64} className="w-full h-full" />
            {hasRecording && !isRecording && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-[9px] text-center text-neutral-400 uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded">
                        Tape Loaded
                     </span>
                </div>
            )}
        </div>
    </div>
  );
};