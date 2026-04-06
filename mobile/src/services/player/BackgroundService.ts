// mobile/src/services/player/BackgroundService.ts
import KeepAwake from 'react-native-keep-awake';
import { AppState, NativeModules } from 'react-native';

export class BackgroundAudioService {
  private isScreenOff: boolean = false;

  // Habilitar audio en background cuando se apague la pantalla
  async enableBackgroundAudio() {
    // Mantener servicio activo
    KeepAwake.activate();

    // Listener para detectar cuando se apaga la pantalla
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  private handleAppStateChange = async (nextAppState: string) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      // Pantalla apagada o app en background
      this.isScreenOff = true;
      console.log('🎵 Reproduciendo en background...');
      
      // Asegurar que el audio siga
      await TrackPlayer.play();
    } else if (nextAppState === 'active') {
      // App en foreground
      this.isScreenOff = false;
      console.log('📱 App en foreground');
    }
  };

  disableBackgroundAudio() {
    KeepAwake.deactivate();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
}