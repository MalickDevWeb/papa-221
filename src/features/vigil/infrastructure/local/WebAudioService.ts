import { IAudioService } from '../../domain/IAudioService';
import { APP_CONFIG } from '@/core/config/app.config';

/**
 * WebAudioService
 * Concrete implementation of IAudioService using the browser's native Web Audio API.
 */
export class WebAudioService implements IAudioService {
  playSuccessBeep(): void {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(APP_CONFIG.scanner.beepFrequencyStart, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(APP_CONFIG.scanner.beepFrequencyEnd, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + APP_CONFIG.scanner.beepDuration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + APP_CONFIG.scanner.beepDuration);
    } catch (e) {
      console.warn('Audio context blocked or unsupported by browser:', e);
    }
  }

  playFailureBeep(): void {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(220, audioCtx.currentTime); // Lower pitch A3
      oscillator.frequency.setValueAtTime(110, audioCtx.currentTime + 0.15); // A2
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio context blocked or unsupported by browser:', e);
    }
  }
}
