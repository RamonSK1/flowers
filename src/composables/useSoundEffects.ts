
const soundPaths = {
  shuffle: '/audio/effects/shuffle.wav',
  reveal: '/audio/effects/reveal.wav',
  place: '/audio/effects/place.wav',
} as const

type SoundName = keyof typeof soundPaths

export function useSoundEffects() {
  function playSound(name: SoundName, volume = 0.25) {
    const audio = new Audio(soundPaths[name])

    audio.volume = Math.max(0, Math.min(1, volume))

    audio.play().catch((error) => {
      console.warn('Efeito sonoro não reproduzido:', error)
    })
  }

  return { playSound }
}
