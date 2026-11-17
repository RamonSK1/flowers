
<script setup lang="ts">
import {
  ref,
  computed,
  nextTick,
  watch,
  onUnmounted,
} from 'vue'

import { gsap } from 'gsap'
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-vue-next'

import TarotCard from './TarotCard.vue'
import { tarotCards } from '../../data/tarotCards'

const emit = defineEmits<{
  close: []
}>()

const currentIndex = ref(0)
const finished = ref(false)
const animating = ref(false)

const sceneRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

const currentCard = computed(
  () => tarotCards[currentIndex.value]
)

type CardEffect =
  | 'tower'
  | 'cups'
  | 'hermit'
  | 'justice'
  | 'temperance'
  | 'star'

const effects: CardEffect[] = [
  'tower',
  'cups',
  'hermit',
  'justice',
  'temperance',
  'star',
]

const currentEffect = computed(
  () => effects[currentIndex.value] ?? 'star'
)

const particles = Array.from(
  { length: 18 },
  (_, index) => ({
    id: index,
    x: 5 + ((index * 37) % 90),
    delay: (index % 7) * 0.4,
    duration: 2.5 + (index % 5) * 0.5,
  })
)

let timeline: gsap.core.Timeline | null = null

const readingPositions = [
  'O que foi quebrado?',
  'O que ficou depois da perda?',
  'O que o silêncio ensinou?',
  'O que precisa ser reconhecido?',
  'O que precisa mudar?',
  'O que ainda pode florescer?',
]

async function animateScene() {
  await nextTick()

  if (!sceneRef.value || !cardRef.value || !textRef.value) {
    return
  }

  timeline?.kill()
  animating.value = true

  const card = cardRef.value
  const text = textRef.value
  const lightning = card.querySelector('.lightning-flash')

  timeline = gsap.timeline({
    onComplete: () => {
      animating.value = false
    },
  })

  // Entrada da carta
  timeline.fromTo(
    card,
    {
      opacity: 0,
      y: 60,
      scale: 0.85,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
    }
  )

  // Efeito exclusivo da Torre
  if (currentEffect.value === 'tower') {
    if (lightning) {
      timeline.fromTo(
        lightning,
        { opacity: 0 },
        {
          opacity: 0.85,
          duration: 0.08,
          repeat: 3,
          yoyo: true,
          ease: 'none',
        }
      )

      timeline.set(lightning, {
        opacity: 0,
      })
    }

    timeline.to(card, {
      x: 7,
      duration: 0.05,
      repeat: 7,
      yoyo: true,
      ease: 'none',
    })

    timeline.set(card, {
      x: 0,
    })
  }

  // Entrada da mensagem
  timeline.fromTo(
    text.children,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
    },
    '-=0.2'
  )
}



async function nextCard() {
  if (animating.value) return

  if (currentIndex.value < tarotCards.length - 1) {
    currentIndex.value++
  } else {
    finished.value = true
  }
}

async function previousCard() {
  if (animating.value) return

  if (finished.value) {
    finished.value = false
    return
  }

  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}


watch(
  [currentIndex, finished],
  async () => {
    timeline?.kill()
    animating.value = false

    if (!finished.value) {
      await animateScene()
    }
  },
  {
    immediate: true,
    flush: 'post',
  }
)

onUnmounted(() => {
  timeline?.kill()
})
</script>

<template>
  <div class="interpretation-overlay">
    <div class="interpretation-background"></div>

    <button
      class="close-button"
      type="button"
      aria-label="Fechar interpretação"
      @click="emit('close')"
    >
      ✕
    </button>

    <div
      v-if="!finished"
      :key="currentIndex"
      ref="sceneRef"
      class="interpretation-scene"
    >
      <div class="scene-progress">
        REVELAÇÃO
        {{ String(currentIndex + 1).padStart(2, '0') }}
        /
        {{ String(tarotCards.length).padStart(2, '0') }}
      </div>

      
<div
  ref="cardRef"
  class="scene-card"
  :class="`effect-${currentEffect}`"
>
  <!-- Aura atrás da carta -->
  <div class="card-aura"></div>

  <!-- Relâmpago da Torre -->
  <div
    v-if="currentEffect === 'tower'"
    class="lightning-flash"
  ></div>

  <!-- Partículas do Cinco de Copas -->
  <div
    v-if="currentEffect === 'cups'"
    class="particles"
  >
    <span
      v-for="particle in particles"
      :key="particle.id"
      class="falling-particle"
      :style="{
        left: `${particle.x}%`,
        animationDelay: `${particle.delay}s`,
        animationDuration: `${particle.duration}s`,
      }"
    ></span>
  </div>

  <!-- Luz do Eremita -->
  <div
    v-if="currentEffect === 'hermit'"
    class="hermit-light"
  ></div>

  <!-- Linha dourada da Justiça -->
  <div
    v-if="currentEffect === 'justice'"
    class="justice-line"
  ></div>

  <!-- Brilho da Temperança -->
  <div
    v-if="currentEffect === 'temperance'"
    class="temperance-glow"
  ></div>

  <!-- Estrelas -->
  <div
    v-if="currentEffect === 'star'"
    class="star-particles"
  >
    <span
      v-for="particle in particles"
      :key="particle.id"
      class="star-particle"
      :style="{
        left: `${particle.x}%`,
        top: `${10 + ((particle.id * 29) % 80)}%`,
        animationDelay: `${particle.delay}s`,
      }"
    >
      ✦
    </span>
  </div>

  <!-- Carta original -->
  <TarotCard
    :key="currentCard.id"
    :card="currentCard"
    revealed
  />
