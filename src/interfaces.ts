export enum TimeUnit {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export interface Duration {
  unit: TimeUnit;
  amount: number;
}

export interface Friend {
  id: number;
  firstName: string;
  lastName: string;
  tags: string[];
  inverseFrequency?: Duration;
  hangIds: number[];
  blurb: string;
}

export interface Hang {
  id: number;
  friendIds: number[];
  date: Date;
  notes: string;
}

export type FriendMinusId = Omit<Friend, "id">;
export type HangMinusId = Omit<Hang, "id">;
