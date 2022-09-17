export interface GameCardDetails {
  name: string;
  link: string;
  description: string;
  promo: JSX.Element;
}

export interface GameCardItem {
  key: string;
  game: GameCardDetails;
}
