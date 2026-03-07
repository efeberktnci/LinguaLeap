import { LeagueName, LeagueInfo } from '../types';

export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 6) return 'İyi geceler';
  if (hour < 12) return 'Günaydın';
  if (hour < 18) return 'İyi günler';
  return 'İyi akşamlar';
};

export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(current / total, 1);
};

export const getDaysInStreak = (streakCount: number): string => {
  if (streakCount === 0) return 'Bugün başla!';
  if (streakCount === 1) return '1 gün';
  return `${streakCount} gün`;
};

const LEAGUE_MAP: Record<LeagueName, LeagueInfo> = {
  Bronze: { icon: '🥉', color: '#CD7F32', next: 'Silver' },
  Silver: { icon: '🥈', color: '#C0C0C0', next: 'Gold' },
  Gold: { icon: '🥇', color: '#FFD700', next: 'Sapphire' },
  Sapphire: { icon: '💎', color: '#1CB0F6', next: 'Ruby' },
  Ruby: { icon: '🔴', color: '#FF4B4B', next: 'Emerald' },
  Emerald: { icon: '💚', color: '#58CC02', next: 'Amethyst' },
  Amethyst: { icon: '💜', color: '#CE82FF', next: 'Pearl' },
  Pearl: { icon: '🤍', color: '#F0E6D3', next: 'Obsidian' },
  Obsidian: { icon: '🖤', color: '#4B4B4B', next: 'Diamond' },
  Diamond: { icon: '💠', color: '#00D4FF', next: null },
};

export const getLeagueInfo = (league: LeagueName): LeagueInfo => {
  return LEAGUE_MAP[league] ?? LEAGUE_MAP.Bronze;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
