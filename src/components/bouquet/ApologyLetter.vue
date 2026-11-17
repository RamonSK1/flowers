
<script setup lang="ts">
import { ref, nextTick, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { X, Heart } from 'lucide-vue-next'

const emit = defineEmits<{
  close: []
}>()

const opened = ref(false)
const opening = ref(false)

const envelopeRef = ref<HTMLElement | null>(null)
const flapRef = ref<HTMLElement | null>(null)
const paperRef = ref<HTMLElement | null>(null)
const sealRef = ref<HTMLElement | null>(null)
const letterRef = ref<HTMLElement | null>(null)

let timeline: gsap.core.Timeline | null = null

async function openEnvelope() {
  if (opening.value || opened.value) return

  opening.value = true
  await nextTick()

  const envelope = envelopeRef.value
  const flap = flapRef.value
  const paper = paperRef.value
  const seal = sealRef.value

  if (!envelope || !flap || !paper || !seal) {
    opening.value = false
    return
  }

  timeline?.kill()

  timeline = gsap.timeline({
    onComplete: async () => {
      opened.value = true
      await nextTick()

      if (letterRef.value) {
        gsap.fromTo(
          letterRef.value,
          {
            opacity: 0,
            y: 45,
            scale: 0.94,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
          }
        )
      }

      opening.value = false
    },
  })

  // Selo de cera desaparece
  timeline.to(seal, {
    scale: 1.25,
    opacity: 0,
    rotation: -15,
    duration: 0.45,
    ease: 'power2.in',
  })

  // Aba do envelope abre
  timeline.to(flap, {
    rotationX: 180,
    duration: 0.85,
    ease: 'power2.inOut',
  })

  // Papel desliza para fora
  timeline.to(
    paper,
    {
      y: -115,
      duration: 1,
      ease: 'power3.out',
    },
    '-=0.15'
  )

  // Envelope desaparece
  timeline.to(envelope, {
    opacity: 0,
    scale: 0.88,
    y: 45,
    duration: 0.6,
    ease: 'power2.inOut',
  })
}

function closeLetter() {
  timeline?.kill()
  emit('close')
}

onUnmounted(() => {
  timeline?.kill()
})
</script>

<template>
  <div class="letter-overlay" role="dialog" aria-modal="true">
    <button
      class="close-button"
      type="button"
      aria-label="Fechar carta"
      @click="closeLetter"
    >
      <X :size="22" />
    </button>

    <div class="letter-scene">
      <Transition name="fade">
        <div
          v-if="!opened"
          ref="envelopeRef"
          class="envelope-container"
        >
          <p class="envelope-heading">
            Algumas palavras ficaram guardadas...
          </p>

          <button
            class="envelope"
            type="button"
            :disabled="opening"
            aria-label="Abrir envelope"
            @click="openEnvelope"
          >
            <div class="envelope-body"></div>

            <div ref="paperRef" class="envelope-paper">
              <Heart :size="24" />
            </div>

            <div class="envelope-front"></div>
            <div ref="flapRef" class="envelope-flap"></div>

            <div ref="sealRef" class="wax-seal">
              ♥
            </div>
          </button>

          <p class="envelope-hint">
            {{ opening ? 'Abrindo...' : 'Toque no selo para abrir' }}
          </p>
        </div>
      </Transition>

      <div
        v-if="opened"
        ref="letterRef"
        class="letter-paper"
      >
        <span class="letter-eyebrow">
          PARA LANAI
        </span>

        <h2>Então ne lulanai, ai vai o textinho</h2>

        <div class="letter-divider">✦</div>

        <div class="letter-content">
          <p>
            Eu não sei o que houve de errado para que eu merecesse o seu "ghosting", mas tudo bem
            Faço esse textinho aqui so para te dizer que eu sinto muito por qualquer mal entendido que eu possa ter causado.
            Ou se te fiz algum mal ou qualquer coisa assim.
          </p>

          <p>
            Valeu pelas conversas e pelos aprendizados que eu tive nesse tempo, foi o que eu mais aprendi do seu mundinho kkkkk
            Desculpa se fiz voce se incomodar com eu sendo muito intenso ou algo do tipo, eu não quis incomodar nem magoar.
          </p>

          <p>
            Não sei se as leituras desse tarot ta certas tambem kkkkk, eu fiz o que eu pude pra poder te dizer no seu campo de vida,
            mas se eu errei em algo, não foi por mal ta, eu ainda to aprendendo
            Brigadinho por tudo, e se voce quiser conversar de novo, eu to por aqui (tlvz).

          </p>
        </div>

        <p class="letter-signature">
          Com carinho. Ramon (ebaa)
        </p>

        <button
          type="button"
          class="finish-button"
          @click="closeLetter"
        >
          <Heart :size="17" />
          Guardar estas palavras
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.letter-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(
      ellipse at center,
      rgba(66, 25, 52, 0.97),
      rgba(7, 4, 10, 0.99) 75%
    );
  backdrop-filter: blur(12px);
  overflow-y: auto;
}

