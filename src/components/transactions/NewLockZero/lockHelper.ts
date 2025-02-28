import dayjs from 'dayjs';

export type IDurations = '3 months' | '6 months' | '1 year' | '2 years' | '3 years' | '4 years';

export function futureDate(duration: IDurations): string {
  let seconds = 0;
  const secondsInWeek = 604800;

  switch (duration) {
    case '3 months':
      seconds = 3 * 30 * 86400;
      break;
    case '6 months':
      seconds = 6 * 30 * 86400;
      break;
    case '1 year':
      seconds = 1 * 365 * 86400;
      break;
    case '2 years':
      seconds = 2 * 365 * 86400;
      break;
    case '3 years':
      seconds = 3 * 365 * 86400;
      break;
    case '4 years':
      seconds = 4 * 365 * 86400;
      break;
    default:
      throw new Error('Invalid duration');
  }

  const currentTimestamp = Date.now() / 1000;
  const unlockTime = dayjs.unix(currentTimestamp).add(seconds, 'second').unix();

  const roundedTime = Math.floor(unlockTime / secondsInWeek) * secondsInWeek;

  return dayjs.unix(roundedTime).format('DD-MM-YYYY');
}

export const DurationBonusMapping: { [key: string]: { perc: number; text: string } } = {
  '1 year': {
    perc: 5,
    text: '+5% bonus',
  },
  '2 years': {
    perc: 10,
    text: '+10% bonus',
  },
  '3 years': {
    perc: 15,
    text: '+15% bonus',
  },
  '4 years': {
    perc: 20,
    text: '+20% bonus',
  },
};
