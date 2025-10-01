import { GameDifficulty } from '@/types/game';

export interface DifficultyOption {
  id: GameDifficulty;
  label: string;
}

export const difficultyOptions: DifficultyOption[] = [
  { id: 'easy', label: 'Fácil' },
  { id: 'medium', label: 'Médio' },
  { id: 'hard', label: 'Difícil' },
];

export const game = {
  defaultDifficulty: 'medium' as GameDifficulty,
  minTeams: 2,
  maxTeams: 4,
  questionTimeLimit: 20,
} as const;
