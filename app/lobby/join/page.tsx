'use client';

import { Atomium } from '@/assets/atomium';
import { Container } from '@/components/container';
import { Game } from '@/types/game';
import Link from 'next/link';
import { useState } from 'react';

export default function JoinGame() {
  const [name, setName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoinGame = async () => {
    if (!name.trim() || !gameCode.trim()) {
      setError('Por favor, preenche todos os campos');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const game = localStorage.getItem(`game_${gameCode.toUpperCase()}`);

      if (!game) {
        setError('Jogo não encontrado. Verifica o código.');
        setIsJoining(false);
        return;
      }

      const gameSession: Game = JSON.parse(game);

      if (gameSession.players.length >= 4) {
        setError('Este jogo já está cheio (4 jogadores máximo).');
        setIsJoining(false);
        return;
      }

      if (gameSession.status !== 'waiting') {
        setError('Este jogo já começou ou terminou.');
        setIsJoining(false);
        return;
      }

      const updatedGameSession: Game = {
        ...gameSession,
        players: [...gameSession.players, { name: name.trim(), isHost: false }],
      };

      localStorage.setItem(
        `game_${gameCode.toUpperCase()}`,
        JSON.stringify(updatedGameSession),
      );

      setTimeout(() => {
        setIsJoining(false);
        window.location.href = `/lobby/${gameCode.toUpperCase()}`;
      }, 800);
    } catch (error) {
      console.error('Error joining game:', error);
      setError('Erro ao juntar-se ao jogo. Tenta novamente.');
      setIsJoining(false);
    }
  };

  return (
    <Container className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-10">
          <div className="flex flex-col items-center justify-center gap-5">
            <Atomium size={40} />
            <h1 className="text-display-small text-foreground-neutral-default font-semibold">
              Entrar em jogo
            </h1>
          </div>

          <div className="flex flex-col gap-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da equipa"
              className="border-border-neutral-default bg-background-neutral-default focus:ring-foreground-neutral-default text-title-small rounded-xl border p-4 focus:ring-1 focus:outline-none"
              disabled={isJoining}
            />

            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="Código do jogo"
              className="border-border-neutral-default bg-background-neutral-default focus:ring-foreground-neutral-default text-title-small rounded-xl border p-4 focus:ring-1 focus:outline-none"
              disabled={isJoining}
              maxLength={6}
            />

            {error && (
              <div className="bg-background-neutral-subtle border-border-neutral-default text-body-large text-foreground-neutral-strong rounded-lg border p-4 text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-8">
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
          onClick={handleJoinGame}
          disabled={!name.trim() || !gameCode.trim() || isJoining}
          className="bg-background-neutral-inverse text-foreground-neutral-inverse text-title-small inline-flex flex-1 items-center justify-center rounded-full px-6 py-4 font-medium transition-all active:scale-95 disabled:opacity-50"
        >
          {isJoining ? 'A entrar…' : 'Entrar em jogo'}
        </button>
      </div>
    </Container>
  );
}
