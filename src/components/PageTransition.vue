
<script setup lang="ts">
import { onUnmounted } from 'vue'
import { gsap } from 'gsap'

let timeline: gsap.core.Timeline | null = null


function onEnter(
  el: Element,
  done: () => void
) {
  const element = el as HTMLElement

  gsap.set(element, {
    opacity: 0,
  })

  timeline?.kill()

  timeline = gsap.to(element, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => {
      gsap.set(element, {
        clearProps: 'opacity',
      })
      done()
    },
  }) as unknown as gsap.core.Timeline
}

function onLeave(
  el: Element,
  done: () => void
) {
  const element = el as HTMLElement

  timeline?.kill()

  timeline = gsap.to(element, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: done,
  }) as unknown as gsap.core.Timeline
}

onUnmounted(() => {
  timeline?.kill()
})
</script>

<template>
  <div class="page-transition-wrapper">
    <Transition
      mode="out-in"
      :css="false"
      @enter="onEnter"
      @leave="onLeave"
    >
      <slot />
    </Transition>

    <div
      
      class="transition-ambient"
      aria-hidden="true"
    ></div>
  </div>
</template>

<style scoped>
.page-transition-wrapper {
  position: relative;
  min-height: 100svh;
  isolation: isolate;
}

.transition-ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;

  background:
    radial-gradient(
      ellipse at 50% 40%,
      rgba(112, 42, 78, 0.08),
      transparent 65%
    );
}
</style>
