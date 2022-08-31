import { IUserWord, UserWord } from "./user-word";

export interface IWord {
  id?: string;
  _id?: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  userWord?: IUserWord;
}

export interface GetWordsRequest {
  group?: number;
  page?: number;
  wordsPerPage?: number;
  filter?: string;
}

export interface GetUserWordsRequest {
  userId: string;
  params: GetWordsRequest;
}

export class Word {
  public id: string;
  public group: number;
  public page: number;
  public word: string;
  public image: string;
  public audio: string;
  public audioMeaning: string;
  public audioExample: string;
  public textMeaning: string;
  public textExample: string;
  public transcription: string;
  public wordTranslate: string;
  public textMeaningTranslate: string;
  public textExampleTranslate: string;
  public userWord: UserWord;

  public static fromServer(dto: IWord): Word {
    const instance: Word = new Word();

    instance.id = dto._id || dto.id;
    instance.group = dto.group;
    instance.page = dto.page;
    instance.word = dto.word;
    instance.image = dto.image;
    instance.audio = dto.audio;
    instance.audioMeaning = dto.audioMeaning;
    instance.audioExample = dto.audioExample;
    instance.textMeaning = dto.textMeaning;
    instance.textExample = dto.textExample;
    instance.transcription = dto.transcription;
    instance.wordTranslate = dto.wordTranslate;
    instance.textMeaningTranslate = dto.textMeaningTranslate;
    instance.textExampleTranslate = dto.textExampleTranslate;
    instance.userWord = UserWord.fromServer(dto.userWord);

    return instance;
  }
}
