
<script setup lang="ts">
import { ref, computed,nextTick, watch, onMounted, onUnmounted } from 'vue'
import {
  Radio,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  ChevronDown,
  Music2,
} from 'lucide-vue-next'

import { playlist } from '../data/playlist'

const audioRef = ref<HTMLAudioElement | null>(null)

const expanded = ref(false)
const playing = ref(false)
const loading = ref(false)
const currentIndex = ref(0)
const volume = ref(20)
const shuffle = ref(false)
const repeat = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const restoring = ref(true)

const currentTrack = computed(
  () => playlist[currentIndex.value]!
)

const progress = computed(() =>
  duration.value > 0
    ? (currentTime.value / duration.value) * 100
    : 0
)


const RADIO_STORAGE_KEY = 'oraculo-radio'

interface SavedRadioState {
  trackIndex: number
  currentTime: number
  volume: number
  wasPlaying: boolean
}


function saveRadioState() {
  const audio = audioRef.value

  const state: SavedRadioState = {
    trackIndex: currentIndex.value,
    currentTime: audio?.currentTime ?? currentTime.value,
    volume: volume.value,
    wasPlaying: audio ? !audio.paused : playing.value,
  }

  try {
    localStorage.setItem(
      RADIO_STORAGE_KEY,
      JSON.stringify(state)
    )
  } catch (error) {
    console.warn('Não foi possível salvar a rádio:', error)
  }
}


function restoreRadioState(): SavedRadioState | null {
  try {
    const saved = localStorage.getItem(RADIO_STORAGE_KEY)

    if (!saved) return null

    return JSON.parse(saved) as SavedRadioState
  } catch {
    return null
  }
}


function handleStartMusic() {
  if (playing.value) return

  resumeAvailable.value = false

  void play()
}


function onAudioPlay() {
  playing.value = true
  resumeAvailable.value = false
  saveRadioState()
}

function onAudioPause() {
  playing.value = false
  saveRadioState()
}




const resumeAvailable = ref(false)

function handlePageHide() {
  saveRadioState()
}


onMounted(async () => {
  // Registra o evento SEM depender de estado salvo
  window.addEventListener(
    'oraculo:start-music',
    handleStartMusic
  )
  window.addEventListener(
  'pagehide',
  handlePageHide
    )

  const audio = audioRef.value
  if (!audio) return
  

  // Configura o volume inicial
  audio.volume = volume.value / 100

  // Tenta restaurar a última sessão
  const saved = restoreRadioState()

  if (!saved) {
  restoring.value = false
  return
}

  // Restaura a música selecionada
  currentIndex.value = Math.max(
    0,
    Math.min(playlist.length - 1, saved.trackIndex)
  )

  // Restaura o volume
  volume.value = Math.max(
    0,
    Math.min(100, saved.volume)
  )

  await nextTick()

  const restoredAudio = audioRef.value
  if (!restoredAudio) return

  restoredAudio.volume = volume.value / 100

  // Restaura o tempo da música
  restoredAudio.addEventListener(
    'loadedmetadata',
    () => {
      if (Number.isFinite(saved.currentTime)) {
        restoredAudio.currentTime = Math.min(
          saved.currentTime,
          Number.isFinite(restoredAudio.duration)
            ? restoredAudio.duration
            : saved.currentTime
        )
      }
    },
    { once: true }
  )

  restoredAudio.load()

  // Mostra opção de continuar ouvindo
  resumeAvailable.value = saved.wasPlaying
  restoring.value = false
})





function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'

  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60)

  return `${minutes}:${String(remaining).padStart(2, '0')}`
}

async function play() {
  const audio = audioRef.value
  if (!audio || loading.value) return

  loading.value = true

  try {
    audio.volume = volume.value / 100
    await audio.play()
    playing.value = true
  } catch (error) {
    playing.value = false
    console.error('Erro ao reproduzir música:', error)
  } finally {
    loading.value = false
  }
}

function pause() {
  audioRef.value?.pause()
  playing.value = false
}

function togglePlay() {
  if (playing.value) pause()
  else void play()
}


async function changeTrack(
  index: number,
  autoplay = playing.value
) {
  const audio = audioRef.value
  if (!audio) return

  currentIndex.value =
    (index + playlist.length) % playlist.length

  await nextTick()

  audio.load()

  currentTime.value = 0
  duration.value = 0

  lastSavedSecond = -1
    saveRadioState()

  if (autoplay) {
    try {
      await audio.play()
      playing.value = true
    } catch (error) {
      playing.value = false
      console.error('Erro ao reproduzir faixa:', error)
    }
  }
}

function getRandomTrackIndex() {
  if (playlist.length <= 1) return 0

  let next = currentIndex.value

  while (next === currentIndex.value) {
    next = Math.floor(Math.random() * playlist.length)
  }

  return next
}



