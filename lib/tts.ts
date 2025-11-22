
"use client"

export class TextToSpeech {
  private synth: SpeechSynthesis | null = null
  private voice: SpeechSynthesisVoice | null = null
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis
      this.loadVoice()
    }
  }

  private loadVoice() {
    if (!this.synth) return

    const loadVoices = () => {
      const voices = this.synth!.getVoices()
      // Prefer Portuguese voices, fallback to default
      this.voice = voices.find(voice => voice.lang.startsWith('pt')) || voices[0] || null
    }

    loadVoices()
    
    // Voices might not be loaded immediately
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices
    }
  }

  speak(text: string, rate: number = 1) {
    if (!this.synth || !text.trim()) return

    // Cancel any ongoing speech
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    if (this.voice) {
      utterance.voice = this.voice
    }
    utterance.rate = rate
    utterance.pitch = 1
    utterance.volume = 1

    this.synth.speak(utterance)
  }

  stop() {
    if (this.synth) {
      this.synth.cancel()
    }
  }
}

// Singleton instance
export const tts = typeof window !== 'undefined' ? new TextToSpeech() : null
