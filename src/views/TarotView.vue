
<script setup lang="ts">
import {
  ref,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
} from 'vue'
import { gsap } from 'gsap'
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-vue-next'

import TarotCard from '../components/tarot/TarotCard.vue'
import { tarotCards } from '../data/tarotCards'
import TarotInterpretation from '../components/tarot/TarotInterpretation.vue'
import { useSoundEffects } from '../composables/useSoundEffects'

const { playSound } = useSoundEffects()

type Phase =
  | 'intro'
  | 'shuffling'
  | 'ready'
  | 'drawing'
  | 'revealed'
  | 'placing'
  | 'complete'

const phase = ref<Phase>('intro')
const placedCount = ref(0)
const faceUp = ref(false)
const interpretationOpen = ref(false)
const showInterpretation = ref(false)

const deckRef = ref<HTMLElement | null>(null)
const flyingRef = ref<HTMLElement | null>(null)
const slotsRef = ref<(HTMLElement | null)[]>([])

const readingQuestion = 'O que permanece quando algo se quebra?'
const readingPositions = [
    'O que foi quebrado?',
    'O que ficou depois da perda?',
    'O que o silencio revelou?',
    'O que precisa ser reconhecido?',
    'O que precisa mudar?',
    'O que ainda pode florecer?',
]


async function startReading() {
  phase.value = 'shuffling'

  await nextTick()

  await shuffleDeck()
}

const activeCard = computed(
  () => tarotCards[placedCount.value]
)

let animation: gsap.core.Timeline | null = null
let destroyed = false

function setSlot(el: Element | null, index: number) {
  slotsRef.value[index] = el as HTMLElement | null
}

function rectOf(el: HTMLElement) {
  const r = el.getBoundingClientRect()

  return {
    x: r.left,
    y: r.top,
    width: r.width,
    height: r.height,
  }
}

function positionFlying(rect: ReturnType<typeof rectOf>) {
  if (!flyingRef.value) return

  gsap.set(flyingRef.value, {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    opacity: 1,
    rotation: 0,
    scale: 1,
  })
}

/*
 * Define onde a carta será revelada.
 * Reserva espaço para a mensagem e o botão.
 */

function responsiveCenterRect() {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  const isMobile = screenWidth <= 600

  // Espaço reservado para mensagem e botão
  const bottomReserved = isMobile ? 190 : 210

  // Margem superior de segurança
  const topReserved = isMobile ? 20 : 35

  const availableHeight = Math.max(
    100,
    screenHeight - topReserved - bottomReserved
  )

  // Proporção das cartas: 2 / 3
  const maxWidth = isMobile ? 230 : 310

  const cardWidth = Math.min(
    maxWidth,
    screenWidth * (isMobile ? 0.58 : 0.45),
    (availableHeight * 2) / 3
  )

  const cardHeight = cardWidth * 1.5

  const x = (screenWidth - cardWidth) / 2

  const y =
    topReserved +
    (availableHeight - cardHeight) / 2

  return {
    x,
    y,
    width: cardWidth,
    height: cardHeight,
  }
}


/*
 * Embaralhamento do baralho
 */

async function shuffleDeck() {
    playSound('shuffle', 0.20)
  phase.value = 'shuffling'

  await nextTick()

  if (destroyed || !deckRef.value) return

  const deck = deckRef.value
  const layers = deck.querySelectorAll('.deck-layer')

  // Interrompe animações anteriores
  animation?.kill()

  // Restaura o posicionamento natural do baralho
  gsap.set(deck, {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
  })

  gsap.set(layers, {
    x: 0,
    y: 0,
    rotation: 0,
  })

  // Aguarda a atualização visual do navegador
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })

  if (destroyed || !deckRef.value) return

  // Posição natural do baralho
  const rect = deck.getBoundingClientRect()

  // Centro da área visível
  const centerX =
    window.innerWidth / 2 -
    (rect.left + rect.width / 2)

  const centerY =
    window.innerHeight / 2 -
    (rect.top + rect.height / 2)

  // Move instantaneamente para o centro
  gsap.set(deck, {
    x: centerX,
    y: centerY,
    scale: 1,
  })

  // Cria a animação
  animation = gsap.timeline({
    onComplete: () => {
      if (!destroyed) {
        phase.value = 'ready'
      }
    },
  })

  // Embaralha três vezes
  for (let repeat = 0; repeat < 3; repeat++) {
    animation.to(layers, {
      x: (i: number) => (i - 1) * 55,
      y: (i: number) => (i % 2 ? -24 : 12),
      rotation: (i: number) => (i - 1) * 17,
      duration: 0.35,
      stagger: 0.06,
      ease: 'power2.out',
    })

    animation.to(layers, {
      x: 0,
      y: 0,
      rotation: (i: number) => (i - 1) * 3,
      duration: 0.35,
      stagger: 0.05,
      ease: 'power2.inOut',
    })
  }

  // Retorna suavemente à posição abaixo da tiragem
  animation.to(deck, {
    x: 0,
    y: 0,
    scale: 0.88,
    duration: 1.1,
    ease: 'power3.inOut',
  })
}



