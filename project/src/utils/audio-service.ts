import { API_BASE_URL } from "../config";

export class AudioService {
  public static audio: HTMLAudioElement;
  public static async play(...urls: string[]): Promise<void> {
    AudioService.stop();
    try {
      // eslint-disable-next-line no-empty
      for await (const _ of AudioService.playAsync(urls)) {
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  public static stop(): void {
    const stopEvent: CustomEvent = new CustomEvent("custom-stop");
    if (AudioService.audio) {
      AudioService.audio.dispatchEvent(stopEvent);
    }
  }

  public static async *playAsync(urls: string[]): AsyncGenerator<void> {
    for (const url of urls) {
      yield await AudioService.createAudio(url);
    }
  }

  public static createAudio(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      AudioService.audio = new Audio(API_BASE_URL + "/" + url);
      AudioService.audio.play();
      AudioService.audio.addEventListener(
        "ended",
        function handleAudioEndEvent() {
          AudioService.audio.removeEventListener("ended", handleAudioEndEvent);
          resolve();
        }
      );
      AudioService.audio.addEventListener(
        "custom-stop",
        function handleAudioStopEvent() {
          AudioService.audio.removeEventListener(
            "custom-stop",
            handleAudioStopEvent
          );
          AudioService.audio.pause();
          delete AudioService.audio;
          reject();
        }
      );
    });
  }
}
