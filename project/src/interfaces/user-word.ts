export interface IUserWord {
  difficulty: string;
  // TODO: add optional model
  //  optional: any;
}

export interface UserWordResponse {
  id: string;
  wordId: string;
  difficulty?: string;
  optional?: boolean;
}
