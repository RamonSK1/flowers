
<script setup lang="ts">
import { ref } from 'vue'
import { Download, Heart, RotateCcw } from 'lucide-vue-next'
import ApologyLetter from '../components/bouquet/ApologyLetter.vue'

const animationKey = ref(0)
const letterOpen = ref(false)
//const frameRef = ref<HTMLIFrameElement | null>(null)

function replayAnimation() {
  animationKey.value++
}


async function saveBouquet() {
    const image = new Image()
  image.src = '/bouquet/bouquet-pixel-base.png'

  try {
    await image.decode()
  } catch {
    console.error('Não foi possível carregar a imagem do buquê.')
    return
  }

  const sourceCanvas = image

  const canvas = document.createElement('canvas')
  canvas.width = 1440
  canvas.height = 1920

  const ctx = canvas.getContext('2d')

  if (!ctx) return

  const W = canvas.width
  const H = canvas.height

  // Fundo gótico
  const background = ctx.createLinearGradient(0, 0, 0, H)
  background.addColorStop(0, '#160d19')
  background.addColorStop(0.55, '#261326')
  background.addColorStop(1, '#0b080e')

  ctx.fillStyle = background
  ctx.fillRect(0, 0, W, H)

  // Molduras ornamentais
  ctx.strokeStyle = '#b96c91'
  ctx.lineWidth = 4
  ctx.strokeRect(55, 55, W - 110, H - 110)

  ctx.strokeStyle = '#70415f'
  ctx.lineWidth = 2
  ctx.strokeRect(75, 75, W - 150, H - 150)

  // Pequenos ornamentos
  ctx.textAlign = 'center'
  ctx.fillStyle = '#e8a0bb'
  ctx.font = '46px Georgia'

  ctx.fillText('✦', W / 2, 115)
  ctx.fillText('✦', W / 2, H - 90)

  // Título
  ctx.fillStyle = '#e8a0bb'
  ctx.font = '30px Georgia'
  ctx.fillText(
    'UM PEQUENO PRESENTE PARA VOCÊ',
    W / 2,
    195
  )

  // Área da arte
  const artWidth = 1050
  const artHeight =
    artWidth * sourceCanvas.height / sourceCanvas.width

  const artX = (W - artWidth) / 2
  const artY = 250

  // Fundo atrás da pixel art
  ctx.fillStyle = '#120a14'
  ctx.fillRect(
    artX,
    artY,
    artWidth,
    artHeight
  )

  // Preserva o visual pixelado
  ctx.imageSmoothingEnabled = false

  ctx.drawImage(
    sourceCanvas,
    artX,
    artY,
    artWidth,
    artHeight
  )

  ctx.imageSmoothingEnabled = true

  // Dedicatória
  
  // Área reservada para a dedicatória
  const dedicationY = 1710

  // Ornamento separador
  ctx.strokeStyle = '#b96c91'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(400, dedicationY - 70)
  ctx.lineTo(1040, dedicationY - 70)
  ctx.stroke()

  // Frase principal
  ctx.textAlign = 'center'
  ctx.fillStyle = '#f3d4df'
  ctx.font = 'italic 48px Georgia'

  ctx.fillText(
    'Que coisas bonitas ainda possam florescer.',
    W / 2,
    dedicationY
  )

  // Nome
  ctx.fillStyle = '#e8a0bb'
  ctx.font = '32px Georgia'

  ctx.fillText(
    'Para Lanai, com carinho.',
    W / 2,
    dedicationY + 85
  )


  // Gerar PNG
  const blob = await new Promise<Blob | null>(
    resolve => canvas.toBlob(resolve, 'image/png')
  )

  if (!blob) {
    console.error('Não foi possível gerar o PNG.')
    return
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'buque-para-lanai.png'

  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}

</script>

<template>
  <main class="bouquet-page">
    <header class="bouquet-heading">
      <span class="eyebrow">UM PEQUENO PRESENTE</span>

      <h1>Algumas coisas ainda podem florescer.</h1>

      <p>
        Entre tudo aquilo que se perdeu,
        ainda existem coisas que merecem ser cuidadas.
      </p>
    </header>

    <div class="bouquet-frame">
      <iframe
        :key="animationKey"
        ref="frameRef"
        src="/bouquet/vaso-pixel-art-animado.html"
        title="Buquê gótico animado de lírios-aranha e hibiscos"
        scrolling="no"
      />
    </div>

    <div class="bouquet-actions">
      <button class="save-button" @click="saveBouquet">
        <Download :size="18" />
        Guardar meu buquê
      </button>

      <button class="letter-button" @click="letterOpen = true">
        <Heart :size="18" />
        Ler minha carta
      </button>

      <button class="restart-button" @click="replayAnimation">
        <RotateCcw :size="15" />
        Reiniciar animação
      </button>
    </div>

        <ApologyLetter
      v-if="letterOpen"
      @close="letterOpen = false"
    />
  </main>
</template>

<style scoped>
.bouquet-page {
  min-height: 100svh;
  padding: 50px 20px 80px;
  background:
    radial-gradient(
      ellipse at 50% 35%,
      #321527 0%,
      #120a0d 65%,
      #09060a 100%
    );
  color: #f3d4df;
  text-align: center;
}

.bouquet-heading {
  max-width: 650px;
  margin: 0 auto 35px;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 4px;
  color: #e8a0bb;
}

.bouquet-heading h1 {
  margin: 18px 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(38px, 7vw, 64px);
  font-weight: 500;
}

.bouquet-heading p {
  color: #c7a8b7;
  line-height: 1.8;
}

.bouquet-frame {
  width: min(100%, 510px);
  aspect-ratio: 3 / 4;
  margin: 0 auto 30px;
  overflow: hidden;
  border: 1px solid #8c4768;
  border-radius: 12px;
  box-shadow: 0 0 55px #b83e7826;
  animation: appear 1.8s ease both;
}

.bouquet-frame iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 480px) {
  .bouquet-page {
    padding: 35px 14px 90px;
  }

  .bouquet-heading h1 {
    font-size: clamp(34px, 9vw, 46px);
  }

  .bouquet-frame {
    width: 100%;
    max-width: 390px;
  }

  .bouquet-actions {
    padding-bottom: 15px;
  }

  .save-button,
  .letter-button {
    width: min(100%, 320px);
    min-height: 48px;
  }
}

.bouquet-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
}

.save-button,
.letter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: min(100%, 290px);
  padding: 14px 20px;
  border-radius: 9px;
  cursor: pointer;
}

.save-button {
  color: #f3d4df;
  background: #291526;
  border: 1px solid #e8a0bb;
}

.letter-button {
  color: white;
  background: #a43870;
  border: 1px solid #d96c9b;
}

.restart-button {
  margin-top: 8px;
  border: none;
  background: transparent;
  color: #c49ab0;
  cursor: pointer;
}

.letter-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #09060aeb;
}

.letter-paper {
  position: relative;
  width: min(100%, 550px);
  padding: 50px 35px;
  border: 1px solid #c76e9b;
  border-radius: 12px;
  background: #241420;
  text-align: left;
}

.close-letter {
  position: absolute;
  top: 15px;
  right: 18px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
}

.letter-paper h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
}

.letter-paper p {
  line-height: 1.8;
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(35px) scale(.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 480px) {
  .bouquet-page {
    padding: 35px 15px 60px;
  }

  .bouquet-frame {
    width: 100%;
  }
}
</style>
