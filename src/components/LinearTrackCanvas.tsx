import React from 'react';
import { RunnerState, DirectionMode } from '../types';
import { Ruler, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LinearTrackCanvasProps {
  circumference: number;
  time: number;
  speedA: number;
  speedB: number;
  direction: DirectionMode;
  stateA: RunnerState;
  stateB: RunnerState;
  isMeeting: boolean;
  meetingTime: number;
}

export const LinearTrackCanvas: React.FC<LinearTrackCanvasProps> = ({
  circumference,
  time,
  speedA,
  speedB,
  direction,
  stateA,
  stateB,
  isMeeting,
  meetingTime,
}) => {
  // Max distance to display on the linear ruler: at least 3 laps or up to current max + buffer
  const maxLaps = Math.max(3.2, Math.ceil(Math.max(stateA.distance, stateB.distance) / circumference) + 0.5);
  const totalScaleMeters = maxLaps * circumference;

  // Percentage positioning on the ruler
  const getPercent = (dist: number) => {
    return Math.min(100, Math.max(0, (dist / totalScaleMeters) * 100));
  };

  const pctA = getPercent(stateA.distance);
  const pctB = getPercent(stateB.distance);

  // Lap markers on the ruler (1 lap, 2 laps, 3 laps...)
  const lapsToMark = Array.from({ length: Math.floor(maxLaps) + 1 }, (_, i) => i);

  // Difference in distance
  const diffDistance = Math.abs(stateB.distance - stateA.distance);
  const sumDistance = stateA.distance + stateB.distance;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Ruler className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              직선으로 펼쳐보는 원리 (Unrolling View)
            </h3>
            <p className="text-xs text-slate-500">
              {direction === 'same'
                ? '원형 호수를 직선으로 펴면, 빠른 B가 느린 A보다 정확히 1바퀴(1,500m)를 더 달릴 때 따라잡습니다!'
                : '마주보고 달리면, 두 사람이 달린 거리의 합이 호수 1바퀴(1,500m)가 될 때 마주칩니다!'}
            </p>
          </div>
        </div>

        {isMeeting && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>방정식 일치 ({time.toFixed(1)}분)</span>
          </span>
        )}
      </div>

      {/* Visual Unrolled Tracks */}
      <div className="space-y-6 pt-2 pb-4">
        {/* Track B (Faster Runner) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2 font-semibold text-orange-950">
              <span className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold">
                B
              </span>
              <span>사람 B 이동 거리</span>
              <span className="text-orange-600 font-normal">
                (속력 {speedB}m/분 × {time.toFixed(1)}분)
              </span>
            </div>
            <div className="font-bold text-orange-800 tabular-nums text-sm">
              {stateB.distance.toLocaleString(undefined, { maximumFractionDigits: 1 })}m
              <span className="text-xs font-normal text-slate-500 ml-1.5">
                ({(stateB.distance / circumference).toFixed(2)} 바퀴)
              </span>
            </div>
          </div>

          <div className="relative h-7 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            {/* Lap lines background */}
            {lapsToMark.map((lap) => {
              const xPos = getPercent(lap * circumference);
              return (
                <div
                  key={lap}
                  style={{ left: `${xPos}%` }}
                  className="absolute top-0 bottom-0 w-px bg-slate-300 z-10"
                />
              );
            })}
            {/* Filled bar for Runner B */}
            <div
              style={{ width: `${pctB}%` }}
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-150 relative"
            >
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-xs border-2 border-orange-600" />
            </div>
          </div>
        </div>

        {/* Track A (Slower Runner) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2 font-semibold text-blue-950">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                A
              </span>
              <span>사람 A 이동 거리</span>
              <span className="text-blue-600 font-normal">
                (속력 {speedA}m/분 × {time.toFixed(1)}분)
              </span>
            </div>
            <div className="font-bold text-blue-800 tabular-nums text-sm">
              {stateA.distance.toLocaleString(undefined, { maximumFractionDigits: 1 })}m
              <span className="text-xs font-normal text-slate-500 ml-1.5">
                ({(stateA.distance / circumference).toFixed(2)} 바퀴)
              </span>
            </div>
          </div>

          <div className="relative h-7 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            {/* Lap lines background */}
            {lapsToMark.map((lap) => {
              const xPos = getPercent(lap * circumference);
              return (
                <div
                  key={lap}
                  style={{ left: `${xPos}%` }}
                  className="absolute top-0 bottom-0 w-px bg-slate-300 z-10"
                />
              );
            })}
            {/* Filled bar for Runner A */}
            <div
              style={{ width: `${pctA}%` }}
              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-150 relative"
            >
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-xs border-2 border-blue-600" />
            </div>
          </div>
        </div>

        {/* Ruler Axis & Lap Indicators */}
        <div className="relative pt-1">
          <div className="h-2 border-t border-slate-300 relative">
            {lapsToMark.map((lap) => {
              const xPos = getPercent(lap * circumference);
              return (
                <div
                  key={lap}
                  style={{ left: `${xPos}%` }}
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                >
                  <div className="w-px h-2 bg-slate-400" />
                  <span className="text-[10px] font-medium text-slate-500 mt-0.5 tabular-nums">
                    {lap === 0 ? '0m' : `${(lap * circumference).toLocaleString()}m`}
                  </span>
                  <span className="text-[9px] text-indigo-600 font-bold">
                    {lap === 0 ? '출발선' : `${lap}바퀴`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gap & Equation Visual Comparison Bracket */}
        {direction === 'same' ? (
          <div className="mt-8 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  거리의 차 = (B의 거리) - (A의 거리)
                </span>
                <span className="text-xs text-amber-800">
                  {stateB.distance.toFixed(1)}m - {stateA.distance.toFixed(1)}m ={' '}
                  <strong className="text-sm font-extrabold text-amber-950 tabular-nums">
                    {diffDistance.toFixed(1)}m
                  </strong>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-amber-700 block">
                  목표 1바퀴 ({circumference.toLocaleString()}m)까지
                </span>
                <span className="text-xs font-bold text-amber-900 tabular-nums">
                  {diffDistance >= circumference ? (
                    <span className="text-emerald-700 font-bold">
                      🎉 1바퀴 따라잡음 완료! ({diffDistance.toFixed(1)}m)
                    </span>
                  ) : (
                    <span>{(circumference - diffDistance).toFixed(1)}m 남음</span>
                  )}
                </span>
              </div>
            </div>

            {/* Visual progress toward 1 circumference gap */}
            <div className="w-full h-2.5 bg-amber-200/70 rounded-full mt-2.5 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (diffDistance / circumference) * 100)}%` }}
                className={`h-full transition-all duration-150 ${
                  diffDistance >= circumference ? 'bg-emerald-500' : 'bg-amber-600'
                }`}
              />
            </div>
          </div>
        ) : (
          <div className="mt-8 p-3.5 rounded-xl bg-purple-50/80 border border-purple-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-purple-900 block">
                  거리의 합 = (A의 거리) + (B의 거리)
                </span>
                <span className="text-xs text-purple-800">
                  {stateA.distance.toFixed(1)}m + {stateB.distance.toFixed(1)}m ={' '}
                  <strong className="text-sm font-extrabold text-purple-950 tabular-nums">
                    {sumDistance.toFixed(1)}m
                  </strong>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-purple-700 block">
                  목표 1바퀴 ({circumference.toLocaleString()}m)까지
                </span>
                <span className="text-xs font-bold text-purple-900 tabular-nums">
                  {sumDistance >= circumference ? (
                    <span className="text-emerald-700 font-bold">
                      🎉 마주침 달성! ({sumDistance.toFixed(1)}m)
                    </span>
                  ) : (
                    <span>{(circumference - sumDistance).toFixed(1)}m 남음</span>
                  )}
                </span>
              </div>
            </div>

            {/* Visual progress toward 1 circumference sum */}
            <div className="w-full h-2.5 bg-purple-200/70 rounded-full mt-2.5 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (sumDistance / circumference) * 100)}%` }}
                className={`h-full transition-all duration-150 ${
                  sumDistance >= circumference ? 'bg-emerald-500' : 'bg-purple-600'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
