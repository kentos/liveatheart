export enum ScheduleCategory {
  CONCERTS = 'concerts',
  FILM = 'film',
  CONFERENCE = 'conference',
}

export const categories = ['Concerts', 'Day Party', 'Film', 'Conference'] as const;
export type Category = (typeof categories)[number];

export const days = ['Wed', 'Thu', 'Fri', 'Sat'] as const;
export type Day = (typeof days)[number];
