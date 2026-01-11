export function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  
  return Array.from({ length: 6 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

export function generateTeamId(): string {
  return Math.random().toString(36).substring(2, 11);
}
