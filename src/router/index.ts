
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import QuizView from '../views/QuizView.vue'
import TarotView from '../views/TarotView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/quiz', name: 'quiz', component: QuizView },
    { path: '/tarot', name: 'tarot', component: TarotView },
    { path: '/bouquet', name: 'bouquet', component: () => import('../views/BouquetView.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router