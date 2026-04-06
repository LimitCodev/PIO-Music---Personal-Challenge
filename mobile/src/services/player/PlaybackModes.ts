// mobile/src/services/player/PlaybackModes.ts
import TrackPlayer, { RepeatMode } from 'react-native-track-player';

export enum PlayMode {
  SEQUENTIAL = 'sequential',      // 1 → 2 → 3 → stop
  LOOP_ALL = 'loop_all',          // 1 → 2 → 3 → 1 → 2 → 3...
  LOOP_ONE = 'loop_one',          // 1 → 1 → 1 → 1...
  SHUFFLE = 'shuffle',            // 3 → 1 → 2 → 3 → 1...
}

export class PlaybackController {
  private currentMode: PlayMode = PlayMode.SEQUENTIAL;

  async setPlayMode(mode: PlayMode) {
    this.currentMode = mode;

    switch (mode) {
      case PlayMode.SEQUENTIAL:
        await TrackPlayer.setRepeatMode(RepeatMode.Off);
        break;

      case PlayMode.LOOP_ALL:
        await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        break;

      case PlayMode.LOOP_ONE:
        await TrackPlayer.setRepeatMode(RepeatMode.Track);
        break;

      case PlayMode.SHUFFLE:
        await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        // Activar shuffle
        const queue = await TrackPlayer.getQueue();
        const shuffled = this.shuffleArray([...queue]);
        await TrackPlayer.reset();
        await TrackPlayer.add(shuffled);
        break;
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getCurrentMode(): PlayMode {
    return this.currentMode;
  }
}