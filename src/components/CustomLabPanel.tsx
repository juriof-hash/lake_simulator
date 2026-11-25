import React from 'react';
import { SimulationParams, DirectionMode } from '../types';
import { Sliders, RotateCcw, Sparkles } from 'lucide-react';

interface CustomLabPanelProps {
  params: SimulationParams;
  onUpdateParams: (newParams: Partial<SimulationParams>) => void;
  onResetOriginal: () => void;
}

export const CustomLabPanel: React.FC<CustomLabPanelProps> = ({
  params,
  onUpdateParams,
  onResetOriginal,
}) => {
  const speedDiff = Math.abs(params.speedB - params.speedA);
  const speedSum = params.speedA + params.speedB;
  const calculatedMeetingTime =
    params.direction === 'same'
      ? speedDiff > 0
        ? params.lakeCircumference / speedDiff
        : 0
      : speedSum > 0
      ? params.lakeCircumference / speedSum
      : 0;

  const presets = [
    {
      label: '원본 문제',
      desc: '1.5km, A=55, B=85 (같은방향)',
      values: { lakeCircumference: 1500, speedA: 55, speedB: 85, direction: 'same' as DirectionMode },
    },
    {
      label: '교과서 대표예제',
      desc: '1.2km, A=60, B=100 (같은방향)',
      values: { lakeCircumference: 1200, speedA: 60, speedB: 100, direction: 'same' as DirectionMode },
    },
    {
      label: '마주보기(반대방향)',
      desc: '1.5km, A=50, B=100 (반대방향)',
      values: { lakeCircumference: 1500, speedA: 50, speedB: 100, direction: 'opposite' as DirectionMode },
    },
    {
      label: '동네 호수공원',
      desc: '2.0km, A=70, B=120 (같은방향)',
      values: { lakeCircumference: 2000, speedA: 70, speedB: 120, direction: 'same' as DirectionMode },
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Sliders className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              수학 탐구실 (조건 직접 바꾸기)
            </h3>
            <p className="text-xs text-slate-500">
              호수의 둘레와 각 사람의 속력을 바꿔보며 일차방정식이 어떻게 달라지는지 관찰해보세요.
            </p>
          </div>
        </div>

        <button
          onClick={onResetOriginal}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
          title="문제 원본값(1.5km, 55m, 85m)으로 복원"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>원본값 리셋</span>
        </button>
      </div>

      {/* Preset Quick Buttons */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-slate-500 block mb-2">추천 탐구 프리셋</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onUpdateParams(preset.values)}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-900">
                {preset.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Lake Circumference */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">호수 둘레</label>
            <span className="text-xs font-extrabold text-indigo-700 tabular-nums">
              {params.lakeCircumference.toLocaleString()}m ({(params.lakeCircumference / 1000).toFixed(1)}km)
            </span>
          </div>
          <input
            type="range"
            min={600}
            max={3000}
            step={100}
            value={params.lakeCircumference}
            onChange={(e) => onUpdateParams({ lakeCircumference: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 tabular-nums">
            <span>600m</span>
            <span>1,500m (원본)</span>
            <span>3,000m</span>
          </div>
        </div>

        {/* Speed A */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-blue-900">사람 A 속력</label>
            <span className="text-xs font-extrabold text-blue-700 tabular-nums">
              {params.speedA} m/분
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={120}
            step={5}
            value={params.speedA}
            onChange={(e) => onUpdateParams({ speedA: Number(e.target.value) })}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
          />
          <div className="flex justify-between text-[10px] text-blue-400 mt-1 tabular-nums">
            <span>20m/분</span>
            <span>55m/분 (원본)</span>
            <span>120m/분</span>
          </div>
        </div>

        {/* Speed B */}
        <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200/80">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-orange-900">사람 B 속력</label>
            <span className="text-xs font-extrabold text-orange-700 tabular-nums">
              {params.speedB} m/분
            </span>
          </div>
          <input
            type="range"
            min={30}
            max={180}
            step={5}
            value={params.speedB}
            onChange={(e) => onUpdateParams({ speedB: Number(e.target.value) })}
            className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600 mt-2"
          />
          <div className="flex justify-between text-[10px] text-orange-400 mt-1 tabular-nums">
            <span>30m/분</span>
            <span>85m/분 (원본)</span>
            <span>180m/분</span>
          </div>
        </div>
      </div>

      {/* Real-time Equation & Solution Live Card */}
      <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-400 block mb-0.5">현재 설정된 일차방정식</span>
          <div className="text-base sm:text-lg font-mono font-bold text-amber-300">
            {params.direction === 'same'
              ? `|${params.speedB} - ${params.speedA}|x = ${params.lakeCircumference}  ⇒  ${speedDiff}x = ${params.lakeCircumference}`
              : `(${params.speedA} + ${params.speedB})x = ${params.lakeCircumference}  ⇒  ${speedSum}x = ${params.lakeCircumference}`}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-400 block mb-0.5">계산된 만남 시간</span>
          <div className="text-base sm:text-lg font-mono font-black text-emerald-300 tabular-nums">
            {speedDiff === 0 && params.direction === 'same' ? (
              <span className="text-rose-400 text-sm">속력이 같아 영원히 만나지 못함</span>
            ) : (
              <span>x = {calculatedMeetingTime.toFixed(1)}분 ({Math.floor(calculatedMeetingTime)}분 {Math.round((calculatedMeetingTime % 1) * 60)}초)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
