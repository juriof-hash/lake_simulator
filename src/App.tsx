import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SimulationParams, DirectionMode, RunnerState } from './types';
import { TopBar } from './components/TopBar';
import { LakeCanvas } from './components/LakeCanvas';
import { LinearTrackCanvas } from './components/LinearTrackCanvas';
import { ControlDeck } from './components/ControlDeck';
import { MathExplainer } from './components/MathExplainer';
import { CustomLabPanel } from './components/CustomLabPanel';
import { QuizSection } from './components/QuizSection';
import { OriginalProblemModal } from './components/OriginalProblemModal';
import { Compass, Eye, RefreshCw, Award } from 'lucide-react';

const DEFAULT_PARAMS: SimulationParams = {
  lakeCircumference: 1500, // 1.5km = 1,500m
  speedA: 55, // 55 m/min
  speedB: 85, // 85 m/min
  direction: 'same',
};

export default function App() {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [time, setTime] = useState<number>(0); // in minutes
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(5); // 5x speed default for pleasant visual pace
  const [viewMode, setViewMode] = useState<'lake' | 'linear' | 'split'>('lake');
  const [activeTab, setActiveTab] = useState<string>('simulation');
  const [isOriginalModalOpen, setIsOriginalModalOpen] = useState<boolean>(false);
  const [hasCelebratedMeeting, setHasCelebratedMeeting] = useState<boolean>(false);

  // Speed difference and meeting time calculation
  const speedDiff = Math.abs(params.speedB - params.speedA);
  const speedSum = params.speedA + params.speedB;

  const meetingTime = useMemo(() => {
    if (params.direction === 'same') {
      return speedDiff > 0 ? params.lakeCircumference / speedDiff : 0;
    } else {
      return speedSum > 0 ? params.lakeCircumference / speedSum : 0;
    }
  }, [params, speedDiff, speedSum]);

  // Max simulation time
  const maxTime = useMemo(() => {
    return Math.max(60, Math.ceil(meetingTime * 1.25));
  }, [meetingTime]);

  // Animation frame loop for smooth playback
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current != null) {
        const deltaMs = timestamp - lastTimeRef.current;
        // In this simulation: 1 second of real time corresponds to (playbackSpeed / 2) minutes
        const deltaMinutes = (deltaMs / 1000) * (playbackSpeed / 2);

        setTime((prev) => {
          const next = prev + deltaMinutes;

          // If we reach or cross meetingTime for the first time while playing, pause briefly to emphasize
          if (prev < meetingTime && next >= meetingTime) {
            setIsPlaying(false);
            setHasCelebratedMeeting(true);
            return meetingTime;
          }

          if (next >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }
          return next;
        });
      }
      lastTimeRef.current = timestamp;
      if (isPlaying) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      lastTimeRef.current = null;
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, playbackSpeed, meetingTime, maxTime]);

  // Calculate runner states
  const stateA: RunnerState = useMemo(() => {
    const dist = params.speedA * time;
    const laps = Math.floor(dist / params.lakeCircumference);
    const lapProgress = (dist % params.lakeCircumference) / params.lakeCircumference;
    const trackPositionMeters = dist % params.lakeCircumference;
    const angleRad = -Math.PI / 2 + lapProgress * 2 * Math.PI;

    return {
      distance: dist,
      laps,
      lapProgress,
      trackPositionMeters,
      angleRad,
    };
  }, [params.speedA, params.lakeCircumference, time]);

  const stateB: RunnerState = useMemo(() => {
    const dist = params.speedB * time;
    const laps = Math.floor(dist / params.lakeCircumference);
    const lapProgress = (dist % params.lakeCircumference) / params.lakeCircumference;
    const trackPositionMeters = dist % params.lakeCircumference;
    const angleRad =
      params.direction === 'opposite'
        ? -Math.PI / 2 - lapProgress * 2 * Math.PI
        : -Math.PI / 2 + lapProgress * 2 * Math.PI;

    return {
      distance: dist,
      laps,
      lapProgress,
      trackPositionMeters,
      angleRad,
    };
  }, [params.speedB, params.lakeCircumference, params.direction, time]);

  const isMeeting = Math.abs(time - meetingTime) < 0.2 && meetingTime > 0;

  // Handlers
  const handleTogglePlay = () => setIsPlaying((prev) => !prev);
  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };
  const handleJumpToMeeting = () => {
    setIsPlaying(false);
    setTime(meetingTime);
    setHasCelebratedMeeting(true);
  };

  const handleUpdateParams = (newParams: Partial<SimulationParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
    setTime(0);
    setIsPlaying(false);
  };

  const handleResetToOriginal = () => {
    setParams(DEFAULT_PARAMS);
    setTime(0);
    setIsPlaying(false);
  };

  const handleApplyQuizToSim = (quizParams: Partial<SimulationParams>) => {
    setParams((prev) => ({ ...prev, ...quizParams }));
    setTime(0);
    setIsPlaying(false);
    setActiveTab('simulation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar with Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'simulation') setViewMode('lake');
          if (tab === 'linear') {
            setActiveTab('simulation');
            setViewMode('linear');
          }
        }}
        onOpenOriginalModal={() => setIsOriginalModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Editorial Subtitle & Context Header */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              {/* Unboxed clean metadata (Zero-pill compliant) */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>중학교 1학년 수학</span>
                <span aria-hidden="true">·</span>
                <span>일차방정식의 활용</span>
                <span aria-hidden="true">·</span>
                <span>거리·속력·시간 호수 둘레 문제</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight text-balance">
                둘레 1.5km 호숫가에서 A, B 두 사람의 첫 만남 시뮬레이터
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed font-medium">
                둘레의 길이가 <strong className="text-slate-900">1.5km</strong>인 호숫가의 어느 한 지점에서{' '}
                <strong className="text-slate-900">A, B</strong> 두 사람이{' '}
                <strong className="text-slate-900">같은 방향</strong>으로 동시에 출발하였다. A는 매분{' '}
                <strong className="text-slate-900">55m</strong>, B는 매분{' '}
                <strong className="text-slate-900">85m</strong>의 속력으로 걷는다면 두 사람은 출발한 지{' '}
                <strong className="text-slate-900">몇 분 후에 처음으로 만나는지</strong> 구하시오.
              </p>
            </div>
          </div>
        </section>

        {/* Meeting Celebration Banner (when meeting occurs) */}
        {isMeeting && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
                <Award className="w-6 h-6 text-yellow-200" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold">
                  🎉 출발 {time.toFixed(1)}분 후! 두 사람이 처음으로 만났습니다!
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  {params.direction === 'same' ? (
                    <>
                      빠른 B(총 {stateB.distance.toLocaleString()}m, 2바퀴+1,250m)가 느린 A(총{' '}
                      {stateA.distance.toLocaleString()}m, 1바퀴+1,250m)보다{' '}
                      <strong>정확히 호수 1바퀴(1,500m)를 더 달렸습니다.</strong>
                    </>
                  ) : (
                    <>
                      A({stateA.distance.toFixed(0)}m)와 B({stateB.distance.toFixed(0)}m)가 달린
                      거리의 합이 <strong>호수 전체 둘레(1,500m)</strong>가 되었습니다!
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleReset()}
              className="shrink-0 px-3 py-1.5 bg-white text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-50 transition-colors shadow-xs"
            >
              다시 확인하기
            </button>
          </div>
        )}

        {/* View Mode Segmented Controls for Canvas */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
            <button
              onClick={() => setViewMode('lake')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === 'lake'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>원형 호수 뷰</span>
            </button>

            <button
              onClick={() => setViewMode('linear')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === 'linear'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>직선 펼쳐보기 뷰</span>
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>나란히 비교</span>
            </button>
          </div>
        </div>

        {/* Visual Simulation Canvas Area */}
        <section>
          {viewMode === 'lake' && (
            <LakeCanvas
              circumference={params.lakeCircumference}
              time={time}
              speedA={params.speedA}
              speedB={params.speedB}
              direction={params.direction}
              stateA={stateA}
              stateB={stateB}
              isMeeting={isMeeting}
              meetingTime={meetingTime}
              onJumpToMeeting={handleJumpToMeeting}
            />
          )}

          {viewMode === 'linear' && (
            <LinearTrackCanvas
              circumference={params.lakeCircumference}
              time={time}
              speedA={params.speedA}
              speedB={params.speedB}
              direction={params.direction}
              stateA={stateA}
              stateB={stateB}
              isMeeting={isMeeting}
              meetingTime={meetingTime}
            />
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <LakeCanvas
                circumference={params.lakeCircumference}
                time={time}
                speedA={params.speedA}
                speedB={params.speedB}
                direction={params.direction}
                stateA={stateA}
                stateB={stateB}
                isMeeting={isMeeting}
                meetingTime={meetingTime}
                onJumpToMeeting={handleJumpToMeeting}
              />
              <LinearTrackCanvas
                circumference={params.lakeCircumference}
                time={time}
                speedA={params.speedA}
                speedB={params.speedB}
                direction={params.direction}
                stateA={stateA}
                stateB={stateB}
                isMeeting={isMeeting}
                meetingTime={meetingTime}
              />
            </div>
          )}
        </section>

        {/* Control Deck for Playback, Scrubbing, and Direction */}
        <section>
          <ControlDeck
            time={time}
            maxTime={maxTime}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            direction={params.direction}
            meetingTime={meetingTime}
            onTimeChange={(t) => {
              setIsPlaying(false);
              setTime(t);
            }}
            onTogglePlay={handleTogglePlay}
            onReset={handleReset}
            onSpeedChange={setPlaybackSpeed}
            onDirectionChange={(mode) => {
              handleUpdateParams({ direction: mode });
            }}
            onJumpToMeeting={handleJumpToMeeting}
          />
        </section>

        {/* Pedagogical Sections: Step-by-step Math Derivation, Custom Lab & Quiz */}
        <section className="space-y-6 pt-2">
          {/* Section 1: Step-by-step Math Explainer */}
          <MathExplainer
            circumference={params.lakeCircumference}
            speedA={params.speedA}
            speedB={params.speedB}
            direction={params.direction}
            meetingTime={meetingTime}
          />

          {/* Section 2: Custom Variable Sandbox */}
          <CustomLabPanel
            params={params}
            onUpdateParams={handleUpdateParams}
            onResetOriginal={handleResetToOriginal}
          />

          {/* Section 3: Interactive Practice Quiz */}
          <QuizSection onApplyQuizToSim={handleApplyQuizToSim} />
        </section>
      </main>

      {/* Original Problem Modal */}
      <OriginalProblemModal
        isOpen={isOriginalModalOpen}
        onClose={() => setIsOriginalModalOpen(false)}
        onResetToOriginal={handleResetToOriginal}
      />

      {/* Editorial Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>중학교 1학년 일차방정식의 활용 인터랙티브 시뮬레이터</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>거리 = 속력 × 시간 (거·속·시)</span>
          </div>
          <button
            onClick={handleResetToOriginal}
            className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>시뮬레이터 초기 상태로 리셋</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
