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

export interface GameState {
  id: string;
  code: string;
  difficulty: Difficulty;
  teams: Team[];
  hostId: string;
  currentTeamId: string;
  isStarted: boolean;
  molecule?: Molecule;
}

export interface GameContextValue {
  game: GameState | null;
  createGame: (teamName: string, difficulty: Difficulty) => Promise<string | null>;
  joinGame: (code: string, teamName: string) => Promise<boolean>;
  toggleReady: () => Promise<void>;
  startGame: () => Promise<void>;
  leaveGame: () => Promise<void>;
  isHost: boolean;
  currentTeam: Team | null;
  allReady: boolean;
  isLoading: boolean;
}
