import React from 'react';
import { FileText } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenOriginalModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onOpenOriginalModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('simulation');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
          >
            호수 둘레 일차방정식 시뮬레이터
          </a>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
          <button
            onClick={() => onTabChange('simulation')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'simulation'
                ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            원형 호수 시뮬레이션
          </button>
          <button
            onClick={() => onTabChange('linear')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'linear'
                ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            직선 펼쳐보기 원리
          </button>
          <button
            onClick={() => onTabChange('guide')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'guide'
                ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            방정식 단계별 풀이
          </button>
          <button
            onClick={() => onTabChange('quiz')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'quiz'
                ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            실전 퀴즈
          </button>
          <button
            onClick={() => onTabChange('lab')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'lab'
                ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            조건 변경 탐구실
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenOriginalModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>원본 문제 보기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
