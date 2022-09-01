import { getStartOfDayDate } from "../utils/get-start-of-day-date";

export interface IStatistic {
  learnedWords: number;
  optional?: IOptional;
}
interface IOptional {
  audioCall?: ICall;
  sprint?: ICall;
}
interface ICall {
  seria?: number;
  maxSeria?: number;
  [dateISO: string]: any;
}

interface IGameStatistics {
  attempts: number;
  guesses: number;
}

export interface IStatisticsRequest {
  userId: string;
  request: IStatistic;
}

export class Statistic {
  public learnedWords: number;
  public optional?: IOptional;

  public get learnPercent(): number {
    return Math.ceil((this.learnedWords / 3600) * 100);
  }

  public get audioCallAttempts(): number {
    return this.optional?.audioCall?.[getStartOfDayDate()]?.attempts || 0;
  }

  public get audioCallGuesses(): number {
    return this.optional?.audioCall?.[getStartOfDayDate()]?.guesses || 0;
  }

  public get audioCallPercent(): number {
    return this.audioCallAttempts
      ? Math.ceil((this.audioCallGuesses * 100) / this.audioCallAttempts)
      : 0;
  }

  public get sprintAttempts(): number {
    return this.optional?.sprint?.[getStartOfDayDate()]?.attempts || 0;
  }

  public get sprintGuesses(): number {
    return this.optional?.sprint?.[getStartOfDayDate()]?.guesses || 0;
  }

  public get sprintPercent(): number {
    return this.sprintAttempts
      ? Math.ceil((this.sprintGuesses * 100) / this.sprintAttempts)
      : 0;
  }

  public get gamesPercent(): number {
    return this.sprintAttempts + this.audioCallAttempts
      ? Math.ceil(
          ((this.sprintGuesses + this.audioCallGuesses) * 100) /
            (this.sprintAttempts + this.audioCallAttempts)
        )
      : 0;
  }

  public static fromDto(dto: IStatistic): Statistic {
    const instance: Statistic = new Statistic();

    instance.learnedWords = dto.learnedWords;
    instance.optional = dto.optional || {};

    return instance;
  }
}
