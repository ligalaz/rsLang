import { IWord } from "./word";

export interface IPopUp {
  key: string;
  info: IWord;
  togglePopup?: any;
}