/*
 * Retirar uma carta do baralho
 */

async function drawCard() {
  if (phase.value !== 'ready' || !deckRef.value) {
    return
  }

  // Captura a posição original do baralho
  const origin = rectOf(deckRef.value)

  phase.value = 'drawing'
  faceUp.value = false

  // Aguarda a carta animada aparecer no DOM
  await nextTick()

  if (destroyed || !flyingRef.value) {
    return
  }

  // Calcula o destino de acordo com a tela
  const target = responsiveCenterRect()

  // Posiciona a carta sobre o baralho
  positionFlying(origin)

  animation?.kill()

  animation = gsap.timeline({
    onComplete: () => {
      if (destroyed) return

      // Revela a frente da carta
      faceUp.value = true
      phase.value = 'revealed'
      playSound('reveal', 0.25)
    },
  })

  animation.to(flyingRef.value, {
    x: target.x,
    y: target.y,
    width: target.width,
    height: target.height,
    rotation: 360,
    duration: 0.85,
    ease: 'power3.inOut',
  })
}

/*
 * Guardar carta na tiragem
 */
function placeCard() {
  if (
    phase.value !== 'revealed' ||
    !flyingRef.value
  ) {
    return
  }

  const index = placedCount.value
  const slot = slotsRef.value[index]

  if (!slot) {
    console.error(
      'Espaço da carta não encontrado:',
      index
    )
    return
  }

  playSound('place', 0.2)

  const destination = rectOf(slot)
  const flying = flyingRef.value

  phase.value = 'placing'

  animation?.kill()

  animation = gsap.timeline({
    onComplete: () => {
      if (destroyed) return

      // Oculta a carta animada antes de
      // renderizar a carta definitiva.
      gsap.set(flying, {
        opacity: 0,
      })

      placedCount.value++
      faceUp.value = false

      phase.value =
        placedCount.value === tarotCards.length
          ? 'complete'
          : 'ready'
    },
    
  })

  animation.to(flying, {
    x: destination.x,
    y: destination.y,
    width: destination.width,
    height: destination.height,
    rotation: 0,
    duration: 0.75,
    ease: 'power3.inOut',
  })
}

/*
 * Reiniciar a tiragem
 */

function restart() {
  animation?.kill()

  placedCount.value = 0
  faceUp.value = false
  interpretationOpen.value = false
  showInterpretation.value = false

  slotsRef.value = []

  if (flyingRef.value) {
    gsap.set(flyingRef.value, {
      opacity: 0,
    })
  }

  if (deckRef.value) {
    gsap.set(deckRef.value, {
      scale: 1,
      x: 0,
      y: 0,
    })
  }

  phase.value = 'intro'
}

// O embaralhamento começa após a introdução.

onUnmounted(() => {
  destroyed = true
  animation?.kill()
})

onMounted(() => {
  // A introdução deve aparecer primeiro.
  // O embaralhamento só começa após
  // a usuária clicar em "Consultar as cartas".
})

</script>


