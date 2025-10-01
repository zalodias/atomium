export type GameStatus = 'waiting' | 'playing' | 'finished';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface Player {
  name: string;
  isHost: boolean;
}

export interface Game {
  code: string;
  name: string;
  difficulty: GameDifficulty;
  createdAt: string;
  players: Player[];
  status: GameStatus;
}
