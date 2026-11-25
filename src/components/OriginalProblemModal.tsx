import React from 'react';
import { X, FileText, CheckCircle, RotateCcw } from 'lucide-react';

interface OriginalProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetToOriginal: () => void;
}

export const OriginalProblemModal: React.FC<OriginalProblemModalProps> = ({
  isOpen,
  onClose,
  onResetToOriginal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">원본 문제 확인</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Problem Image from user upload */}
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-2">
              업로드된 원본 문제 이미지
            </span>
            <div className="rounded-xl border border-slate-200 p-2 bg-slate-50 flex justify-center">
              <img
                src="/assets/aistudio/image_7cfd84f1.png"
                alt="중학교 1학년 일차방정식 호수 둘레 문제"
                className="max-h-48 object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Transcribed Text */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-800">02</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                실력(중)
              </span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              둘레의 길이가 <strong>1.5km</strong>인 호숫가의 어느 한 지점에서 <strong>A, B</strong> 두 사람이{' '}
              <strong>같은 방향</strong>으로 <strong>동시에 출발</strong>하였다. A는 매분{' '}
              <strong>55m</strong>, B는 매분 <strong>85m</strong>의 속력으로 걷는다면 두 사람은 출발한 지{' '}
              <strong>몇 분 후에 처음으로 만나는지</strong> 구하시오.
            </p>
          </div>

          {/* Key Facts Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100">
              <span className="text-indigo-600 block text-[11px]">호수 둘레</span>
              <span className="font-bold text-indigo-950">1.5km (1,500m)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
              <span className="text-blue-600 block text-[11px]">사람 A 속력</span>
              <span className="font-bold text-blue-950">55 m/분</span>
            </div>
            <div className="p-2.5 rounded-lg bg-orange-50/60 border border-orange-100">
              <span className="text-orange-600 block text-[11px]">사람 B 속력</span>
              <span className="font-bold text-orange-950">85 m/분</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <span className="text-emerald-600 block text-[11px]">정답</span>
              <span className="font-bold text-emerald-950">50분 후</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => {
              onResetToOriginal();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>시뮬레이터를 이 문제 조건으로 맞추기</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
