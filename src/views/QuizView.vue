
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Flower2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-vue-next'
import { quizOptions } from '../data/questions'

const router = useRouter()

const step = ref(1)
const selected = ref<number[]>([])
const feedback = ref('')
const completed = ref(false)

const selectedCount = computed(() => selected.value.length)

function selectOption(id: number) {
  if (completed.value) return

  feedback.value = ''

  if (selected.value.includes(id)) {
    selected.value = selected.value.filter(
      optionId => optionId !== id
    )
    return
  }

  if (selected.value.length < 3) {
    selected.value.push(id)
  }
}

function validateAnswers() {
  if (selected.value.length !== 3) return

  const correct = quizOptions
    .filter(option => option.correct)
    .map(option => option.id)

  const isCorrect = correct.every(
    id => selected.value.includes(id)
  )

  if (isCorrect) {
    completed.value = true
    feedback.value = 'Identidade confirmada! 🌺'
  } else {
    feedback.value =
      'Hmm... acho que você precisa pensar mais um pouquinho 👀'
  }
}

function nextStep() {
  step.value = 2
  feedback.value = ''
}

function goToTarot() {
  router.push('/tarot')
}
</script>

<template>
  <main class="quiz-page">
    <div class="quiz-container">

      <div class="top">
        <Sparkles :size="15" />
        <span>UM PEQUENO DESAFIO</span>
        <Sparkles :size="15" />
      </div>

      <div class="progress">
        <div :class="{ active: step >= 1 }"></div>
        <div :class="{ active: step >= 2 }"></div>
      </div>

      <div class="question-number">
        PERGUNTA 0{{ step }} / 02
      </div>

      <Transition name="fade" mode="out-in">

        <section v-if="step === 1" key="first">
          <Flower2 class="flower-icon" :size="55" :stroke-width="1" />

          <h1 class="font-romantic">
            Você é a <em>Lanai?</em>
          </h1>

          <p class="description">
            Antes de continuar, preciso confirmar
            se essa surpresa chegou à pessoa certa.
          </p>

          <button class="option" @click="nextStep">
            Sim, sou eu! 🌺
            <ArrowRight :size="18" />
          </button>

          <button
            class="option"
            @click="feedback = 'Hmm... então essa surpresa não é para você! 👀'"
          >
            Não, sou um impostor
          </button>

          <p v-if="feedback" class="feedback">
            {{ feedback }}
          </p>
        </section>

        <section v-else key="second">
          <Sparkles class="flower-icon" :size="45" :stroke-width="1" />

          <h1 class="font-romantic">
            Só a verdadeira <em>Lanai</em> saberia...
          </h1>

          <p class="description">
            Quais são as três coisas que você
            mais fala com esse seu sotaque?
          </p>

          <div class="options">
            <button
              v-for="option in quizOptions"
              :key="option.id"
              class="option"
              :class="{
                selected: selected.includes(option.id)
              }"
              :disabled="completed"
              @click="selectOption(option.id)"
            >
              {{ option.text }}

              <Check
                v-if="selected.includes(option.id)"
                :size="19"
              />
              <span v-else class="empty-circle"></span>
            </button>
          </div>

          <p class="counter">
            {{ selectedCount }} de 3 selecionadas
          </p>

          <p v-if="feedback" class="feedback">
            {{ feedback }}
          </p>

          <button
            v-if="completed"
            class="main-button"
            @click="goToTarot"
          >
            Descobrir meu destino
            <ArrowRight :size="18" />
          </button>

          <button
            v-else
            class="main-button"
            :disabled="selectedCount !== 3"
            @click="validateAnswers"
          >
            Confirmar respostas
            <ArrowRight :size="18" />
          </button>

          <button
            v-if="!completed"
            class="back-button"
            @click="step = 1"
          >
            <ArrowLeft :size="15" />
            Voltar
          </button>
        </section>

      </Transition>
    </div>
  </main>
</template>

<style scoped>
.quiz-page {
  min-height: 100svh;
  background:
    radial-gradient(
      ellipse at 50% 30%,
      #29131f 0%,
      #120d14 50%,
      #0d0b10 90%
    );
  color: #f2e8e4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.quiz-container {
  width: 100%;
  max-width: 520px;
  text-align: center;
}

.top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 10px;
  letter-spacing: 3px;
  color: #c9a46a;
  margin-bottom: 28px;
}

.progress {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.progress div {
  height: 3px;
  flex: 1;
  background: #3a2630;
  border-radius: 5px;
  transition: background 0.4s;
}

.progress div.active {
  background: #c9a46a;
}

.question-number {
  font-size: 11px;
  letter-spacing: 2px;
  color: #927d88;
  margin-bottom: 35px;
}

.flower-icon {
  color: #c9a46a;
  margin: 0 auto 25px;
}

h1 {
  font-size: clamp(42px, 8vw, 65px);
  line-height: 1.05;
  font-weight: 500;
}

h1 em {
  color: #c9a46a;
}

.description {
  color: #b6a8af;
  line-height: 1.8;
  font-size: 15px;
  max-width: 380px;
  margin: 24px auto 35px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  width: 100%;
  min-height: 60px;
  background: #21121c;
  border: 1px solid #48303a;
  color: #f2e8e4;
  padding: 16px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  transition: all 0.25s ease;
}

.option:hover:not(:disabled) {
  border-color: #c9a46a;
  background: #301925;
}

.option.selected {
  background: #512338;
  border-color: #c9a46a;
  color: #fff;
}

.option:disabled {
  cursor: default;
}

.empty-circle {
  width: 18px;
  height: 18px;
  border: 1px solid #806875;
  border-radius: 50%;
}

.counter {
  margin: 20px 0;
  color: #b6a8af;
  font-size: 12px;
}

.feedback {
  margin: 20px auto;
  color: #ddb0bb;
  font-size: 14px;
  line-height: 1.6;
}

.main-button {
  width: 100%;
  margin-top: 15px;
  background: #711f35;
  border: 1px solid #a14a60;
  color: #fff;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.main-button:hover:not(:disabled) {
  background: #912e4a;
  transform: translateY(-2px);
}

.main-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.back-button {
  margin-top: 25px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #927d88;
  background: transparent;
  border: none;
  font-size: 13px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
  }
}
</style>
