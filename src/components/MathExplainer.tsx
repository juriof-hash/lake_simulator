import React, { useState } from 'react';
import { DirectionMode } from '../types';
import { BookOpen, CheckCircle, HelpCircle, ArrowRight, Lightbulb, Calculator } from 'lucide-react';

interface MathExplainerProps {
  circumference: number;
  speedA: number;
  speedB: number;
  direction: DirectionMode;
  meetingTime: number;
}

export const MathExplainer: React.FC<MathExplainerProps> = ({
  circumference,
  speedA,
  speedB,
  direction,
  meetingTime,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const speedDiff = Math.abs(speedB - speedA);
  const speedSum = speedA + speedB;

  const distAAtMeeting = speedA * meetingTime;
  const distBAtMeeting = speedB * meetingTime;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              중1 수학 일차방정식 개념 완성 가이드
            </h2>
            <p className="text-xs text-slate-500">
              거리·속력·시간(거·속·시) 호수 둘레 문제를 4단계로 완벽 정복하기
            </p>
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setActiveStep(step)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                activeStep === step
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      {/* Step Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl mb-6 text-xs">
        <button
          onClick={() => setActiveStep(1)}
          className={`py-2 px-1 text-center font-semibold rounded-lg transition-colors truncate ${
            activeStep === 1 ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1단계: 단위 통일
        </button>
        <button
          onClick={() => setActiveStep(2)}
          className={`py-2 px-1 text-center font-semibold rounded-lg transition-colors truncate ${
            activeStep === 2 ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2단계: 거·속·시 표
        </button>
        <button
          onClick={() => setActiveStep(3)}
          className={`py-2 px-1 text-center font-semibold rounded-lg transition-colors truncate ${
            activeStep === 3 ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3단계: 핵심 원리
        </button>
        <button
          onClick={() => setActiveStep(4)}
          className={`py-2 px-1 text-center font-semibold rounded-lg transition-colors truncate ${
            activeStep === 4 ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          4단계: 풀이 & 검산
        </button>
      </div>

      {/* Step Contents */}
      {activeStep === 1 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-950 mb-1">
                  💡 가장 많은 학생들이 실수하는 포인트: 단위 불일치!
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  A와 B의 속력 단위는 <strong>분속 m (m/분)</strong>인데, 호수의 둘레는 <strong>1.5km</strong>로 주어졌습니다.
                  단위가 다르면 계산할 수 없으므로 반드시 <strong>m(미터)</strong>로 통일해야 합니다!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block mb-1">호수 둘레 단위 변환</span>
              <div className="text-lg font-black text-slate-900">
                1.5km = <span className="text-indigo-600">1,500m</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">1km = 1,000m 이므로 1.5 × 1,000 = 1,500m</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block mb-1">미지수 x 설정하기</span>
              <div className="text-lg font-black text-slate-900">
                출발한 지 <span className="text-indigo-600">x분</span> 후 만남
              </div>
              <p className="text-xs text-slate-500 mt-1">문제에서 구하고자 하는 시간을 x(분)으로 둡니다.</p>
            </div>
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            일차방정식 활용 문제의 핵심 공식인 <strong>거리 = 속력 × 시간</strong> 공식을 이용하여 표로 정리합니다.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="py-2.5 px-3">구분</th>
                  <th className="py-2.5 px-3">속력 (m/분)</th>
                  <th className="py-2.5 px-3">시간 (분)</th>
                  <th className="py-2.5 px-3 text-indigo-700 bg-indigo-50/50">이동 거리 (m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>사람 A</span>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">{speedA}m/분</td>
                  <td className="py-2.5 px-3 tabular-nums">x 분</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700 bg-indigo-50/30 tabular-nums">
                    {speedA}x m
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                    <span>사람 B (빠름)</span>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">{speedB}m/분</td>
                  <td className="py-2.5 px-3 tabular-nums">x 분</td>
                  <td className="py-2.5 px-3 font-bold text-orange-700 bg-indigo-50/30 tabular-nums">
                    {speedB}x m
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl text-xs text-indigo-900 border border-indigo-100 flex items-center gap-2">
            <span className="font-bold shrink-0">기억 공식:</span>
            <span>거리 = 속력 × 시간 ｜ 속력 = 거리 ÷ 시간 ｜ 시간 = 거리 ÷ 속력</span>
          </div>
        </div>
      )}

      {activeStep === 3 && (
        <div className="space-y-4">
          {direction === 'same' ? (
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <h4 className="text-sm font-bold text-blue-950 mb-2 flex items-center gap-1.5">
                <span>🔄 같은 방향으로 돌 때: 왜 두 사람의 거리의 차가 1바퀴일까?</span>
              </h4>
              <div className="space-y-2 text-xs text-blue-900 leading-relaxed">
                <p>
                  1. 같은 지점에서 동시에 출발하면, 속력이 빠른 B({speedB}m/분)가 느린 A({speedA}m/분)를 앞서 달립니다.
                </p>
                <p>
                  2. 호수는 둥근 트랙이므로, <strong>빠른 B가 A의 뒤를 돌아와 다시 만나려면(따라잡으려면)</strong> 느린 A보다 <strong>정확히 호수 한 바퀴(1,500m)를 더 달려야</strong> 합니다.
                </p>
                <p className="font-bold text-blue-950 pt-1">
                  따라서 방정식 조건: (B가 달린 거리) - (A가 달린 거리) = (호수의 둘레)
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
              <h4 className="text-sm font-bold text-purple-950 mb-2 flex items-center gap-1.5">
                <span>↔️ 반대 방향으로 돌 때: 왜 두 사람의 거리의 합이 1바퀴일까?</span>
              </h4>
              <div className="space-y-2 text-xs text-purple-900 leading-relaxed">
                <p>
                  1. 같은 지점에서 서로 반대 방향으로 출발하면, 두 사람은 서로를 향해 마주보고 달립니다.
                </p>
                <p>
                  2. 두 사람이 호숫가 어느 지점에서 처음 마주칠 때까지, <strong>A가 달린 거리와 B가 달린 거리를 합치면 정확히 호수 전체 둘레(1,500m)</strong>가 됩니다.
                </p>
                <p className="font-bold text-purple-950 pt-1">
                  따라서 방정식 조건: (A가 달린 거리) + (B가 달린 거리) = (호수의 둘레)
                </p>
              </div>
            </div>
          )}

          {/* Equation Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 block mb-1">세워지는 일차방정식</span>
              <div className="text-xl font-mono font-bold text-amber-300">
                {direction === 'same'
                  ? `${speedB}x - ${speedA}x = ${circumference}`
                  : `${speedA}x + ${speedB}x = ${circumference}`}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block mb-1">동류항 정리</span>
              <div className="text-lg font-mono font-bold text-emerald-300">
                {direction === 'same'
                  ? `${speedDiff}x = ${circumference}`
                  : `${speedSum}x = ${circumference}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeStep === 4 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <h4 className="text-sm font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-700" />
              <span>방정식 계산 및 정답 도출</span>
            </h4>

            {direction === 'same' ? (
              <div className="font-mono text-xs sm:text-sm text-emerald-900 space-y-1.5 bg-white p-3 rounded-lg border border-emerald-100">
                <div>85x - 55x = 1500</div>
                <div>30x = 1500</div>
                <div className="text-base font-bold text-indigo-700">
                  x = 1500 / 30 = 50 (분)
                </div>
              </div>
            ) : (
              <div className="font-mono text-xs sm:text-sm text-emerald-900 space-y-1.5 bg-white p-3 rounded-lg border border-emerald-100">
                <div>55x + 85x = 1500</div>
                <div>140x = 1500</div>
                <div className="text-base font-bold text-indigo-700">
                  x = 1500 / 140 = 75 / 7 분 ≈ {meetingTime.toFixed(2)}분 (약 10분 43초)
                </div>
              </div>
            )}
          </div>

          {/* Verification Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>검산하기 (50분 후 두 사람의 위치 확인)</span>
            </h5>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>
                • <strong>사람 A의 이동거리:</strong> 55m/분 × 50분 ={' '}
                <strong className="text-slate-900">2,750m</strong> (1,500m × 1바퀴 +{' '}
                <span className="text-blue-600 font-bold">1,250m</span> 지점)
              </li>
              <li>
                • <strong>사람 B의 이동거리:</strong> 85m/분 × 50분 ={' '}
                <strong className="text-slate-900">4,250m</strong> (1,500m × 2바퀴 +{' '}
                <span className="text-orange-600 font-bold">1,250m</span> 지점)
              </li>
              <li className="pt-1 text-slate-800">
                👉 두 사람 모두 출발점에서 <strong>1,250m 떨어진 같은 지점</strong>에 위치하므로,{' '}
                <span className="text-emerald-700 font-bold">정답이 참임을 완벽하게 검증</span>할 수 있습니다!
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Footer step controls */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
        <button
          onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
          disabled={activeStep === 1}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
        >
          이전 단계
        </button>
        <span className="text-slate-400">
          {activeStep} / 4 단계
        </span>
        <button
          onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
          disabled={activeStep === 4}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors"
        >
          다음 단계
        </button>
      </div>
    </div>
  );
};