<template>
  <main class="tarot-page">
    <div class="ambient"></div>

    <!-- INTRODUÇÃO AO ORÁCULO -->
    <Transition name="intro-fade">
      <section
        v-if="phase === 'intro'"
        class="tarot-intro"
      >
        <div class="intro-ornament">
          <Sparkles :size="24" />
        </div>

        <span class="intro-eyebrow">
          O ORÁCULO DAS SEIS CARTAS
        </span>

        <h2 class="intro-question">
          {{ readingQuestion }}
        </h2>

        <div class="intro-divider">
          <span></span>
          <span>✦</span>
          <span></span>
        </div>

        <p class="intro-description">
          Algumas histórias deixam marcas.
          Outras deixam palavras que nunca chegaram
          a ser ditas.
        </p>

        <p class="intro-instruction">
          Diante de você estão seis cartas.
          Cada uma guarda um fragmento de uma resposta.
          Escolha uma de cada vez e descubra
          o que elas têm a revelar.
        </p>

        <button
          type="button"
          class="intro-button"
          @click="startReading"
        >
          Consultar as cartas
          <ArrowRight :size="17" />
        </button>
      </section>
    </Transition>

    <!-- CONTEÚDO PRINCIPAL DA TIRAGEM -->
    <template v-if="phase !== 'intro'">

      <!-- Cabeçalho -->
      <header class="heading">
        <div class="eyebrow">
          <Sparkles :size="14" />
          <span>O QUE AS CARTAS REVELAM?</span>
        </div>

        <h1 class="font-romantic">
          Uma história em seis cartas
        </h1>

        <p>
          {{ readingQuestion }}
        </p>
      </header>

      <!-- Seis espaços da tiragem -->
      <section class="reading">
        <div class="slots">
          <div
            v-for="(card, index) in tarotCards"
            :key="card.id"
            :ref="el => setSlot(el as Element | null, index)"
            class="slot"
            :class="{ filled: index < placedCount }"
          >
            <!-- Carta posicionada -->
            <TarotCard
              v-if="index < placedCount"
              :card="card"
              revealed
            />

            <!-- Pergunta da posição vazia -->
            <div v-else class="slot-placeholder">
              <span class="slot-number">
                {{ String(index + 1).padStart(2, '0') }}
              </span>

              <span class="slot-label">
                {{ readingPositions[index] }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Baralho -->
      <div
        v-if="phase !== 'complete'"
        ref="deckRef"
        class="deck-container"
      >
        <button
          class="deck-button"
          type="button"
          :disabled="phase !== 'ready'"
          aria-label="Retirar uma carta do baralho"
          @click="drawCard"
        >
          <div class="deck-layer"></div>
          <div class="deck-layer"></div>

          <div class="deck-layer">
            <TarotCard />
          </div>
        </button>

        <p class="deck-hint">
          {{
            phase === 'shuffling'
              ? 'Embaralhando as cartas...'
              : phase === 'ready'
                ? 'Toque no baralho para retirar uma carta'
                : 'Aguarde a revelação...'
          }}
        </p>
      </div>

      <!-- Overlay da revelação -->
      <div
        v-if="
          phase === 'drawing' ||
          phase === 'revealed' ||
          phase === 'placing'
        "
        class="overlay"
      >
        <div class="overlay-shade"></div>

        <!-- Carta animada pelo GSAP -->
        <div
          ref="flyingRef"
          class="flying-card"
        >
          <TarotCard
            :card="activeCard"
            :revealed="faceUp"
          />
        </div>

        <!-- Mensagem abaixo da carta -->
        <Transition name="fade">
          <div
            v-if="phase === 'revealed'"
            class="reveal-content"
          >
            <div class="reveal-message">
              <h2>{{ activeCard.name }}</h2>
              <p>{{ activeCard.message }}</p>
            </div>

            <button
              type="button"
              class="place-button"
              @click="placeCard"
            >
              Guardar na tiragem
            </button>
          </div>
        </Transition>
      </div>

      <!-- Finalização da tiragem -->
      <Transition name="fade">
        <div
          v-if="phase === 'complete'"
          class="completion"
        >
          <Sparkles :size="27" />

          <h2 class="font-romantic">
            As seis cartas foram reveladas.
          </h2>

          <p>
            A resposta está diante de você.
            Mas cada carta ainda tem algo a contar.
          </p>

          <button
            class="action-button"
            type="button"
            @click="showInterpretation = true"
          >
            Descobrir a interpretação
            <ArrowRight :size="17" />
          </button>

          <button
            class="restart-button"
            type="button"
            @click="restart"
          >
            <RotateCcw :size="15" />
            Recomeçar
          </button>
        </div>
      </Transition>

      <!-- Contador -->
      <div class="counter">
        {{ placedCount }} / {{ tarotCards.length }} CARTAS
      </div>
    </template>

    <!-- Interpretação cinematográfica -->
    <TarotInterpretation
      v-if="showInterpretation"
      @close="showInterpretation = false"
    />
  </main>
</template>


<style scoped>
/* Página */
.tarot-page {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  padding: 45px 20px 230px;
  color: #f2e8e4;
  background: #0d0b10;
}

.ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 40%,
    #351624 0%,
    #0d0b10 75%
  );
}

/* Cabeçalho e leitura */
.heading,
.reading,
.completion {
  position: relative;
  z-index: 1;
}

.heading {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 55px;
}