function nextTrack() {
  if (shuffle.value && playlist.length > 1) {
    let next = currentIndex.value

    while (next === currentIndex.value) {
      next = Math.floor(Math.random() * playlist.length)
    }

    changeTrack(next)
  } else {
    changeTrack(currentIndex.value + 1)
  }
}

function previousTrack() {
  const audio = audioRef.value

  if (audio && audio.currentTime > 3) {
    audio.currentTime = 0
    return
  }

  changeTrack(currentIndex.value - 1)
}

async function onEnded() {
  const audio = audioRef.value
  if (!audio) return

  if (repeat.value) {
    audio.currentTime = 0
    await audio.play()
    return
  }

  await changeTrack(
    shuffle.value
      ? getRandomTrackIndex()
      : currentIndex.value + 1,
    true
  )
}


let lastSavedSecond = -1

function onTimeUpdate() {
  const audio = audioRef.value
  if (!audio) return

  currentTime.value = audio.currentTime

  const second = Math.floor(audio.currentTime)

  if (
    second % 5 === 0 &&
    second !== lastSavedSecond
  ) {
    lastSavedSecond = second
    saveRadioState()
  }
}

function onLoadedMetadata() {
  duration.value = audioRef.value?.duration || 0
}

function seek(value: number) {
  const audio = audioRef.value
  if (!audio || !duration.value) return

  audio.currentTime = (value / 100) * duration.value
}

watch(volume, (value) => {
  if (audioRef.value) {
    audioRef.value.volume = value / 100
  }

  if (!restoring.value) {
    saveRadioState()
  }
})



onUnmounted(() => {
  saveRadioState()

  window.removeEventListener(
    'oraculo:start-music',
    handleStartMusic
  )

  window.removeEventListener(
    'pagehide',
    handlePageHide
  )

  audioRef.value?.pause()
})
</script>

<template>
  <div class="gothic-radio">
    <audio
      ref="audioRef"
      :src="currentTrack.src"
      preload="metadata"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      @pause="onAudioPause"
      @play="onAudioPlay"
    />

    <Transition name="fade">
  <button
    v-if="resumeAvailable && !playing"
    type="button"
    class="resume-music"
    @click="
      resumeAvailable = false;
      play()
    "
  >
    ✦ Continuar ouvindo o Oráculo
  </button>
</Transition>

    <!-- Rádio compacta -->
    <button
      v-if="!expanded"
      class="radio-toggle"
      type="button"
      aria-label="Abrir Rádio do Oráculo"
      @click="expanded = true"
    >
      <Radio :size="22" />
      <span v-if="playing" class="radio-indicator"></span>
    </button>

    <!-- Rádio expandida -->
    <div v-else class="radio-panel">
      <div class="radio-header">
        <div class="radio-brand">
          <Radio :size="20" />
          <div>
            <strong>Rádio do Oráculo</strong>
            <small>FREQUÊNCIA DAS MEMÓRIAS</small>
          </div>
        </div>

        <button
          class="icon-button"
          aria-label="Minimizar rádio"
          @click="expanded = false"
        >
          <ChevronDown :size="19" />
        </button>
      </div>

      <div class="now-playing">
        <div class="disc" :class="{ spinning: playing }">
          <Music2 :size="28" />
        </div>

        <strong>{{ currentTrack.title }}</strong>
        <span>{{ currentTrack.artist }}</span>
      </div>

      <!-- Progresso -->
      <div class="progress-section">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          :value="progress"
          aria-label="Posição da música"
          @input="seek(Number(($event.target as HTMLInputElement).value))"
        />

        <div class="time-labels">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Controles -->
      <div class="player-controls">
        <button
          class="icon-button"
          :class="{ active: shuffle }"
          aria-label="Alternar reprodução aleatória"
          @click="shuffle = !shuffle"
        >
          <Shuffle :size="17" />
        </button>

        <button
          class="icon-button"
          aria-label="Música anterior"
          @click="previousTrack"
        >
          <SkipBack :size="21" />
        </button>

        <button
          class="play-button"
          :disabled="loading"
          :aria-label="playing ? 'Pausar' : 'Reproduzir'"
          @click="togglePlay"
        >
          <Pause v-if="playing" :size="23" />
          <Play v-else :size="23" />
        </button>

        <button
          class="icon-button"
          aria-label="Próxima música"
          @click="nextTrack"
        >
          <SkipForward :size="21" />
        </button>

        <button
          class="icon-button"
          :class="{ active: repeat }"
          aria-label="Repetir música atual"
          @click="repeat = !repeat"
        >
          <Repeat :size="17" />
        </button>
      </div>

      <!-- Volume -->
      <div class="volume-control">
        <VolumeX v-if="volume === 0" :size="17" />
        <Volume2 v-else :size="17" />

        <input
          v-model.number="volume"
          type="range"
          min="0"
          max="100"
          aria-label="Volume da música"
        />

        <span>{{ volume }}%</span>
      </div>

      <!-- Playlist -->
      <div class="playlist">
        <div class="playlist-heading">
          <span>PLAYLIST</span>
          <span>{{ playlist.length }} FAIXAS</span>
        </div>

                <button
          v-for="(track, index) in playlist"
          :key="track.id"
          class="playlist-item"
          :class="{ selected: index === currentIndex }"
          @click="changeTrack(index, true)"
        >
          <Music2 :size="16" />

          <span>{{ track.title }}</span>

          <span
            v-if="index === currentIndex && playing"
            class="playing-symbol"
          >
            ♪
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gothic-radio {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 3000;
  font-family: Georgia, serif;
}

