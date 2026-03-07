import { formatNumber, getGreeting, calculateProgress, getDaysInStreak, getLeagueInfo, shuffleArray } from '../../src/utils/helpers';

describe('formatNumber', () => {
  it('returns plain number under 1000', () => {
    expect(formatNumber(500)).toBe('500');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
  });

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(4873)).toBe('4.9K');
    expect(formatNumber(15200)).toBe('15.2K');
  });
});

describe('calculateProgress', () => {
  it('returns 0 when total is 0', () => {
    expect(calculateProgress(50, 0)).toBe(0);
  });

  it('returns correct ratio', () => {
    expect(calculateProgress(25, 100)).toBe(0.25);
    expect(calculateProgress(50, 100)).toBe(0.5);
  });

  it('clamps at 1', () => {
    expect(calculateProgress(150, 100)).toBe(1);
  });
});

describe('getDaysInStreak', () => {
  it('returns prompt for zero streak', () => {
    expect(getDaysInStreak(0)).toBe('Bugün başla!');
  });

  it('handles singular day', () => {
    expect(getDaysInStreak(1)).toBe('1 gün');
  });

  it('handles plural days', () => {
    expect(getDaysInStreak(14)).toBe('14 gün');
  });
});

describe('getLeagueInfo', () => {
  it('returns correct info for known leagues', () => {
    const obsidian = getLeagueInfo('Obsidian');
    expect(obsidian.icon).toBe('🖤');
    expect(obsidian.next).toBe('Diamond');
  });

  it('returns Diamond with no next league', () => {
    const diamond = getLeagueInfo('Diamond');
    expect(diamond.next).toBeNull();
  });
});

describe('shuffleArray', () => {
  it('returns array of same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled).toHaveLength(arr.length);
  });

  it('contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled.sort()).toEqual(arr.sort());
  });

  it('does not mutate original array', () => {
    const arr = [1, 2, 3];
    const original = [...arr];
    shuffleArray(arr);
    expect(arr).toEqual(original);
  });
});

describe('getGreeting', () => {
  it('returns a string', () => {
    expect(typeof getGreeting()).toBe('string');
  });
});
