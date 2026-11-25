import React, { useState } from 'react';
import { QuizQuestion, SimulationParams } from '../types';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, PlayCircle } from 'lucide-react';

interface QuizSectionProps {
  onApplyQuizToSim: (params: Partial<SimulationParams>) => void;
}

const quizList: QuizQuestion[] = [
  {
    id: 1,
    badge: '개념 확인',
    title: '원본 문제의 올바른 일차방정식 찾기',
    question:
      '둘레의 길이가 1.5km인 호수에서 A(55m/분), B(85m/분) 두 사람이 같은 방향으로 동시에 출발했습니다. x분 후 처음으로 만난다고 할 때 옳은 일차방정식은?',
    options: [
      '85x - 55x = 1.5 (단위 미변환)',
      '85x - 55x = 1500 (정답)',
      '85x + 55x = 1500 (반대 방향 식)',
      '85x + 55x = 1.5 (단위 미변환 및 반대 방향)',
    ],
    correctAnswer: 1,
    explanation:
      '속력 단위가 분속 m이므로 호수 둘레 1.5km를 1,500m로 바꾸어야 합니다. 또한 같은 방향으로 돌 때는 빠른 사람이 1바퀴를 더 돌아야 만나므로 (B의 거리) - (A의 거리) = (둘레) 인 85x - 55x = 1500 이 올바릅니다.',
    presetParams: { lakeCircumference: 1500, speedA: 55, speedB: 85, direction: 'same' },
  },
  {
    id: 2,
    badge: '유형 확장',
    title: '반대 방향으로 마주보고 달릴 때',
    question:
      '둘레 1.5km인 호수에서 A(55m/분)와 B(85m/분)가 서로 ‘반대 방향’으로 동시에 출발한다면 처음 만나는 시간은 약 몇 분 후일까요?',
    options: [
      '약 10.7분 (10분 43초)',
      '30분',
      '50분',
      '25분',
    ],
    correctAnswer: 0,
    explanation:
      '반대 방향으로 달릴 때는 두 사람이 달린 거리의 합이 호수 1바퀴(1,500m)가 될 때 마주칩니다. 55x + 85x = 1500 ⇒ 140x = 1500 ⇒ x = 75/7 ≈ 10.71분 (10분 43초) 후에 만납니다.',
    presetParams: { lakeCircumference: 1500, speedA: 50, speedB: 100, direction: 'opposite' },
  },
  {
    id: 3,
    badge: '실전 기출',
    title: '둘레 2,400m 호수 트랙 문제',
    question:
      '둘레의 길이가 2,400m인 호숫가에서 민우(60m/분)와 지은(100m/분)이가 같은 방향으로 동시에 출발했습니다. 두 사람이 처음으로 다시 만나는 시간은?',
    options: [
      '40분 후',
      '60분 후',
      '15분 후',
      '24분 후',
    ],
    correctAnswer: 1,
    explanation:
      '같은 방향이므로 (지은의 거리) - (민우의 거리) = 2,400m 입니다. 100x - 60x = 2400 ⇒ 40x = 2400 ⇒ x = 60분 후 처음으로 다시 만납니다.',
    presetParams: { lakeCircumference: 2400, speedA: 60, speedB: 100, direction: 'same' },
  },
];

export const QuizSection: React.FC<QuizSectionProps> = ({ onApplyQuizToSim }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setShowResults((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      <div className="pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <HelpCircle className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              실전 퀴즈 & 개념 점검
            </h3>
            <p className="text-xs text-slate-500">
              문제를 풀고 ‘시뮬레이터로 확인’ 버튼을 누르면 직접 눈으로 검증할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {quizList.map((quiz, qIdx) => {
          const isAnswered = showResults[quiz.id];
          const chosen = selectedAnswers[quiz.id];
          const isCorrect = chosen === quiz.correctAnswer;

          return (
            <div
              key={quiz.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                    Q{qIdx + 1}. {quiz.badge}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800">{quiz.title}</h4>
                </div>

                {isAnswered && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>정답!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>다시 생각해보기</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question Body */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {quiz.question}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {quiz.options.map((opt, oIdx) => {
                  let optStyle =
                    'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-700';

                  if (isAnswered) {
                    if (oIdx === quiz.correctAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (chosen === oIdx) {
                      optStyle = 'border-rose-300 bg-rose-50 text-rose-800 font-medium';
                    } else {
                      optStyle = 'border-slate-200 bg-white opacity-60 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(quiz.id, oIdx)}
                      className={`p-3 text-left rounded-xl border text-xs transition-all flex items-start gap-2.5 ${optStyle}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        {oIdx + 1}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Simulator Launcher */}
              {isAnswered && (
                <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block mb-0.5">📝 해설:</strong>
                    {quiz.explanation}
                  </div>

                  {quiz.presetParams && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => quiz.presetParams && onApplyQuizToSim(quiz.presetParams)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>이 조건으로 시뮬레이터에서 직접 확인하기</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
