export const difficulty = [
  { label: 'Fácil', value: 'easy' },
  { label: 'Médio', value: 'medium' },
  { label: 'Difícil', value: 'hard' },
] as const;

export type Difficulty = (typeof difficulty)[number]['value'];
