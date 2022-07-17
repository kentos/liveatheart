import * as fns from 'date-fns';
import _ from 'lodash';

function convert(raw: string | Date): Date {
  if (raw instanceof Date) {
    return raw;
  }
  return fns.parseISO(String(raw));
}

type Format = 'day' | 'shortday' | 'time' | 'short';

function getFormat(f: Format): string {
  switch (f) {
    case 'day':
      return 'EEEE';
    case 'shortday':
      return 'EEE';
    case 'time':
      return 'HH:mm';
    case 'short':
    default:
      return 'd/M';
  }
}

export function format(date: string | Date, type: Format): string {
  return fns.format(convert(date), getFormat(type));
}

export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const start = fns.setHours(convert(date2), 11);
  const end = fns.addDays(start, 1);
  const date = convert(date1);
  return fns.isAfter(date, start) && fns.isBefore(date, end);
}