.radio-toggle {
  position: relative;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border: 1px solid #d38bab;
  border-radius: 50%;
  background: #291625;
  color: #f3d4df;
  box-shadow: 0 0 25px #b83e7855;
  cursor: pointer;
}

.radio-indicator {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f4a6c7;
  box-shadow: 0 0 8px #f4a6c7;
}

.radio-panel {
  width: min(340px, calc(100vw - 30px));
  max-height: min(650px, calc(100dvh - 40px));
  overflow-y: auto;
  padding: 18px;
  border: 1px solid #9e557b;
  border-radius: 15px;
  background: rgba(22, 12, 24, 0.97);
  box-shadow: 0 15px 50px #0009;
  color: #f3d4df;
  backdrop-filter: blur(15px);
}

.radio-header,
.radio-brand,
.player-controls,
.volume-control,
.time-labels,
.playlist-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.radio-brand {
  justify-content: flex-start;
  gap: 10px;
  color: #e8a0bb;
}

.radio-brand strong {
  display: block;
  font-size: 15px;
}

.radio-brand small {
  display: block;
  margin-top: 4px;
  font-size: 8px;
  letter-spacing: 1.5px;
  color: #b88ca5;
}

.icon-button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #d7a7bd;
  cursor: pointer;
}

.icon-button.active {
  color: #ff80b6;
  filter: drop-shadow(0 0 5px #ff80b688);
}

.now-playing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  margin: 20px 0;
}

.disc {
  display: grid;
  place-items: center;
  width: 90px;
  height: 90px;
  margin-bottom: 8px;
  border: 2px solid #b76a92;
  border-radius: 50%;
  background:
    radial-gradient(circle, #59304c 0%, #211222 70%);
  color: #e8a0bb;
}

.disc.spinning {
  animation: rotateDisc 7s linear infinite;
}

.now-playing strong {
  font-size: 16px;
  text-align: center;
}

.now-playing span {
  color: #b88ca5;
  font-size: 12px;
}

.progress-section input,
.volume-control input {
  width: 100%;
  accent-color: #e8a0bb;
  cursor: pointer;
}

.time-labels {
  margin-top: 5px;
  color: #a88a9e;
  font-size: 11px;
}

.player-controls {
  justify-content: center;
  gap: 12px;
  margin: 18px 0;
}

.play-button {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid #e8a0bb;
  border-radius: 50%;
  background: #87345e;
  color: white;
  cursor: pointer;
}

.volume-control {
  gap: 12px;
  color: #d7a7bd;
}

.volume-control span {
  min-width: 35px;
  font-size: 11px;
}

.playlist {
  margin-top: 22px;
  border-top: 1px solid #57324c;
  padding-top: 15px;
}

.playlist-heading {
  margin-bottom: 10px;
  color: #c79ab2;
  font-size: 10px;
  letter-spacing: 1px;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: #e8ceda;
  text-align: left;
  cursor: pointer;
}

.playlist-item span:nth-child(2) {
  flex: 1;
}

.playlist-item.selected {
  background: #49263e;
  color: #ffc3dc;
}

.playlist-item:hover {
  background: #392036;
}

.playing-symbol {
  color: #f4a6c7;
}


.resume-music {
  position: fixed;
  bottom: 85px;
  right: 20px;
  z-index: 3001;

  padding: 12px 18px;
  border: 1px solid #c77d9f;
  border-radius: 30px;

  background: #281523;
  color: #f4d4e1;

  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;

  box-shadow: 0 0 20px #b83e7844;
  cursor: pointer;
}

@media (max-width: 480px) {
  .resume-music {
    right: 12px;
    bottom: 75px;
    max-width: calc(100vw - 24px);
  }
}


@keyframes rotateDisc {
  to {
    transform: rotate(360deg);
  }
}


@media (max-width: 480px) {
  .gothic-radio {
    position: fixed;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    z-index: 3000;
  }

  .radio-toggle {
    width: 48px;
    height: 48px;
  }

  .radio-panel {
    width: min(340px, calc(100vw - 24px));
    max-height: min(
      560px,
      calc(100dvh - 35px - env(safe-area-inset-bottom))
    );
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 15px;
  }

  .player-controls {
    gap: 8px;
  }

  .playlist-item {
    min-height: 44px;
  }
}


@media (prefers-reduced-motion: reduce) {
  .disc.spinning {
    animation: none;
  }
}
</style>