.eyebrow {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #c9a46a;
  font-size: 10px;
  letter-spacing: 3px;
  margin-bottom: 20px;
}

h1 {
  font-size: clamp(42px, 7vw, 70px);
  font-weight: 500;
  line-height: 1;
}

.heading p {
  max-width: 390px;
  margin: 22px auto 0;
  font-size: 14px;
  line-height: 1.8;
  color: #b6a8af;
}

.reading {
  max-width: 550px;
  margin: 0 auto;
}

/* Grade das cartas */
.slots {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(10px, 3vw, 25px);
}

.slot {
  position: relative;
  aspect-ratio: 2 / 3;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px dashed #674452;
  border-radius: 9px;
  background: #1b111b;
}

.slot.filled {
  border: 1px solid #c9a46a;
  background: #160f19;
}

.slot :deep(.tarot-card) {
  width: 100%;
  height: 100%;
}

.slot-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #a88b91;
  text-align: center;
  padding: 8px;
}

.slot-number {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  color: #c9a46a;
}

.slot-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(11px, 1.5vw, 16px);
}

/* Baralho */
.deck-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 55px auto 0;
  width: max-content;
}

.deck-button {
  position: relative;
  width: 90px;
  height: 135px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.deck-button:disabled {
  cursor: default;
}

.deck-layer {
  position: absolute;
  inset: 0;
  border-radius: 9px;
  background: #341628;
  border: 1px solid #c9a46a;
}

.deck-layer:nth-child(1) {
  transform: rotate(-3deg);
}

.deck-layer:nth-child(2) {
  transform: rotate(3deg);
}

.deck-layer:nth-child(3) {
  overflow: hidden;
}

.deck-hint {
  margin-top: 20px;
  font-size: 12px;
  color: #c9a46a;
  text-align: center;
  max-width: 230px;
  line-height: 1.6;
}

/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  pointer-events: none;
}

.overlay-shade {
  position: absolute;
  inset: 0;
  background: #08060acb;
}

.flying-card {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: 0;
  transform-origin: center;
  will-change: transform, width, height;
  pointer-events: none;
}

/* Mensagem da carta */
.reveal-content {
  position: absolute;
  left: 50%;
  bottom: max(24px, env(safe-area-inset-bottom));
  transform: translateX(-50%);

  max-height: 35dvh;
  overflow-y: auto;

  z-index: 20;
  pointer-events: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  width: min(90vw, 500px);
  text-align: center;
}

@media (max-width: 600px) {
  .reveal-content {
    bottom: max(12px, env(safe-area-inset-bottom));
    max-height: 38dvh;
  }
}

.reveal-message {
  width: 100%;
  padding: 14px 20px;
  border: 1px solid #9d7456;
  border-radius: 12px;
  background: rgba(24, 12, 22, 0.96);
}

.reveal-message h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(22px, 4vw, 28px);
  color: #d9b782;
  margin: 0 0 8px;
}

.reveal-message p {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(15px, 3vw, 19px);
  color: #ead8d6;
  line-height: 1.4;
  margin: 0;
}

/* Botão de guardar */
.place-button {
  position: relative;
  z-index: 21;

  padding: 13px 28px;
  border: 1px solid #a27b50;
  border-radius: 10px;

  background: #711f35;
  color: #fff1ed;

  font-family: 'Cormorant Garamond', serif;
  font-size: 19px;
  letter-spacing: 0.5px;

  cursor: pointer;
  pointer-events: auto;

  transition:
    background 0.25s,
    transform 0.25s;
}

.place-button:hover {
  background: #912e4a;
  transform: translateY(-2px);
}

/* Botões gerais */
.action-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 14px;

  background: #711f35;
  color: #fff1ed;
  padding: 16px 24px;

  border: 1px solid #a14a60;
  text-decoration: none;

  font-size: 12px;
  letter-spacing: 1px;

  cursor: pointer;
  transition: background 0.25s;
}

.action-button:hover {
  background: #912e4a;
}

/* Conclusão */
.completion {
  max-width: 520px;
  margin: 45px auto 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  text-align: center;
  color: #c9a46a;
}

.completion h2 {
  font-size: 38px;
  font-weight: 500;
}

.completion > p {
  color: #b6a8af;
}

.interpretation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 20px;

  color: #c9b9bd;
  line-height: 1.7;
  font-size: 14px;
}

.interpretation strong {
  display: block;
  color: #c9a46a;
  font-family: 'Cormorant Garamond', serif;
  font-size: 23px;
}

.closing {
  font-style: italic;
}

