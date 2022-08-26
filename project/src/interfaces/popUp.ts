import { IWord } from "./word";

export interface IPopUp {
  key: string | number;
  info: IWord;
  togglePopup?: any;
  number: number;
  clickPage: any;
}
