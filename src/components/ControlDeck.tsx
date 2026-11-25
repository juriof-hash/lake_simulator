import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind, Target, Compass } from 'lucide-react';
import { DirectionMode } from '../types';

interface ControlDeckProps {
  time: number;
  maxTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  direction: DirectionMode;
  meetingTime: number;
  onTimeChange: (newTime: number) => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onDirectionChange: (mode: DirectionMode) => void;
  onJumpToMeeting: () => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  time,
  maxTime,
  isPlaying,
  playbackSpeed,
  direction,
  meetingTime,
  onTimeChange,
  onTogglePlay,
  onReset,
  onSpeedChange,
  onDirectionChange,
  onJumpToMeeting,
}) => {
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}분 ${secs < 10 ? '0' : ''}${secs}초 (${minutes.toFixed(1)}분)`;
  };

  const speedOptions = [1, 2, 5, 10, 20];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
      {/* Top Row: Direction Toggle & Current Time Readout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">진행 방향:</span>
          <div className="inline-flex p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => onDirectionChange('same')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                direction === 'same'
                  ? 'bg-white text-indigo-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              같은 방향 (문제 원본)
            </button>
            <button
              onClick={() => onDirectionChange('opposite')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                direction === 'opposite'
                  ? 'bg-white text-indigo-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              반대 방향 (심화)
            </button>
          </div>
        </div>

        {/* Time Display Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">경과 시간:</span>
          <div className="px-3 py-1 bg-slate-900 text-white rounded-lg font-mono text-sm font-semibold tabular-nums tracking-wide">
            {formatTime(time)}
          </div>
        </div>
      </div>

      {/* Main Scrubber Slider */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
          <span className="tabular-nums">0분 (출발)</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onJumpToMeeting}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors inline-flex items-center gap-1"
            >
              <Target className="w-3 h-3" />
              <span>정답 {meetingTime.toFixed(1)}분으로 이동</span>
            </button>
          </div>
          <span className="tabular-nums">{maxTime}분</span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={maxTime}
            step={0.1}
            value={time}
            onChange={(e) => onTimeChange(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-hidden"
          />
          {/* Meeting Marker on Slider */}
          {meetingTime <= maxTime && (
            <div
              style={{ left: `${(meetingTime / maxTime) * 100}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center"
            >
              <div className="w-2.5 h-4 bg-amber-500 rounded-sm shadow-xs border border-white" />
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls & Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Play/Pause & Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="처음으로 리셋 (0분)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onTimeChange(Math.max(0, time - 1))}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            title="1분 뒤로"
          >
            -1분
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>일시정지</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>시뮬레이션 재생</span>
              </>
            )}
          </button>

          <button
            onClick={() => onTimeChange(Math.min(maxTime, time + 1))}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            title="1분 앞으로"
          >
            +1분
          </button>

          <button
            onClick={() => onTimeChange(Math.min(maxTime, time + 5))}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            title="5분 앞으로"
          >
            +5분
          </button>
        </div>

        {/* Speed Multiplier Segmented Tabs */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400 mr-1">배속:</span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            {speedOptions.map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-white text-indigo-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {speed}×
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