.restart-button {
  display: flex;
  gap: 8px;
  align-items: center;

  background: transparent;
  border: none;
  color: #a78c96;
  cursor: pointer;
}

/* Contador */
.counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);

  color: #806875;
  font-size: 11px;
  letter-spacing: 2px;
  white-space: nowrap;
}

/* Transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 480px) {
  .tarot-page {
    padding-top: 35px;
  }

  .heading {
    margin-bottom: 35px;
  }

  .deck-container {
    margin-top: 40px;
  }

  .reveal-content {
    width: 92vw;
  }

  .reveal-message {
    padding: 12px 14px;
  }
}

@media (max-height: 650px) {
  .reveal-content {
    bottom: 12px;
    gap: 8px;
  }

  .reveal-message {
    padding: 8px 12px;
  }

  .reveal-message h2 {
    font-size: 20px;
    margin-bottom: 4px;
  }

  .reveal-message p {
    font-size: 14px;
  }

  .place-button {
    padding: 8px 18px;
    font-size: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}


/* Introdução ao oráculo */
.tarot-intro {
  position: absolute;
  z-index: 5;

  inset: 0;
  min-height: 100svh;
  width: 100%;
  max-width: none;
  margin: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 24px;
  padding: 45px 20px;
  text-align: center;
}

.intro-ornament {
  color: #c9a46a;
  filter: drop-shadow(0 0 15px #c9a46a66);
  animation: introGlow 3s ease-in-out infinite;
}

.intro-eyebrow {
  color: #c9a46a;
  font-size: 11px;
  letter-spacing: 4px;
}

.intro-question {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(43px, 8vw, 78px);
  font-weight: 500;
  line-height: 1.05;
  color: #e5c68f;
  text-shadow: 0 0 35px #c9a46a22;
}

.intro-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #c9a46a;
}

.intro-divider span:first-child,
.intro-divider span:last-child {
  width: 70px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    #a27b50
  );
}

.intro-divider span:last-child {
  transform: rotate(180deg);
}

.intro-description {
  max-width: 520px;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(22px, 4vw, 30px);
  font-style: italic;
  line-height: 1.4;
  color: #ead8d6;
}

.intro-instruction {
  max-width: 430px;
  color: #a995a2;
  font-size: 14px;
  line-height: 1.9;
}

.intro-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  margin-top: 12px;
  padding: 16px 30px;

  background: #711f35;
  border: 1px solid #b36b78;
  border-radius: 8px;

  color: #fff1ed;
  font-size: 13px;
  letter-spacing: 1px;

  cursor: pointer;
  transition:
    background 0.3s,
    transform 0.3s,
    box-shadow 0.3s;
}

.intro-button:hover {
  background: #922e4c;
  transform: translateY(-3px);
  box-shadow: 0 0 25px #922e4c55;
}

.intro-fade-enter-active,
.intro-fade-leave-active {
  transition: opacity 0.6s ease;
}

.intro-fade-enter-from,
.intro-fade-leave-to {
  opacity: 0;
}

