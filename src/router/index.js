
/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  ]
})

// 全局前置守衛
router.beforeEach((to, from, next) => {
  const localStorageUser = JSON.parse(localStorage.getItem('localStorageUser'));
  const loginToken = localStorageUser ? localStorageUser.loginToken : null;
  if (to.meta.requiresAuth && !loginToken) {
    // 需要認證但沒有 token，重定向到首頁
    next('/');
  } else if (to.path === '/' && loginToken) {
    // 有 token 且試圖訪問首頁，重定向到 BackOffice
    next('/backOffice');
  } else {
    // 其他情況，正常導航
    next();
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
