
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Volume2, VolumeX } from 'lucide-vue-next'

const audioRef = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const loading = ref(false)

const targetVolume = 0.2

let fadeFrame: number | null = null

function stopFade() {
  if (fadeFrame !== null) {
    cancelAnimationFrame(fadeFrame)
    fadeFrame = null
  }
}

function fadeVolume(
  audio: HTMLAudioElement,
  target: number,
  duration = 1200
) {
  stopFade()

  const startVolume = audio.volume
  const startTime = performance.now()

  function update(now: number) {
    const progress = Math.min(
      (now - startTime) / duration,
      1
    )

    audio.volume =
      startVolume +
      (target - startVolume) * progress

    if (progress < 1) {
      fadeFrame = requestAnimationFrame(update)
    } else {
      fadeFrame = null
    }
  }

  fadeFrame = requestAnimationFrame(update)
}

async function toggleMusic() {
  const audio = audioRef.value

  if (!audio || loading.value) return

  if (playing.value) {
    stopFade()
    audio.pause()
    playing.value = false
    return
  }

  loading.value = true

  try {
    audio.volume = 0
    await audio.play()

    playing.value = true
    fadeVolume(audio, targetVolume)
  } catch (error) {
    console.error('Não foi possível reproduzir a música:', error)
    playing.value = false
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  stopFade()
})
</script>

<template>
  <div class="music-control">
    <audio
      ref="audioRef"
      src="/audio/medieval-ambient.mp3"
      loop
      preload="none"
    />

    <button
      type="button"
      class="music-button"
      :disabled="loading"
      :aria-label="
        playing
          ? 'Pausar música de fundo'
          : 'Reproduzir música de fundo'
      "
      :aria-pressed="playing"
      @click="toggleMusic"
    >
      <Volume2 v-if="playing" :size="19" />
      <VolumeX v-else :size="19" />
    </button>
  </div>
</template>

<style scoped>
.music-control {
  position: fixed;
  top: 22px;
  right: 22px;
  z-index: 2000;
}

.music-button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 44px;
  height: 44px;

  border: 1px solid #c67a9c;
  border-radius: 50%;

  background: rgba(32, 16, 29, 0.85);
  color: #f3d4df;

  cursor: pointer;
  backdrop-filter: blur(10px);

  box-shadow: 0 0 18px #b83e7826;

  transition:
    background 0.3s,
    transform 0.3s,
    box-shadow 0.3s;
}

.music-button:hover {
  background: #6b2a4b;
  transform: scale(1.08);
  box-shadow: 0 0 25px #b83e7855;
}

.music-button:disabled {
  opacity: 0.5;
  cursor: wait;
}

@media (max-width: 480px) {
  .music-control {
    top: 14px;
    right: 14px;
  }

  .music-button {
    width: 40px;
    height: 40px;
  }
}
</style>