@keyframes introGlow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.95);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@media (max-width: 480px) {
  .tarot-intro {
    min-height: calc(100svh - 265px);
    gap: 20px;
    padding: 30px 10px;
  }

  .intro-eyebrow {
    font-size: 9px;
    letter-spacing: 2px;
  }

  .intro-divider span:first-child,
  .intro-divider span:last-child {
    width: 45px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro-ornament {
    animation: none;
  }

  .intro-fade-enter-active,
  .intro-fade-leave-active {
    transition: none;
  }
}




@media (max-width: 600px) {
  .tarot-page {
    min-height: 100svh;
    padding: 28px 12px 90px;
  }

  .heading {
    padding: 0 8px;
    margin-bottom: 24px;
  }

  .heading h1 {
    font-size: clamp(30px, 8vw, 44px);
    line-height: 1.1;
  }

  .heading p {
    font-size: 13px;
    line-height: 1.6;
  }

  /* Tiragem de seis cartas */
  .slots {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
    width: 100%;
    max-width: 390px;
    margin-inline: auto;
  }

  .slot {
    width: 100%;
    min-width: 0;
    aspect-ratio: 2 / 3;
  }

  .slot-number {
    font-size: 17px;
  }

  .slot-label {
    font-size: 9px;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  /* Carta revelada */
  .flying-card {
    width: min(58vw, 230px);
    aspect-ratio: 2 / 3;
  }

  .reveal-content {
    width: min(92vw, 390px);
    max-width: 100%;
  }

  .reveal-message h2 {
    font-size: 29px;
  }

  .reveal-message p {
    font-size: 16px;
    line-height: 1.5;
  }

  .place-button {
    min-height: 46px;
    padding: 12px 18px;
  }

  .counter {
    font-size: 10px;
    letter-spacing: 2px;
  }
}



/* =========================================
   RESPONSIVIDADE — TAROT
========================================= */

@media (max-width: 600px) {
  .tarot-page {
    min-height: 100svh;
    padding: 28px 12px 110px;
  }

  /* Cabeçalho */
  .heading {
    max-width: 100%;
    padding: 0 8px;
    margin-bottom: 28px;
  }

  .heading h1 {
    font-size: clamp(30px, 8vw, 44px);
    line-height: 1.1;
  }

  .heading p {
    max-width: 330px;
    margin-top: 14px;
    font-size: 13px;
    line-height: 1.6;
  }

  .eyebrow {
    font-size: 9px;
    letter-spacing: 2px;
    gap: 8px;
  }

  /* Grade das seis cartas */
  .reading {
    width: 100%;
    max-width: 390px;
  }

  .slots {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
  }

  .slot {
    width: 100%;
    min-width: 0;
    aspect-ratio: 2 / 3;
    border-radius: 6px;
  }

  .slot-placeholder {
    gap: 5px;
    padding: 5px;
  }

  .slot-number {
    font-size: 18px;
  }

  .slot-label {
    font-size: clamp(9px, 2.5vw, 12px);
    line-height: 1.15;
    overflow-wrap: anywhere;
  }

  /* Baralho */
  .deck-container {
    margin-top: 35px;
  }

  .deck-button {
    width: 76px;
    height: 114px;
  }

  .deck-hint {
    margin-top: 14px;
    font-size: 11px;
  }

  /* Carta animada:
     Não definir width, height, top ou left aqui.
     O GSAP controla essas propriedades. */

  .flying-card {
    transform-origin: center;
  }

  /* Mensagem e botão */
  .reveal-content {
    width: min(92vw, 390px);
    max-width: 100%;
    bottom: max(12px, env(safe-area-inset-bottom));
    gap: 10px;
  }

  .reveal-message {
    padding: 12px 15px;
    border-radius: 10px;
  }

  .reveal-message h2 {
    font-size: 25px;
    margin-bottom: 5px;
  }

  .reveal-message p {
    font-size: 15px;
    line-height: 1.35;
  }

  .place-button {
    min-height: 44px;
    padding: 10px 22px;
    font-size: 17px;
  }

  /* Conclusão */
  .completion {
    margin-top: 35px;
    gap: 14px;
    padding: 0 12px;
  }

  .completion h2 {
    font-size: clamp(28px, 7vw, 38px);
  }

  .counter {
    font-size: 10px;
    letter-spacing: 2px;
  }

  /* Introdução */
  .tarot-intro {
    min-height: calc(100svh - 170px);
    gap: 18px;
    padding: 30px 10px;
  }

  .intro-eyebrow {
    font-size: 9px;
    letter-spacing: 2px;
  }

  .intro-question {
    font-size: clamp(36px, 10vw, 55px);
    line-height: 1.08;
  }

  .intro-description {
    font-size: clamp(21px, 5.5vw, 27px);
  }

  .intro-instruction {
    font-size: 13px;
    line-height: 1.7;
  }

  .intro-button {
    min-height: 46px;
    padding: 13px 22px;
  }

  .intro-divider span:first-child,
  .intro-divider span:last-child {
    width: 45px;
  }
}

/* Celulares muito estreitos */
@media (max-width: 360px) {
  .tarot-page {
    padding-inline: 9px;
  }

  .slots {
    gap: 6px;
  }

  .slot-label {
    font-size: 9px;
  }

  .reveal-message p {
    font-size: 14px;
  }

  .intro-question {
    font-size: 34px;
  }
}

/* Telas baixas ou celular na horizontal */
@media (max-height: 650px) {
  .reveal-content {
    bottom: 8px;
    gap: 7px;
  }

  .reveal-message {
    padding: 8px 12px;
  }

  .reveal-message h2 {
    font-size: 20px;
    margin-bottom: 4px;
  }

  .reveal-message p {
    font-size: 14px;
    line-height: 1.25;
  }

  .place-button {
    min-height: 38px;
    padding: 8px 16px;
    font-size: 16px;
  }

  .tarot-intro {
    min-height: auto;
  }
}

</style>
