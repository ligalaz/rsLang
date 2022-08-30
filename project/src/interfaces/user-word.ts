import { IWord } from "./word";

export interface IUserWord {
  difficulty: "seen" | "new" | "normal" | "hard";
  optional?: IUserWordOptions;
}

interface IAudioCall {
  attempts: number;
  mistakes: number;
}

interface ISprint {
  attempts: number;
  mistakes: number;
}

export interface IUserWordOptions {
  learnedDate?: string;
  firstSeenDate?: string;
  audioCall?: IAudioCall;
  sprint?: ISprint;
}

export interface UserWordResponse {
  id: string;
  wordId: string;
  difficulty?: "seen" | "new" | "normal" | "hard";
  optional?: IUserWordOptions;
}

export interface IAggregatedWordsResponse {
  paginatedResults: IWord[];
  totalCount: IAggreagedWordsTotal[];
}

export interface IAggreagedWordsTotal {
  count: number;
}

export class UserWord {
  public difficulty: "seen" | "new" | "normal" | "hard";
  public optional: UserWordOptions;

  public static fromServer(dto: IUserWord): UserWord {
    if (!dto) {
      return null;
    }
    const instance: UserWord = new UserWord();

    instance.difficulty = dto.difficulty;
    instance.optional = UserWordOptions.fromServer(dto.optional);

    return instance;
  }
}

export class UserWordOptions {
  learnedDate?: string;
  firstSeenDate?: string;
  audioCall?: IAudioCall;
  sprint?: ISprint;

  public static fromServer(dto: IUserWordOptions): UserWordOptions {
    if (!dto) {
      return null;
    }
    const instance: UserWordOptions = new UserWordOptions();

    instance.learnedDate = dto.learnedDate;
    instance.audioCall = dto.audioCall;
    instance.sprint = dto.sprint;

    return instance;
  }

  public toDto(): IUserWordOptions {
    const result: IUserWordOptions = {};
    if (this.learnedDate) {
      result.learnedDate = this.learnedDate;
    }
    if (this.firstSeenDate) {
      result.firstSeenDate = this.learnedDate;
    }
    if (this.audioCall) {
      result.audioCall = this.audioCall;
    }
    if (this.sprint) {
      result.sprint = this.sprint;
    }
    return result;
  }
}
