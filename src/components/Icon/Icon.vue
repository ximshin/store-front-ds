<script setup lang="ts">
// Icon from the DS "Icons" page, rendered as a CSS mask so the glyph takes `currentColor`.
// Registry and how to add icons: ./icons.ts
import { computed } from 'vue';
import { ICON_SOURCES, DERIVED_ICONS } from './icons';

const props = withDefaults(defineProps<{ name: string; size?: 16 | 20 | 24 | 32 | 40 | 48 | 64 }>(), { size: 16 });

const style = computed(() => {
  const derived = DERIVED_ICONS[props.name];
  const src = ICON_SOURCES[derived ? derived.from : props.name];
  if (!src && import.meta.env.DEV) console.warn(`[Icon] unknown icon "${props.name}"`);
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    maskImage: src ? `url("${src}")` : undefined,
    WebkitMaskImage: src ? `url("${src}")` : undefined,
    transform: derived ? `rotate(${derived.rotate}deg)` : undefined,
  };
});
</script>

<template>
  <span class="ds-icon" :style="style" aria-hidden="true" />
</template>

<style scoped>
.ds-icon {
  display: inline-block;
  flex: none;
  background-color: currentColor;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
}
</style>
