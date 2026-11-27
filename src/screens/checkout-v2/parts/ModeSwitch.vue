<script setup lang="ts">
// Local block of /checkout-v2: the switch «Звичайне оформлення | Швидке замовлення» (Figma switch-box 10:1880).
// Not in the Store Front DS (the mock uses a Switch from another library) — local composition on DS tokens:
// track text/primary at 5 % (derived — no theme setting), radius 8, padding 2; segment 36, active — surface/default, radius 6.
// look="filled" (/checkout-v2-labels-left-400, Figma switch-box 10:1880 as updated): track 40 with a border/input frame, no tint
// (the inactive segment has no background), radius 8, segments edge to edge over the frame; active — surface/action-primary with text/primary-white, radius 6.
// look="compact" (/checkout-v2-comment, Figma toggle-box 89:1229): hugs the labels, height 28, frame border/input radius 8,
// square segments flush to the frame; active — surface/hover, labels Special 13 Regular.
// look="compact-dark" (/checkout-v2, Figma toggle-box 89:1229 · Switch 92:3614): hugs the labels, frame border/input radius 8,
// padding 2, segments 32 (padding 8); active — surface/action-primary with text/primary-white, radius 6.
// A radio group: role="radiogroup" / role="radio", arrows move the choice.
const props = withDefaults(
  defineProps<{ modelValue: string; items: { value: string; label: string }[]; label?: string; look?: 'soft' | 'filled' | 'compact' | 'compact-dark' | 'line' }>(),
  { label: undefined, look: 'soft' },
);
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

function onKey(e: KeyboardEvent, i: number) {
  const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
  if (!step) return;
  e.preventDefault();
  const next = props.items[(i + step + props.items.length) % props.items.length];
  emit('update:modelValue', next.value);
  const group = (e.currentTarget as HTMLElement).parentElement;
  (group?.querySelectorAll<HTMLElement>('[role="radio"]')[(i + step + props.items.length) % props.items.length])?.focus();
}
</script>

<template>
  <div class="ms" :class="'ms--' + look" role="radiogroup" :aria-label="label">
    <button
      v-for="(it, i) in items"
      :key="it.value"
      type="button"
      role="radio"
      class="ms__item"
      :class="{ 'is-active': it.value === modelValue }"
      :aria-checked="it.value === modelValue"
      :tabindex="it.value === modelValue ? 0 : -1"
      @click="emit('update:modelValue', it.value)"
      @keydown="onKey($event, i)"
    >
      {{ it.label }}
    </button>
  </div>
</template>

<style scoped>
.ms {
  display: flex;
  box-sizing: border-box;
  padding: var(--space-2);
  border-radius: var(--radius-8);
  /* The theme editor has no setting for the track: derived from the text colour (text/primary at 5 %, as surface/hover
     today) so it follows any theme; the active segment is the page background (surface/default). Fallback — the token. */
  background: var(--surface-hover);
  background: color-mix(in srgb, var(--text-primary) 5%, transparent);
}
.ms__item {
  flex: 1 1 0;
  min-width: 0;
  min-height: calc(var(--space-32) + var(--space-4));
  margin: 0;
  padding: var(--space-8);
  border: 0;
  border-radius: var(--radius-6);
  background: transparent;
  color: var(--text-primary);
  font: var(--typo-form-input-text);
  cursor: pointer;
}
.ms__item.is-active {
  background: var(--surface-default);
}
.ms__item:focus-visible {
  outline: var(--stroke-thin) solid var(--border-input-active);
  outline-offset: calc(-1 * var(--stroke-thin));
}
/* filled: frame border/input 1, segments 40 cover it (Figma padding −1) — the active one hides the frame under it. */
.ms--filled {
  padding: 0;
  border: var(--stroke-thin) solid var(--border-input);
  /* No tint under the inactive segment — only the frame. */
  background: none;
}
.ms--filled .ms__item {
  min-height: var(--space-40);
  margin: calc(-1 * var(--stroke-thin));
}
.ms--filled .ms__item.is-active {
  background: var(--surface-action-primary);
  color: var(--text-primary-white);
}
.ms--filled .ms__item:focus-visible {
  outline-offset: calc(-2 * var(--stroke-thin));
  outline-color: var(--text-primary-white);
}
/* compact: hugs the labels, height 28, frame border/input with radius 8 clipping square segments (no inner padding);
   active — surface/hover, text stays text/primary; labels DS/Special/Special 13 Regular, padding 0 8. */
.ms--compact {
  display: inline-flex;
  height: calc(var(--space-24) + var(--space-4));
  padding: 0;
  overflow: clip;
  border: var(--stroke-thin) solid var(--border-input);
  background: none;
}
.ms--compact .ms__item {
  flex: none;
  min-height: 0;
  padding: 0 var(--space-8);
  border-radius: 0;
  font: var(--typo-special-special-13-regular);
  white-space: nowrap;
}
.ms--compact .ms__item.is-active {
  background: var(--surface-hover);
}
.ms--compact .ms__item:focus-visible {
  outline-offset: calc(-2 * var(--stroke-thin));
}
/* compact-dark: hugs the labels; frame border/input, padding 2, segments 32 — active dark, radius 6. */
.ms--compact-dark {
  display: inline-flex;
  border: var(--stroke-thin) solid var(--border-input);
  background: none;
}
.ms--compact-dark .ms__item {
  flex: none;
  min-height: var(--space-32);
  white-space: nowrap;
}
.ms--compact-dark .ms__item.is-active {
  background: var(--surface-action-primary);
  color: var(--text-primary-white);
}
.ms--compact-dark .ms__item.is-active:focus-visible {
  outline-color: var(--text-primary-white);
  outline-offset: calc(-2 * var(--stroke-thin));
}
/* line (/checkout-v2-steps, in the style of the line fields): underlined tabs across the form width — the row has
   the field line (border/input) at the bottom; tabs hug the labels (16/24, 24 apart), the active one is text/primary
   with a 2 px line in text/primary over the row line, the other — text/secondary. Height 56, like a field. */
.ms--line {
  gap: var(--space-24);
  padding: 0;
  border-bottom: var(--stroke-thin) solid var(--border-input);
  border-radius: 0;
  background: none;
}
.ms--line .ms__item {
  position: relative;
  flex: none;
  min-height: 56px;
  padding: var(--space-16) 0;
  border-radius: 0;
  color: var(--text-secondary);
  font: var(--font-weight-regular) var(--font-size-16) / var(--font-line-height-24) var(--font-sans), system-ui, sans-serif;
  white-space: nowrap;
  transition: color 0.15s ease;
}
.ms--line .ms__item:hover,
.ms--line .ms__item.is-active {
  color: var(--text-primary);
}
.ms--line .ms__item.is-active {
  background: none;
}
.ms--line .ms__item.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(-1 * var(--stroke-thin));
  height: 2px;
  background: currentColor;
}
</style>
