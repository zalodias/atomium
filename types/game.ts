import type { Difficulty } from '@/constants/difficulty';

export type PlayerStatus = 'idle' | 'ready';

export interface Team {
  id: string;
  name: string;
  status: PlayerStatus;
  isHost: boolean;
}

export interface Atom {
  element: string;
  count: number;
}

export interface Bond {
  from: number;
  to: number;
}

export interface MoleculeStructure {
  atoms: {
    element: string;
    x: number;
    y: number;
  }[];
  bonds: Bond[];
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  description: string;
  composition: Atom[];
  structure: MoleculeStructure;
  difficulty: Difficulty;
}

export type QuestionType = 'multiple_choice' | 'true_false';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  answer: string;
  options?: string[];
  difficulty: Difficulty;
}

export interface Answer {
  id: string;
  teamId: string;
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  answeredAt: string;
}

export interface Inventory {
  element: string;
  count: number;
}

export interface TeamProgress {
  team: Team;
  collected: number;
  total: number;
  percentage: number;
}

export interface GameState {
  id: string;
  code: string;
  difficulty: Difficulty;
  teams: Team[];
  hostId: string;
  currentTeamId: string;
  isStarted: boolean;
  isFinished: boolean;
  winnerId?: string;
  molecule?: Molecule;
  currentQuestion?: Question;
  questionStartedAt?: number;
  questionNumber: number;
  totalQuestions: number;
  teamInventories: Record<string, Inventory[]>;
  hasAnswered: boolean;
}

export interface GameContextValue {
  game: GameState | null;
  createGame: (teamName: string, difficulty: Difficulty) => Promise<string | null>;
  joinGame: (code: string, teamName: string) => Promise<boolean>;
  toggleReady: () => Promise<void>;
  startGame: () => Promise<void>;
  leaveGame: () => Promise<void>;
  loadNextQuestion: () => Promise<void>;
  submitAnswer: (answer: string, atomToAward?: string) => Promise<boolean>;
  getCurrentInventory: () => Inventory[];
  getAllTeamsProgress: () => TeamProgress[];
  isHost: boolean;
  currentTeam: Team | null;
  allReady: boolean;
  isLoading: boolean;
}
