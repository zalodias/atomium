import { Atomium } from '@/assets/atomium';
import { Container } from '@/components/container';
import Link from 'next/link';

export default function Home() {
  return (
    <Container className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <Atomium />
        <h1 className="text-display-medium text-foreground-neutral-default font-semibold">
          atomium
        </h1>
      </div>
      <div className="flex w-full flex-col gap-4">
        <Link
          href="/lobby/create"
          className="bg-background-neutral-inverse text-foreground-neutral-inverse text-title-small inline-flex w-full items-center justify-center rounded-full border px-6 py-4 font-medium transition-transform active:scale-95"
        >
          Criar jogo
        </Link>
        <Link
          href="/lobby/join"
          className="border-border-neutral-default text-foreground-neutral-default text-title-small inline-flex w-full items-center justify-center rounded-full border px-6 py-4 font-medium transition-transform active:scale-95"
        >
          Entrar em jogo
        </Link>
      </div>
    </Container>
  );
}
