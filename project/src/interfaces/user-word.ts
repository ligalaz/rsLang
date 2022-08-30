import { IWord } from "./word";

export interface IUserWord {
  difficulty: "new" | "normal" | "hard";
  optional?: IUserWordOptions;
}

export interface IUserWordOptions {
  time?: string;
  mistakes?: number;
  attempts?: number;
}

export interface UserWordResponse {
  id: string;
  wordId: string;
  difficulty?: "new" | "normal" | "hard";
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
  public difficulty: "new" | "normal" | "hard";
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
  public time: Date;
  public mistakes: number;
  public attempts: number;

  public static fromServer(dto: IUserWordOptions): UserWordOptions {
    if (!dto) {
      return null;
    }
    const instance: UserWordOptions = new UserWordOptions();

    instance.time = dto.time && new Date(dto.time);
    instance.mistakes = dto.mistakes;
    instance.attempts = dto.attempts;

    return instance;
  }

  public toDto(): IUserWordOptions {
    const result: IUserWordOptions = {};
    if (this.time) {
      result.time = this.time.toISOString();
    }
    if (this.attempts) {
      result.attempts = this.attempts;
    }
    if (this.mistakes) {
      result.mistakes = this.mistakes;
    }
    return result;
  }
}
