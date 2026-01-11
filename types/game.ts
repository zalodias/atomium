import type { Difficulty } from '@/constants/difficulty';

export type PlayerStatus = 'idle' | 'ready';

export interface Team {
  id: string;
  name: string;
  status: PlayerStatus;
  isHost: boolean;
}

export interface GameState {
  id: string;
  code: string;
  difficulty: Difficulty;
  teams: Team[];
  hostId: string;
  currentTeamId: string;
  isStarted: boolean;
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
