<script setup lang="ts">
// Local block of /checkout-v2: the switch «Звичайне оформлення | Швидке замовлення» (Figma switch-box 10:1880).
// Not in the Store Front DS (the mock uses a Switch from another library) — local composition on DS tokens:
// track text/primary at 5 % (derived — no theme setting), radius 8, padding 2; segment 36, active — surface/default, radius 6.
// A radio group: role="radiogroup" / role="radio", arrows move the choice.
const props = defineProps<{ modelValue: string; items: { value: string; label: string }[]; label?: string }>();
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
  <div class="ms" role="radiogroup" :aria-label="label">
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
</style>
