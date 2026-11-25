export type DirectionMode = 'same' | 'opposite';

export interface SimulationParams {
  lakeCircumference: number; // in meters (default 1500)
  speedA: number; // in m/min (default 55)
  speedB: number; // in m/min (default 85)
  direction: DirectionMode; // 'same' | 'opposite'
}

export interface RunnerState {
  distance: number; // total meters covered
  laps: number; // integer laps completed
  lapProgress: number; // 0 to 1 representing position along the current lap
  trackPositionMeters: number; // 0 to lakeCircumference
  angleRad: number; // 0 to 2*PI radians on the circular track
}

export interface QuizQuestion {
  id: number;
  badge: string;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  presetParams?: Partial<SimulationParams>;
}
