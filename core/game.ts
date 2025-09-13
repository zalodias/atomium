export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyOption {
  id: DifficultyLevel;
  label: string;
}

export const difficultyOptions: DifficultyOption[] = [
  { id: 'easy', label: 'Fácil' },
  { id: 'medium', label: 'Médio' },
  { id: 'hard', label: 'Difícil' },
];

export const game = {
  defaultDifficulty: 'medium' as DifficultyLevel,
  minTeams: 2,
  maxTeams: 4,
  questionTimeLimit: 20,
} as const;
