/**
 * IAudioService
 * Domain service interface for audio feedback.
 * Provides abstraction so that the audio synthesis or playback method can be swapped.
 */
export interface IAudioService {
  /**
   * Plays a success beep sound.
   */
  playSuccessBeep(): void;

  /**
   * Plays a failure beep sound.
   */
  playFailureBeep(): void;
}
