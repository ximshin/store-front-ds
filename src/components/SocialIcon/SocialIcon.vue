<script setup lang="ts">
/**
 * SocialIcon — иконка соцсети 16×16 (Figma 6209:82) для тёмной плашки шапки и подвала. Моно-логотипы
 * `social-<сеть>-32` (масштаб до 16), цвет icon/primary-white; на светлом фоне переопределяется
 * через `--social-icon-color: var(--icon-strong)`.
 *
 * Figma → props: Network → network (нижний регистр).
 */
import Icon from '../Icon/Icon.vue';

export type SocialNetwork =
  | 'facebook' | 'instagram' | 'youtube' | 'telegram' | 'threads' | 'x'
  | 'whatsapp' | 'tiktok' | 'linkedin' | 'discord' | 'bluesky';

const NAMES: Record<SocialNetwork, string> = {
  facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', telegram: 'Telegram', threads: 'Threads', x: 'X',
  whatsapp: 'WhatsApp', tiktok: 'TikTok', linkedin: 'LinkedIn', discord: 'Discord', bluesky: 'Bluesky',
};

withDefaults(defineProps<{ network?: SocialNetwork; href?: string }>(), { network: 'facebook', href: '#' });
</script>

<template>
  <a class="ds-social-icon" :href="href" :aria-label="NAMES[network]">
    <Icon :name="`social-${network}-32`" :size="16" />
  </a>
</template>

<style scoped>
.ds-social-icon {
  display: inline-flex;
  flex: none;
  width: var(--space-16);
  height: var(--space-16);
  color: var(--social-icon-color, var(--icon-primary-white));
}
</style>
