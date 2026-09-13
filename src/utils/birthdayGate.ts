export type LaunchState = 'PRE_BIRTHDAY' | 'BIRTHDAY' | 'POST_BIRTHDAY';

export const BIRTHDAY = {
  launchYear: 2026,
  month: 10,
  day: 30,
  timeZone: 'Africa/Lagos',
  unlockAt: '2026-10-30T00:00:00+01:00',
} as const;

function lagosDateParts(now: Date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: BIRTHDAY.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: value('year'),
    month: value('month'),
    day: value('day'),
  };
}

export function getLaunchState(now = new Date()): LaunchState {
  const preview = import.meta.env.VITE_PREVIEW_MODE;
  if (preview === 'pre') return 'PRE_BIRTHDAY';
  if (preview === 'birthday') return 'BIRTHDAY';
  if (preview === 'post') return 'POST_BIRTHDAY';

  const { year, month, day } = lagosDateParts(now);

  if (year < BIRTHDAY.launchYear) return 'PRE_BIRTHDAY';
  if (year > BIRTHDAY.launchYear) return 'POST_BIRTHDAY';

  if (month < BIRTHDAY.month || (month === BIRTHDAY.month && day < BIRTHDAY.day)) {
    return 'PRE_BIRTHDAY';
  }

  if (month === BIRTHDAY.month && day === BIRTHDAY.day) {
    return 'BIRTHDAY';
  }

  return 'POST_BIRTHDAY';
}

export function millisecondsUntilUnlock(now = new Date()) {
  return Math.max(0, new Date(BIRTHDAY.unlockAt).getTime() - now.getTime());
}
