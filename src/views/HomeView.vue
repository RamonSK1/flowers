
<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Flower2, Sparkles, ArrowRight } from 'lucide-vue-next'

function startExperience() {
  window.dispatchEvent(
    new CustomEvent('oraculo:start-music')
  )
}
</script>

<template>
  <main class="home">
    <div class="ambient ambient-left"></div>
    <div class="ambient ambient-right"></div>

    <div class="content">
      <div class="symbol">
        <Flower2 :size="58" :stroke-width="1" />
      </div>

      <div class="eyebrow">
        <Sparkles :size="13" />
        <span>UMA PEQUENA EXPERIÊNCIA</span>
        <Sparkles :size="13" />
      </div>

      <h1 class="font-romantic">
        Algumas coisas
        <span>merecem flores.</span>
      </h1>

      <div class="ornament">
        <span></span>
        <Flower2 :size="17" :stroke-width="1" />
        <span></span>
      </div>

      <p class="description">
        Preparei algo um pouco diferente para você.
        Uma pequena jornada entre perguntas,
        cartas e flores.
      </p>

      <RouterLink
  to="/quiz"
  class="start-button"
  @click="startExperience"
>
  Começar
  <ArrowRight :size="17" />
</RouterLink>

      <p class="footer-text">
        Feito com carinho, especialmente para você.
      </p>
    </div>
  </main>
</template>

<style scoped>
.home {
  min-height: 100svh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 48px 24px;
  background:
    radial-gradient(ellipse at 50% 40%,
      #29131f 0%, #120d14 45%, #0d0b10 80%);
}

.ambient {
  position: absolute;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  pointer-events: none;
}

.ambient-left {
  background: #a12647;
  top: -150px;
  left: -150px;
}

.ambient-right {
  background: #711f35;
  bottom: -160px;
  right: -150px;
}

.content {
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: appear 1.2s ease both;
}

.symbol {
  color: #b94b63;
  margin-bottom: 35px;
  animation: float 5s ease-in-out infinite;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #c9a46a;
  font-size: 10px;
  letter-spacing: 4px;
  margin-bottom: 25px;
}

h1 {
  font-size: clamp(52px, 9vw, 88px);
  line-height: 0.98;
  font-weight: 500;
  letter-spacing: -2px;
  margin: 0;
}

h1 span {
  display: block;
  color: #c9a46a;
  font-style: italic;
}

.ornament {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #b94b63;
  margin: 35px 0;
}

.ornament span {
  width: 65px;
  height: 1px;
  background: linear-gradient(
    90deg, transparent, #8d5b65);
}

.ornament span:last-child {
  transform: rotate(180deg);
}

.description {
  color: #b6a8af;
  font-size: 15px;
  line-height: 1.9;
  max-width: 370px;
  margin-bottom: 36px;
}

.start-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 16px 36px;
  background: #711f35;
  color: #fff1ed;
  border: 1px solid #a14a60;
  text-decoration: none;
  letter-spacing: 2px;
  font-size: 12px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.start-button:hover {
  background: #912e4a;
  transform: translateY(-3px);
  box-shadow: 0 10px 35px #711f3555;
}

.footer-text {
  margin-top: 55px;
  color: #75656e;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 17px;
}

@keyframes appear {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (prefers-reduced-motion: reduce) {
  .content, .symbol {
    animation: none;
  }
}

@media (max-width: 480px) {
  .eyebrow { letter-spacing: 2px; }
  .description { font-size: 14px; }
  .footer-text { margin-top: 40px; }
}
</style>