export interface IStatistic {
  learnedWords: number;
  optional?: IOptional;
}
interface IOptional {
  audioCall?: ICall;
  sprint?: ICall;
}
interface ICall {
  seria?: string;
  [dateISO: string]: any;
}

interface IGameStatistics {
  attemps: number;
  mistakes: number;
}
