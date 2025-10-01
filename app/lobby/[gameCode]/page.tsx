'use client';

import { Atomium } from '@/assets/atomium';
import { Container } from '@/components/container';
import { Game } from '@/types/game';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GameLobby() {
  const params = useParams();
  const gameCode = params.gameCode as string;
  const [gameSession, setGameSession] = useState<Game | null>(null);

  useEffect(() => {
    const storedGame = localStorage.getItem(`game_${gameCode}`);
    if (storedGame) {
      setGameSession(JSON.parse(storedGame));
    }
  }, [gameCode]);

  return (
    <Container className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-8">
          <div className="flex flex-col items-center justify-center gap-5">
            <Atomium size={40} />
            <h1 className="text-display-small text-foreground-neutral-default font-semibold">
              Lobby do Jogo
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-body-large text-foreground-neutral-strong mb-2">
                Código do Jogo
              </p>
              <div className="bg-background-neutral-subtle border-border-neutral-default rounded-lg border px-6 py-4">
                <p className="text-display-medium font-semibold">{gameCode}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-body-large text-foreground-neutral-strong mb-2">
                A aguardar jogadores…
              </p>
              <p className="text-body-medium text-foreground-neutral-faded">
                Compartilha o código com outros jogadores para que se juntem ao
                jogo.
              </p>
            </div>
            <div className="bg-background-neutral-subtle border-border-neutral-default rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-body-medium text-foreground-neutral-strong">
                  Jogadores conectados
                </span>
                <span className="bg-background-neutral-inverse text-foreground-neutral-inverse text-title-small rounded-full px-3 py-1 font-medium">
                  {gameSession?.players.length || 0}/4
                </span>
              </div>
              {gameSession?.players.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-body-medium text-foreground-neutral-default">
                    {player.name}
                    {player.isHost && (
                      <span className="text-body-small text-foreground-neutral-faded ml-2">
                        (Host)
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
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
          disabled
          className="bg-background-neutral-inverse text-foreground-neutral-inverse text-title-small inline-flex flex-1 items-center justify-center rounded-full px-6 py-4 font-medium opacity-50 transition-all"
        >
          Iniciar Jogo
        </button>
      </div>
    </Container>
  );
}
