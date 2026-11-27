// Router (directive_screens_vue). Hash history so deep links work on any static host (GitHub Pages included).
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { screens } from './screens/registry';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'index', component: () => import('./screens/ScreensIndex.vue') },
  { path: '/showcase', name: 'showcase', component: () => import('./showcase/Showcase.vue') },
  ...screens.map((s) => ({ path: s.route, name: s.id, component: s.component, props: s.props ?? false })),
  // 2026-11-25: the new-cart item rows became the main /checkout-mobile — old links to the variant land there.
  { path: '/checkout-mobile-items', redirect: '/checkout-mobile' },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});
