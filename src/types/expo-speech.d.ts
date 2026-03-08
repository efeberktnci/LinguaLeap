declare module 'expo-speech' {
  export type SpeechOptions = {
    language?: string;
    pitch?: number;
    rate?: number;
    onDone?: () => void;
    onStopped?: () => void;
    onError?: (error: any) => void;
  };

  export function speak(text: string, options?: SpeechOptions): void;
  export function stop(): void;
}

