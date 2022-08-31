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