</div>


      <div ref="textRef" class="scene-text">
        <span class="scene-meaning">
          <p class="scene-question">
          {{ readingPositions[currentIndex] }}
          </p>
          {{ currentCard.meaning }}
        </span>

        <h2>{{ currentCard.name }}</h2>

        <p>{{ currentCard.message }}</p>
      </div>

      <div class="scene-actions">
        <button
          type="button"
          class="secondary-button"
          :disabled="animating || currentIndex === 0"
          @click="previousCard"
        >
          <ArrowLeft :size="16" />
          Anterior
        </button>

        <button
          type="button"
          class="primary-button"
          :disabled="animating"
          @click="nextCard"
        >
          {{
            currentIndex === tarotCards.length - 1
              ? 'Revelar a mensagem final'
              : 'Próxima revelação'
          }}
          <ArrowRight :size="16" />
        </button>
      </div>
    </div>

    
    <div v-else class="final-scene">
      <Sparkles :size="30" class="final-icon" />
    
      <span class="final-eyebrow">
        A RESPOSTA DAS SEIS CARTAS
      </span>
    
      <h2>
        O que permanece quando algo se quebra?
      </h2>
    
      <p>
        Permanecem as consequências das escolhas,
        a memória do que foi perdido e a responsabilidade
        por aquilo que aconteceu.
      </p>
    
      <p>
        A Torre revelou a ruptura.
        O Cinco de Copas mostrou o arrependimento.
        O Eremita trouxe a reflexão.
        A Justiça exigiu responsabilidade.
        A Temperança falou sobre mudança.
        E a Estrela deixou espaço para a esperança.
      </p>
    
      <p>
        Nenhuma dessas cartas pode apagar o passado.
        Nenhuma delas promete que tudo voltará
        a ser como antes.
      </p>
    
      <p class="final-closing">
        Mas talvez o que permaneça seja a vontade
        sincera de reconhecer os erros,
        aprender com eles e finalmente dizer
        aquilo que ficou em silêncio.
      </p>
    
      <RouterLink
        to="/bouquet"
        class="primary-button"
      >
        Há algo que gostaria de te entregar...
        <ArrowRight :size="17" />
      </RouterLink>
    
      <button
        class="secondary-button"
        type="button"
        @click="previousCard"
      >
        <ArrowLeft :size="16" />
        Voltar à última carta
      </button>
    </div>

  </div>
</template>

<style scoped>
.interpretation-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow-y: auto;
  background: #0b080e;
  color: #f2e8e4;
}

.interpretation-background {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at 50% 35%,
      #421b30 0%,
      #160d19 45%,
      #09070c 100%
    );
}

.close-button {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 110;
  border: 1px solid #7b5260;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  background: #24131e;
  color: #f2e8e4;
  cursor: pointer;
}

.interpretation-scene {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  width: min(100%, 700px);
  margin: 0 auto;
  padding: 55px 22px 45px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

.scene-progress {
  color: #c9a46a;
  font-size: 11px;
  letter-spacing: 3px;
}


.scene-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 540px;
}

.scene-meaning {
  color: #c9a46a;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.scene-text h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(35px, 7vw, 56px);
  font-weight: 500;
  line-height: 1;
  color: #e4c18b;
}

.scene-text p {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(19px, 3vw, 25px);
  line-height: 1.4;
  color: #ead8d6;
}

.scene-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 10px;
}

.scene-question {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(20px, 3vw, 27px);
  font-style: italic;
  color: #c9a46a;
  margin-bottom: 6px;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 20px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.25s;
}

.primary-button {
  border: 1px solid #b36b78;
  background: #711f35;
  color: #fff1ed;
}

.primary-button:hover {
  background: #922e4c;
}

.secondary-button {
  border: 1px solid #765461;
  background: transparent;
  color: #d6bfc5;
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.final-scene {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  width: min(100%, 660px);
  margin: 0 auto;
  padding: 90px 24px 70px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  text-align: center;
}

.final-icon {
  color: #c9a46a;
}

.final-eyebrow {
  color: #c9a46a;
  font-size: 11px;
  letter-spacing: 3px;
}

.final-scene h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(38px, 7vw, 65px);
  font-weight: 500;
  line-height: 1.05;
  color: #e4c18b;
}

.final-scene p {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(19px, 3vw, 24px);
  line-height: 1.6;
  color: #d8c5cb;
}

.final-closing {
  font-style: italic;
  color: #e8d2c2 !important;
}


