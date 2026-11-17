<script setup lang="ts">
import GothicRadio from './components/GothicRadio.vue'
import PageTransition from './components/PageTransition.vue'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <PageTransition>
      <component
        :is="Component"
        :key="route.path"
      />
    </PageTransition>
  </RouterView>

  <GothicRadio />
</template>