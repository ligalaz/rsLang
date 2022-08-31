import { API_BASE_URL } from "../config";

export interface IAudioSource {
  audio: string;
  audioExample: string;
  audioMeaning: string;
}

export const audioService = (
  source: IAudioSource,
  isTriple: boolean,
  url = API_BASE_URL
) => {
  const audio = new Audio();
  audio.setAttribute("src", `${url}/${source.audio}`);
  const audioHandler = (event: Event) => {
    const target = event.target as HTMLAudioElement;
    const audioSource = target.getAttribute("src") as string;
    switch (audioSource) {
      case `${url}/${source.audio}`:
        target.setAttribute("src", `${url}/${source.audioExample}`);
        break;
      case `${url}/${source.audioExample}`:
        target.setAttribute("src", `${url}/${source.audioMeaning}`);
        audio.removeEventListener("ended", audioHandler);
        break;
      default:
        break;
    }
    target.play();
  };
  if (isTriple) {
    audio.addEventListener("ended", audioHandler);
    audio.autoplay = true;
  } else {
    audio.play();
  }
};
