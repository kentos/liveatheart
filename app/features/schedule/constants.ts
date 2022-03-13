import { parseISO } from 'date-fns';

export const days: Record<number, Date> = {
  0: parseISO('2022-08-31'),
  1: parseISO('2022-09-01'),
  2: parseISO('2022-09-02'),
  3: parseISO('2022-09-03'),
};