.close-button {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1010;
  border: none;
  background: transparent;
  color: #e8a0bb;
  cursor: pointer;
}

.letter-scene {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 420px;
}

.envelope-container {
  width: min(100%, 420px);
  text-align: center;
}

.envelope-heading {
  margin-bottom: 45px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 27px;
  font-style: italic;
  color: #f3d4df;
}

.envelope {
  position: relative;
  display: block;
  width: min(100%, 340px);
  height: 220px;
  margin: 0 auto;
  border: none;
  background: transparent;
  cursor: pointer;
  perspective: 900px;
}

.envelope-body {
  position: absolute;
  inset: 0;
  border: 2px solid #c67a9c;
  border-radius: 8px;
  background: #271523;
}

.envelope-paper {
  position: absolute;
  left: 10%;
  top: 12%;
  width: 80%;
  height: 78%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b83e78;
  background: #e8cdd9;
  border-radius: 4px;
  z-index: 2;
}

.envelope-front {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: #321b2c;
  clip-path: polygon(
    0 0,
    50% 53%,
    100% 0,
    100% 100%,
    0 100%
  );
  border-radius: 8px;
}

.envelope-flap {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: #503047;
  clip-path: polygon(0 0, 100% 0, 50% 55%);
  transform-origin: top center;
  backface-visibility: hidden;
}

.wax-seal {
  position: absolute;
  z-index: 5;
  left: calc(50% - 27px);
  top: calc(53% - 27px);

  width: 54px;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 2px solid #f2b8d0;
  background: #a43870;
  box-shadow: 0 0 22px #a4387066;
  color: #ffe3ed;
  font-size: 24px;
}
.envelope-hint {
  margin-top: 30px;
  color: #c49ab0;
  font-size: 13px;
  letter-spacing: 1px;
}

.letter-paper {
  width: min(100%, 610px);
  max-height: calc(100svh - 90px);
  overflow-y: auto;
  padding: clamp(30px, 6vw, 65px);
  border: 1px solid #c67a9c;
  border-radius: 10px;
  background:
    linear-gradient(
      135deg,
      #34202e,
      #1c111c 75%
    );
  box-shadow: 0 0 65px #b83e7826;
  text-align: left;
}

.letter-eyebrow {
  color: #e8a0bb;
  font-size: 11px;
  letter-spacing: 4px;
}

.letter-paper h2 {
  margin: 20px 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(32px, 6vw, 48px);
  font-weight: 500;
  color: #f3d4df;
}

.letter-divider {
  margin: 22px 0;
  color: #d38aad;
  text-align: center;
}

.letter-content p {
  margin-bottom: 20px;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(21px, 3vw, 26px);
  line-height: 1.5;
  color: #ead5df;
}

.letter-signature {
  margin-top: 35px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-style: italic;
  color: #e8a0bb;
}

.finish-button {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 35px;
  padding: 13px 20px;
  border: 1px solid #d18bab;
  border-radius: 8px;
  background: #672c4c;
  color: #ffe5ef;
  cursor: pointer;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .letter-overlay {
    padding: 15px;
  }

  .envelope {
    height: 190px;
  }

  .letter-paper {
    max-height: calc(100svh - 65px);
  }
}
</style>
