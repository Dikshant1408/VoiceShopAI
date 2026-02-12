
export class SpeechService {
  private recognition: any;
  private isSupported: boolean = false;
  private currentLanguage: string = 'en-US';

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.isSupported = true;
      // Load saved language preference
      this.currentLanguage = localStorage.getItem('voice_language') || 'en-US';
      this.recognition.lang = this.currentLanguage;
    }
  }

  setLanguage(lang: string) {
    this.currentLanguage = lang;
    localStorage.setItem('voice_language', lang);
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  getSupportedLanguages() {
    return [
      { code: 'en-US', name: 'English (US)' },
      { code: 'es-ES', name: 'Spanish' },
      { code: 'fr-FR', name: 'French' },
      { code: 'de-DE', name: 'German' },
      { code: 'it-IT', name: 'Italian' },
      { code: 'pt-BR', name: 'Portuguese' },
      { code: 'zh-CN', name: 'Chinese' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'ko-KR', name: 'Korean' },
      { code: 'ar-SA', name: 'Arabic' },
      { code: 'hi-IN', name: 'Hindi' }
    ];
  }

  start(onResult: (text: string, isFinal: boolean) => void, onEnd: () => void, onError: (err: string) => void) {
    if (!this.isSupported) {
      onError("Speech recognition not supported in this browser.");
      return;
    }

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      onResult(transcript, result.isFinal);
    };

    this.recognition.onend = onEnd;
    this.recognition.onerror = (event: any) => onError(event.error);

    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Recognition already started");
    }
  }

  stop() {
    if (this.recognition) this.recognition.stop();
  }
}

export const speechService = new SpeechService();
