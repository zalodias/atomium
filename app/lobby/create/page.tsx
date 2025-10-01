'use client';

import { Atomium } from '@/assets/atomium';
import { Container } from '@/components/container';
import { difficultyOptions, game } from '@/config/game';
import { Game, GameDifficulty } from '@/types/game';
import { generateGameCode } from '@/utils/utils';
import Link from 'next/link';
import { useState } from 'react';

export default function CreateGame() {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<GameDifficulty>(
    game.defaultDifficulty,
  );
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGame = async () => {
    if (!name.trim()) return;

    setIsCreating(true);

    try {
      const gameCode = generateGameCode();

      const game: Game = {
        code: gameCode,
        name: name.trim(),
        difficulty,
        createdAt: new Date().toISOString(),
        players: [{ name: name.trim(), isHost: true }],
        status: 'waiting',
      };

      localStorage.setItem(`game_${gameCode}`, JSON.stringify(game));

      setTimeout(() => {
        setIsCreating(false);
        window.location.href = `/lobby/${gameCode}`;
      }, 800);
    } catch (error) {
      console.error('Error creating game:', error);
      setIsCreating(false);
    }
  };

  return (
    <Container className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-10">
          <div className="flex flex-col items-center justify-center gap-5">
            <Atomium size={40} />
            <h1 className="text-display-small text-foreground-neutral-default font-semibold">
              Criar novo jogo
            </h1>
          </div>
          <div className="flex flex-col gap-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da equipa"
              className="border-border-neutral-default bg-background-neutral-default focus:ring-foreground-neutral-default text-title-small rounded-xl border p-4 focus:ring-1 focus:outline-none"
              disabled={isCreating}
            />
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-3">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDifficulty(option.id)}
                    disabled={isCreating}
                    className={`flex items-center justify-center rounded-xl border p-4 transition-all ${
                      difficulty === option.id
                        ? 'border-foreground-neutral-default bg-background-neutral-faded'
                        : 'border-border-neutral-default bg-background-neutral-default hover:border-border-neutral-strong'
                    }`}
                  >
                    <span className="text-title-small font-medium">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 pt-8">
        <Link
          href="/"
          className="text-foreground-neutral-faded hover:text-foreground-neutral-default border-border-neutral-default bg-background-neutral-default flex items-center justify-center rounded-full border p-4 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </svg>
        </Link>
        <button
          onClick={handleCreateGame}
          disabled={!name.trim() || isCreating}
          className="bg-background-neutral-inverse text-foreground-neutral-inverse text-title-small inline-flex flex-1 items-center justify-center rounded-full px-6 py-4 font-medium transition-all active:scale-95 disabled:opacity-50"
        >
          {isCreating ? 'A criar jogo…' : 'Criar jogo'}
        </button>
      </div>
    </Container>
  );
}
