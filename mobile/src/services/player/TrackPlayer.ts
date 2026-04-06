// mobile/src/services/player/TrackPlayer.ts
import TrackPlayer, {
  Capability,
  RepeatMode,
  State,
  Event,
} from 'react-native-track-player';

export class MusicPlayerService {
  static async setup() {
    await TrackPlayer.setupPlayer({
      waitForBuffer: true,
      autoUpdateMetadata: true,
    });

    // Capacidades del reproductor
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });
  }

  // Reproducir desde YouTube (streaming)
  static async playFromYouTube(videoId: string, title: string, artist: string) {
    // Obtener URL de audio directo
    const audioUrl = await this.getYouTubeAudioUrl(videoId);
    
    await TrackPlayer.add({
      id: videoId,
      url: audioUrl,
      title: title,
      artist: artist,
      artwork: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    });

    await TrackPlayer.play();
  }

  // Reproducir archivo local descargado
  static async playLocal(filePath: string, metadata: any) {
    await TrackPlayer.add({
      id: metadata.id,
      url: `file://${filePath}`,
      title: metadata.title,
      artist: metadata.artist,
      artwork: metadata.artwork,
    });

    await TrackPlayer.play();
  }

  // Obtener URL de audio de YouTube
  private static async getYouTubeAudioUrl(videoId: string): Promise<string> {
    // Opción 1: Usar tu laptop como proxy (RECOMENDADO)
    const response = await fetch(`http://TU_LAPTOP_IP:3000/audio/${videoId}`);
    const { url } = await response.json();
    return url;

    // Opción 2: Librerías en el celular (menos eficiente)
    // const ytdl = require('ytdl-core');
    // const info = await ytdl.getInfo(videoId);
    // return ytdl.chooseFormat(info.formats, { quality: 'highestaudio' }).url;
  }
}