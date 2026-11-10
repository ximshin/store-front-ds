<script setup lang="ts">
/**
 * Footer — подвал витрины (Figma 6221:356). Фон surface/action/primary. Desktop 1280 — колонки: бренд (Logo,
 * контакты и график — HeaderAction S Dark), «Покупцям» и «Інформація» (DS/Heading/Group Title + NavItem Dark),
 * соцсети (SocialIcon); нижняя строка с разделителем border/on-media. Mobile 430 — стек.
 *
 * Figma → props: Column 1 title → column1Title, Column 2 title → column2Title, Social title → socialTitle,
 * Copyright → copyright, Credit → credit, Device=Desktop/Mobile → device. Пункты колонок, контакты и соцсети —
 * props column1Links, column2Links, phone, schedule, socials.
 */
import HeaderAction from '../HeaderAction/HeaderAction.vue';
import Logo from '../Logo/Logo.vue';
import NavItem from '../NavItem/NavItem.vue';
import SocialIcon, { type SocialNetwork } from '../SocialIcon/SocialIcon.vue';

withDefaults(
  defineProps<{
    device?: 'desktop' | 'mobile';
    column1Title?: string;
    column2Title?: string;
    socialTitle?: string;
    copyright?: string;
    credit?: string;
    phone?: string;
    schedule?: string;
    column1Links?: string[];
    column2Links?: string[];
    socials?: SocialNetwork[];
  }>(),
  {
    device: 'desktop',
    column1Title: 'Покупцям',
    column2Title: 'Інформація',
    socialTitle: 'Ми в соцмережах',
    copyright: '© 2026 Store. Усі права захищені',
    credit: 'Працює на Horoshop',
    phone: '095 123-45-67',
    schedule: 'Пн–Пт 9:00–18:00',
    column1Links: () => ['Доставка та оплата', 'Обмін та повернення', 'Гарантія', 'Питання та відповіді'],
    column2Links: () => ['Про нас', 'Контакти', 'Блог', 'Угода користувача'],
    socials: () => ['facebook', 'instagram', 'tiktok', 'youtube', 'whatsapp'],
  },
);
</script>

<template>
  <footer class="ds-footer" :class="`ds-footer--${device}`">
    <div class="ds-footer__columns">
      <div class="ds-footer__brand">
        <Logo on-dark />
        <HeaderAction class="ds-footer__contact" size="s" theme="dark" :label="phone" icon="phone-24" />
        <HeaderAction class="ds-footer__contact" size="s" theme="dark" :label="schedule" icon="clock-24" />
      </div>
      <div class="ds-footer__col">
        <p class="ds-footer__title">{{ column1Title }}</p>
        <div class="ds-footer__links">
          <NavItem v-for="l in column1Links" :key="l" theme="dark" :label="l" />
        </div>
      </div>
      <div class="ds-footer__col">
        <p class="ds-footer__title">{{ column2Title }}</p>
        <div class="ds-footer__links">
          <NavItem v-for="l in column2Links" :key="l" theme="dark" :label="l" />
        </div>
      </div>
      <div class="ds-footer__socials">
        <p class="ds-footer__title">{{ socialTitle }}</p>
        <div class="ds-footer__icons">
          <SocialIcon v-for="n in socials" :key="n" :network="n" />
        </div>
      </div>
    </div>
    <div class="ds-footer__bottom">
      <p>{{ copyright }}</p>
      <p>{{ credit }}</p>
    </div>
  </footer>
</template>

<style scoped>
.ds-footer {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: var(--space-24);
  background: var(--surface-action-primary);
  color: var(--text-primary-white);
  font: var(--typo-special-special-12-regular);
}
.ds-footer--desktop {
  gap: var(--space-32);
  padding: var(--space-40) var(--space-24) var(--space-24);
}
.ds-footer--mobile {
  gap: var(--space-24);
  padding: var(--space-32) var(--space-16) var(--space-24);
}

.ds-footer__columns {
  display: flex;
  justify-content: space-between;
}
.ds-footer--mobile .ds-footer__columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-24);
}
.ds-footer__brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-12);
}
/* Контакты в подвале — без левого отступа (выравнивание по логотипу). */
.ds-footer__brand .ds-footer__contact {
  padding-left: 0;
}
.ds-footer--mobile .ds-footer__brand {
  grid-column: 1 / -1;
}
.ds-footer__col,
.ds-footer__socials {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}
.ds-footer__col {
  gap: var(--space-4);
}
.ds-footer__socials {
  gap: var(--space-12);
}
.ds-footer--mobile .ds-footer__socials {
  grid-column: 1 / -1;
  grid-row: 3;
}
.ds-footer__title {
  margin: 0;
  font: var(--typo-heading-group-title);
  white-space: nowrap;
}
.ds-footer__links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: var(--space-neg-8);
}
.ds-footer__icons {
  display: flex;
  gap: var(--space-16);
}
.ds-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-16);
  border-top: var(--stroke-thin) solid var(--border-on-media);
  white-space: nowrap;
}
.ds-footer__bottom p {
  margin: 0;
}
.ds-footer--mobile .ds-footer__bottom {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
}
</style>
