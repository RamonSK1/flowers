
<script setup lang="ts">
import type { TarotCardData } from '../../data/tarotCards'

withDefaults(
  defineProps<{
    card?: TarotCardData
    revealed?: boolean
  }>(),
  {
    revealed: false,
  }
)
</script>

<template>
  <div class="tarot-card" :class="{ revealed }">
    <div class="card-inner">

      <!-- Verso personalizado -->
      <div class="card-face card-back">
        <img
          src="/imagens/tarot/back.webp"
          alt="Verso floral da carta de tarot"
          class="card-image back-image"
          draggable="false"
        />
      </div>

      <!-- Frente tradicional -->
      <div class="card-face card-front">
        <img
          v-if="card"
          :src="card.image"
          :alt="`Carta de tarot: ${card.name}`"
          class="card-image front-image"
          draggable="false"
        />
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Estrutura principal da carta */
.tarot-card {
  width: 100%;
  height: 100%;
  aspect-ratio: 2 / 3;
  perspective: 1000px;
}

/* Elemento responsável pela rotação */
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;

  transform-style: preserve-3d;

  transition:
    transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* Animação de virar a carta */
.tarot-card.revealed .card-inner {
  transform: rotateY(180deg);
}

/* Estilo compartilhado entre frente e verso */
.card-face {
  position: absolute;
  inset: 0;

  border: 1px solid #c9a46a;
  border-radius: 9px;

  overflow: hidden;

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Verso */
.card-back {
  background: #270f20;
}

/* Frente */
.card-front {
  background: #160f19;
  transform: rotateY(180deg);
}

/* Estilo geral das imagens */
.card-image {
  display: block;
  width: 100%;
  height: 100%;

  object-position: center;

  user-select: none;
  -webkit-user-drag: none;
}

/* Verso preenche toda a carta */
.back-image {
  object-fit: cover;
}

/* Frente preserva a ilustração completa */
.front-image {
  object-fit: contain;
}

/* Acessibilidade */
@media (prefers-reduced-motion: reduce) {
  .card-inner {
    transition-duration: 0.01ms;
  }
}


.slot {
  position: relative;
  aspect-ratio: 2 / 3;
  width: 100%;
  min-width: 0;

  border: 1px dashed #674452;
  border-radius: 9px;

  background: #1b111b;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;

  color: #795967;
  overflow: hidden;
}

.slot.filled {
  border: none;
  background: transparent;
  box-shadow: 0 0 18px #a14a6022;
}

/* Permite estilizar o componente filho */
.slot :deep(.tarot-card) {
  width: 100%;
  height: 100%;
}

</style>
