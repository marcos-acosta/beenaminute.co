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
  id?: number;
  firstName: string;
  lastName: string;
  fullName: string;
  tags: string[];
  inverseFrequency?: Duration;
  blurb: string;
  lastSeen?: Date;
}

export interface Hang {
  id?: number;
  friendIds: number[];
  date: Date;
  notes: string;
  friendNames: string[];
}
