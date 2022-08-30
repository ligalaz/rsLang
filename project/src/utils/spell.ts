import { AudioService } from "./audio-service";

export function spell(...urls: string[]) {
  AudioService.play(urls);
}
