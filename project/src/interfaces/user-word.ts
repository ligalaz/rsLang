import { IWord } from "./word";

export interface IUserWord {
  difficulty: "seen" | "learned" | "hard";
  optional?: UserWordOptions;
}

interface IAudioCall {
  attempts: number;
  guesses: number;
}

interface ISavanna {
  attempts: number;
  guesses: number;
}

interface ISprint {
  attempts: number;
  guesses: number;
}

export interface UserWordResponse {
  id: string;
  wordId: string;
  difficulty?: "seen" | "learned" | "hard";
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
  public difficulty: "seen" | "learned" | "hard";
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

export interface IUserWordOptions {
  learnedDate?: string;
  firstSeenDate?: string;
  strick?: number;
  audioCall?: IAudioCall;
  savanna?: ISavanna;
  sprint?: ISprint;
}

export class UserWordOptions {
  learnedDate?: string;
  firstSeenDate?: string;
  audioCall?: IAudioCall;
  savanna?: ISavanna;
  strick: number;
  sprint?: ISprint;

  public static fromServer(dto: IUserWordOptions): UserWordOptions {
    if (!dto) {
      return null;
    }
    const instance: UserWordOptions = new UserWordOptions();

    instance.learnedDate = dto.learnedDate;
    instance.firstSeenDate = dto.firstSeenDate;
    instance.audioCall = dto.audioCall;
    instance.savanna = dto.savanna;
    instance.sprint = dto.sprint;
    instance.strick = dto.strick;

    return instance;
  }

  public toDto(): IUserWordOptions {
    const result: IUserWordOptions = {};
    if (this.learnedDate) {
      result.learnedDate = this.learnedDate;
    }
    if (this.firstSeenDate) {
      result.firstSeenDate = this.firstSeenDate;
    }
    if (this.strick) {
      result.strick = this.strick;
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
