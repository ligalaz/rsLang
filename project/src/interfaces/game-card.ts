export interface GameCardDetails {
  name: string;
  description: string;
  promo: JSX.Element;
}

export interface GameCardItem {
  key: string;
  game: GameCardDetails;
}
