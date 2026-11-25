import React from 'react';
import { RunnerState, DirectionMode } from '../types';
import { Flag, Sparkles, Navigation, Users } from 'lucide-react';

interface LakeCanvasProps {
  circumference: number; // in meters
  time: number; // in minutes
  speedA: number;
  speedB: number;
  direction: DirectionMode;
  stateA: RunnerState;
  stateB: RunnerState;
  isMeeting: boolean;
  meetingTime: number;
  onJumpToMeeting: () => void;
}

export const LakeCanvas: React.FC<LakeCanvasProps> = ({
  circumference,
  time,
  speedA,
  speedB,
  direction,
  stateA,
  stateB,
  isMeeting,
  meetingTime,
  onJumpToMeeting,
}) => {
  const cx = 260;
  const cy = 250;
  const r = 170; // radius of track center
  const trackWidth = 36;

  // Convert track distance (0 to circumference) to angle (in radians)
  // 0m is at top: -PI/2
  // Clockwise for A (same and opposite)
  // For same direction: B is also clockwise
  // For opposite direction: B is counter-clockwise
  const getAngle = (trackMeters: number, isOpposite = false) => {
    const fraction = (trackMeters % circumference) / circumference;
    if (isOpposite) {
      return -Math.PI / 2 - fraction * 2 * Math.PI;
    }
    return -Math.PI / 2 + fraction * 2 * Math.PI;
  };

  const angleA = getAngle(stateA.trackPositionMeters, false);
  const angleB = getAngle(stateB.trackPositionMeters, direction === 'opposite');

  // Position of Runner A on track
  const ax = cx + (r - 7) * Math.cos(angleA);
  const ay = cy + (r - 7) * Math.sin(angleA);

  // Position of Runner B on track
  const bx = cx + (r + 7) * Math.cos(angleB);
  const by = cy + (r + 7) * Math.sin(angleB);

  // Helper for arc trail (SVG path)
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 2 * Math.PI;
    if (diff >= 2 * Math.PI - 0.001) diff = 2 * Math.PI - 0.001;

    const startX = x + radius * Math.cos(startAngle);
    const startY = y + radius * Math.sin(startAngle);
    const endX = x + radius * Math.cos(startAngle + diff);
    const endY = y + radius * Math.sin(startAngle + diff);

    const largeArcFlag = diff > Math.PI ? 1 : 0;

    return [
      'M', startX, startY,
      'A', radius, radius, 0, largeArcFlag, 1, endX, endY
    ].join(' ');
  };

  // Distance markers along the perimeter (e.g. 0, 250, 500, 750, 1000, 1250, 1500)
  const numMarkers = circumference >= 1000 ? 6 : 4;
  const step = circumference / numMarkers;
  const markers = Array.from({ length: numMarkers }, (_, i) => i * step);

  return (
    <div className="relative w-full flex flex-col items-center bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 overflow-hidden">
      {/* Visual Header & Meeting Alert */}
      <div className="w-full flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-sky-100 text-sky-700">
            <Users className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {direction === 'same' ? '같은 방향 달리기 (동일 시계방향)' : '반대 방향 달리기 (마주보고 달리기)'}
            </h3>
            <p className="text-xs text-slate-500">
              둘레 {circumference.toLocaleString()}m ({circumference / 1000}km) 원형 산책로
            </p>
          </div>
        </div>

        {isMeeting && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold animate-pulse shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>두 사람 첫 만남 성공! ({time.toFixed(1)}분)</span>
          </div>
        )}
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full max-w-[540px] aspect-[520/490]">
        <svg
          viewBox="0 0 520 490"
          className="w-full h-full select-none"
        >
          <defs>
            {/* Water gradient */}
            <radialGradient id="lakeWater" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="65%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </radialGradient>

            {/* Track gradient */}
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.25" />
            </linearGradient>

            {/* Runner A glow */}
            <filter id="glowA" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.4" />
            </filter>

            {/* Runner B glow */}
            <filter id="glowB" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ea580c" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Grass Background outer ring */}
          <circle cx={cx} cy={cy} r={r + 30} fill="#f0fdf4" stroke="#dcfce7" strokeWidth="2" />

          {/* Athletic Track Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#fed7aa"
            strokeWidth={trackWidth}
          />
          {/* Inner track border */}
          <circle
            cx={cx}
            cy={cy}
            r={r - trackWidth / 2}
            fill="none"
            stroke="#fdba74"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Outer track border */}
          <circle
            cx={cx}
            cy={cy}
            r={r + trackWidth / 2}
            fill="none"
            stroke="#fdba74"
            strokeWidth="1.5"
          />
          {/* Track Lane divider */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#fff"
            strokeWidth="1"
            strokeDasharray="5 5"
            opacity="0.8"
          />

          {/* Central Lake Body */}
          <circle
            cx={cx}
            cy={cy}
            r={r - trackWidth / 2 - 2}
            fill="url(#lakeWater)"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          {/* Water Ripples decorative */}
          <ellipse cx={cx - 35} cy={cy - 20} rx="40" ry="12" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
          <ellipse cx={cx + 35} cy={cy + 30} rx="30" ry="8" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
          <ellipse cx={cx} cy={cy + 10} rx="65" ry="18" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.4" />

          {/* Small Central Island or Information Deck */}
          <circle cx={cx} cy={cy} r="46" fill="#ffffff" stroke="#bae6fd" strokeWidth="2" className="shadow-inner" />
          <text x={cx} y={cy - 14} textAnchor="middle" className="text-[11px] font-semibold fill-slate-500">
            호수 둘레
          </text>
          <text x={cx} y={cy + 6} textAnchor="middle" className="text-[15px] font-black fill-sky-800">
            {circumference.toLocaleString()}m
          </text>
          <text x={cx} y={cy + 22} textAnchor="middle" className="text-[10px] font-medium fill-sky-600">
            ({(circumference / 1000).toFixed(1)}km)
          </text>

          {/* Distance Markers along the Track */}
          {markers.map((dist, idx) => {
            const angle = -Math.PI / 2 + (dist / circumference) * 2 * Math.PI;
            const markerR = r + trackWidth / 2 + 16;
            const mx = cx + markerR * Math.cos(angle);
            const my = cy + markerR * Math.sin(angle);
            const isStart = dist === 0;

            return (
              <g key={idx}>
                {/* Tick line */}
                <line
                  x1={cx + (r - trackWidth / 2) * Math.cos(angle)}
                  y1={cy + (r - trackWidth / 2) * Math.sin(angle)}
                  x2={cx + (r + trackWidth / 2) * Math.cos(angle)}
                  y2={cy + (r + trackWidth / 2) * Math.sin(angle)}
                  stroke={isStart ? '#dc2626' : '#94a3b8'}
                  strokeWidth={isStart ? '3' : '1.5'}
                />
                {/* Distance text */}
                <text
                  x={mx}
                  y={my + 4}
                  textAnchor="middle"
                  className={`text-[10px] tabular-nums ${isStart ? 'font-bold fill-red-600' : 'font-medium fill-slate-500'}`}
                >
                  {isStart ? '0m(출발)' : `${Math.round(dist)}m`}
                </text>
              </g>
            );
          })}

          {/* Start Line Finish Ribbon Visual */}
          <g transform={`translate(${cx - 18}, ${cy - r - trackWidth / 2 - 2})`}>
            <rect x="0" y="0" width="36" height="4" fill="#ef4444" rx="2" />
          </g>

          {/* Active Lap Trail for Runner A (Blue) */}
          {stateA.distance > 0 && (
            <path
              d={describeArc(cx, cy, r - 7, -Math.PI / 2, angleA)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.75"
            />
          )}

          {/* Active Lap Trail for Runner B (Orange) */}
          {stateB.distance > 0 && (
            <path
              d={
                direction === 'opposite'
                  ? describeArc(cx, cy, r + 7, angleB, -Math.PI / 2)
                  : describeArc(cx, cy, r + 7, -Math.PI / 2, angleB)
              }
              fill="none"
              stroke="#f97316"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.75"
            />
          )}

          {/* Meeting Point Highlight Rings when meeting */}
          {isMeeting && (
            <g transform={`translate(${bx}, ${by})`}>
              <circle r="34" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.6" className="animate-ping" />
              <circle r="24" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" className="text-[10px] font-black fill-amber-900">
                만남!
              </text>
            </g>
          )}

          {/* Runner A Pin & Avatar (민우 - Blue) */}
          <g transform={`translate(${ax}, ${ay})`} filter="url(#glowA)">
            <circle r="14" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
            {/* Person icon simplified */}
            <circle cx="0" cy="-3" r="4" fill="#ffffff" />
            <path d="M -6 7 C -6 2, 6 2, 6 7 Z" fill="#ffffff" />
            {/* Runner A label badge */}
            <g transform="translate(0, -22)">
              <rect x="-26" y="-9" width="52" height="16" rx="4" fill="#1e40af" />
              <text x="0" y="3" textAnchor="middle" className="text-[9px] font-bold fill-white">
                A ({stateA.trackPositionMeters.toFixed(0)}m)
              </text>
            </g>
          </g>

          {/* Runner B Pin & Avatar (수연 - Orange) */}
          <g transform={`translate(${bx}, ${by})`} filter="url(#glowB)">
            <circle r="14" fill="#ea580c" stroke="#ffffff" strokeWidth="2.5" />
            {/* Person icon simplified */}
            <circle cx="0" cy="-3" r="4" fill="#ffffff" />
            <path d="M -6 7 C -6 2, 6 2, 6 7 Z" fill="#ffffff" />
            {/* Runner B label badge */}
            <g transform="translate(0, 24)">
              <rect x="-26" y="-8" width="52" height="16" rx="4" fill="#c2410c" />
              <text x="0" y="4" textAnchor="middle" className="text-[9px] font-bold fill-white">
                B ({stateB.trackPositionMeters.toFixed(0)}m)
              </text>
            </g>
          </g>

          {/* Compass / Direction indicator badge at bottom right */}
          <g transform="translate(440, 440)">
            <circle r="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <path
              d="M 0 -12 L 5 4 L 0 1 L -5 4 Z"
              fill={direction === 'same' ? '#3b82f6' : '#ea580c'}
              transform={direction === 'same' ? 'rotate(90)' : 'rotate(-90)'}
            />
            <text x="0" y="16" textAnchor="middle" className="text-[8px] font-bold fill-slate-500">
              {direction === 'same' ? '시계방향' : '마주보기'}
            </text>
          </g>
        </svg>
      </div>

      {/* Legend & Current Running Status Strip */}
      <div className="w-full grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-slate-100 text-xs">
        {/* Runner A Status */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 border border-blue-100">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white font-bold">
              A
            </span>
            <div>
              <span className="font-semibold text-blue-950">사람 A (느림)</span>
              <span className="text-blue-700 ml-1.5 tabular-nums">{speedA}m/분</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-blue-900 tabular-nums">
              {stateA.distance.toLocaleString(undefined, { maximumFractionDigits: 1 })}m
            </div>
            <div className="text-[11px] text-blue-600 tabular-nums">
              {stateA.laps}바퀴 + {Math.round(stateA.trackPositionMeters)}m
            </div>
          </div>
        </div>

        {/* Runner B Status */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50/70 border border-orange-100">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-orange-600 flex items-center justify-center text-[9px] text-white font-bold">
              B
            </span>
            <div>
              <span className="font-semibold text-orange-950">사람 B (빠름)</span>
              <span className="text-orange-700 ml-1.5 tabular-nums">{speedB}m/분</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-orange-900 tabular-nums">
              {stateB.distance.toLocaleString(undefined, { maximumFractionDigits: 1 })}m
            </div>
            <div className="text-[11px] text-orange-600 tabular-nums">
              {stateB.laps}바퀴 + {Math.round(stateB.trackPositionMeters)}m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