/* Estrutura dos efeitos */
.scene-card {
  position: relative;
  isolation: isolate;

  width: min(205px, 45vw);
  aspect-ratio: 2 / 3;
  flex-shrink: 0;

  filter: drop-shadow(0 0 25px #c9a46a33);
}

.scene-card :deep(.tarot-card) {
  position: relative;
  z-index: 2;
}


/* Aura geral */
.card-aura {
  position: absolute;
  inset: -35%;
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(25px);

  background: radial-gradient(
    circle,
    rgba(201, 164, 106, 0.65) 0%,
    rgba(120, 45, 75, 0.35) 40%,
    transparent 75%
  );
}
/* 1. A TORRE */
.effect-tower .card-aura {
  background: radial-gradient(
    circle,
    #d8b57d66,
    #8e374433 45%,
    transparent 75%
  );
}

.lightning-flash {
  position: absolute;
  inset: -30%;
  z-index: 5;
  background: #fff6df;
  opacity: 0;
  pointer-events: none;
  animation: lightning 1.8s ease-out both;
}

@keyframes lightning {
  0%, 8%, 14%, 100% {
    opacity: 0;
  }

  4% {
    opacity: 0.5;
  }

  11% {
    opacity: 0.3;
  }
}

/* 2. CINCO DE COPAS */
.effect-cups .card-aura {
  background: radial-gradient(
    circle,
    #5c668855,
    transparent 70%
  );
}

.particles {
  position: absolute;
  inset: -20%;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
}

/* Partículas do Cinco de Copas */
.falling-particle {
  position: absolute;
  top: -10px;
  width: 5px;
  height: 16px;
  border-radius: 50%;

  background: #b7c9e8;
  box-shadow: 0 0 12px #b7c9e8;

  opacity: 0;
  animation: falling linear infinite;
}

@keyframes falling {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }

  20% {
    opacity: 0.8;
  }

  85% {
    opacity: 0.5;
  }

  100% {
    transform: translateY(430px);
    opacity: 0;
  }
}

/* 3. O EREMITA */
.effect-hermit .card-aura {
  opacity: 0.7;
  background: radial-gradient(
    circle,
    #e0b66a77,
    transparent 65%
  );
  animation: hermitAura 4s ease-in-out infinite;
}

.hermit-light {
  position: absolute;
  inset: -20%;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(
    circle at 50% 30%,
    #ffe4a533,
    transparent 55%
  );
  animation: hermitAura 4s ease-in-out infinite;
}

@keyframes hermitAura {
  0%, 100% {
    opacity: 0.25;
  }

  50% {
    opacity: 0.85;
  }
}

/* 4. A JUSTIÇA */
.effect-justice .card-aura {
  background: radial-gradient(
    circle,
    #c9a46a55,
    transparent 70%
  );
}

.justice-line {
  position: absolute;
  top: -10%;
  left: 50%;
  width: 2px;
  height: 120%;
  z-index: 4;
  pointer-events: none;

  background: linear-gradient(
    transparent,
    #e9c990,
    transparent
  );

  box-shadow: 0 0 15px #e9c990;
  transform: scaleY(0);
  transform-origin: top;
  animation: justiceReveal 2s ease-out forwards;
}

@keyframes justiceReveal {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }

  30% {
    opacity: 0.8;
  }

  100% {
    transform: scaleY(1);
    opacity: 0;
  }
}

/* 5. A TEMPERANÇA */
.effect-temperance .card-aura {
  background: radial-gradient(
    circle,
    #c29bba77,
    #8d537744 45%,
    transparent 75%
  );

  animation: temperancePulse 4s ease-in-out infinite;
}

.temperance-glow {
  position: absolute;
  inset: -10%;
  z-index: 3;
  border-radius: 18px;
  pointer-events: none;

  box-shadow: 0 0 35px #c9a46a44;
  animation: temperancePulse 4s ease-in-out infinite;
}

@keyframes temperancePulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.98);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* 6. A ESTRELA */
.effect-star .card-aura {
  background: radial-gradient(
    circle,
    #b9a7d077,
    #55688b33 50%,
    transparent 75%
  );
}

.star-particles {
  position: absolute;
  inset: -25%;
  z-index: 4;
  pointer-events: none;
}

/* Estrelas mais visíveis */
.star-particle {
  position: absolute;
  color: #ffe5a5;
  font-size: 20px;
  opacity: 0;

  text-shadow:
    0 0 12px #ffe5a5,
    0 0 25px #c9a46a;

  animation: starTwinkle 2.5s ease-in-out infinite;
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Acessibilidade */
@media (prefers-reduced-motion: reduce) {
  .lightning-flash,
  .falling-particle,
  .hermit-light,
  .card-aura,
  .justice-line,
  .temperance-glow,
  .star-particle {
    animation: none !important;
  }
}




@media (max-width: 480px) {
  .interpretation-scene {
    padding-top: 55px;
    gap: 18px;
  }

  .scene-card {
    width: min(170px, 42vw);
  }

  .scene-actions {
    gap: 10px;
  }

  .primary-button,
  .secondary-button {
    padding: 11px 14px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
