<script setup lang="ts">
// Local block of /checkout-mobile: a select field that opens a bottom sheet — as the shop's mobile checkout
// (field 48, radius 8 as the buttons). Two sheet kinds, as on the reference:
// - full height (country, city, branch): title, search under it, the list; long rows wrap;
// - fit (delivery, payment — few options): the sheet hugs its rows, no search, a second line under each option.
// The selected row — accent text + a 4 px bar at the left edge (reference), colours from DS tokens
// (text/link, border/selected). `popular` — quick choice shown before anything is typed (no visible caption since 2026-11-24 — popularTitle is only the list aria-label);
// the search above it looks through all options. Candidate for a mobile DS Select variant.
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { Icon } from '../../../main';

const props = withDefaults(
  defineProps<{
    label?: string;
    /** Sheet title; defaults to the label. */
    title?: string;
    modelValue: string;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
    search?: boolean;
    searchPlaceholder?: string;
    /** Quick choice before typing; without it the whole list is shown. */
    popular?: string[];
    popularTitle?: string;
    /** Second line under an option (delivery price, payment terms). */
    subs?: Record<string, string>;
    /** The sheet hugs its rows instead of taking the screen. */
    fit?: boolean;
    error?: string;
  }>(),
  {
    label: '', title: '', placeholder: '', disabled: false, search: false, searchPlaceholder: 'Пошук',
    popular: undefined, popularTitle: 'Популярні', subs: undefined, fit: false, error: '',
  },
);
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const open = ref(false);
const query = ref('');
const field = ref<HTMLButtonElement | null>(null);
const sheet = ref<HTMLElement | null>(null);
const searchEl = ref<HTMLInputElement | null>(null);
const id = `ss-${Math.random().toString(36).slice(2, 8)}`;

const typing = computed(() => !!query.value.trim());
const showPopular = computed(() => !typing.value && !!props.popular?.length);
const list = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (q) return props.options.filter((o) => o.toLowerCase().includes(q));
  if (!props.popular?.length) return props.options;
  // The chosen value stays on top when it is not among the popular ones (reference: selected first).
  const v = props.modelValue;
  return v && !props.popular.includes(v) ? [v, ...props.popular] : props.popular;
});

async function show() {
  if (props.disabled) return;
  query.value = '';
  open.value = true;
  await nextTick();
  (searchEl.value ?? sheet.value)?.focus();
}
function close() {
  open.value = false;
  field.value?.focus();
}
function pick(o: string) {
  emit('update:modelValue', o);
  close();
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault();
    close();
  } else if (e.key === 'Tab' && sheet.value) {
    // Focus stays inside the sheet.
    const items = [...sheet.value.querySelectorAll<HTMLElement>('button, input')];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
// The page under the sheet does not scroll.
watch(open, (o) => {
  document.body.style.overflow = o ? 'hidden' : '';
});
onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
/** Matched part of a row, highlighted as on the reference. */
function parts(o: string): [string, string, string] {
  const q = query.value.trim();
  const i = q ? o.toLowerCase().indexOf(q.toLowerCase()) : -1;
  return i < 0 ? [o, '', ''] : [o.slice(0, i), o.slice(i, i + q.length), o.slice(i + q.length)];
}
</script>

<template>
  <div class="ss" :class="{ 'ss--disabled': disabled, 'ss--error': !!error }">
    <label v-if="label" class="m-label" :for="id">{{ label }}</label>
    <button
      :id="id"
      ref="field"
      type="button"
      class="m-field ss__field"
      :disabled="disabled"
      aria-haspopup="dialog"
      :aria-expanded="open"
      @click="show"
    >
      <span class="ss__value" :class="{ 'ss__value--empty': !modelValue }">{{ modelValue || placeholder }}</span>
      <Icon class="ss__arrow" name="arrow-down-16" :size="16" />
    </button>
    <p v-if="error" class="m-error">{{ error }}</p>

    <Teleport to="body">
      <Transition name="ss-sheet">
        <div v-if="open" class="ss__overlay" @click.self="close" @keydown="onKey">
          <div ref="sheet" class="ss__sheet" :class="{ 'ss__sheet--fit': fit }" role="dialog" aria-modal="true" :aria-label="title || label" tabindex="-1">
            <div class="ss__head">
              <span class="ss__title">{{ title || label }}</span>
              <button type="button" class="ss__close" aria-label="Закрити" @click="close"><Icon name="cross-24" :size="24" /></button>
            </div>
            <div v-if="search" class="ss__search">
              <Icon class="ss__search-icon" name="search-24" :size="24" />
              <input ref="searchEl" v-model="query" class="ss__search-input" type="search" :placeholder="searchPlaceholder" :aria-label="searchPlaceholder" />
              <button v-if="query" type="button" class="ss__clear" aria-label="Очистити пошук" @click="query = ''; searchEl?.focus()">
                <Icon name="cross-24" :size="24" />
              </button>
            </div>
            <ul class="ss__list" :aria-label="showPopular ? popularTitle : undefined">
              <li v-for="o in list" :key="o">
                <button type="button" class="ss__row" :class="{ 'is-selected': o === modelValue }" :aria-current="o === modelValue ? 'true' : undefined" @click="pick(o)">
                  <span class="ss__row-title">{{ parts(o)[0] }}<mark v-if="parts(o)[1]" class="ss__mark">{{ parts(o)[1] }}</mark>{{ parts(o)[2] }}</span>
                  <span v-if="subs?.[o]" class="ss__row-sub">{{ subs[o] }}</span>
                </button>
              </li>
              <li v-if="!list.length" class="ss__empty">Нічого не знайдено</li>
            </ul>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.ss {
  display: flex;
  flex-direction: column;
}
.ss__field {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  text-align: left;
  cursor: pointer;
}
.ss__value {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ss__value--empty {
  color: var(--text-input-hint);
}
.ss__arrow {
  flex: none;
  color: var(--icon-dropdown-arrow);
}
.ss--disabled .ss__arrow {
  color: var(--text-disabled);
}

/* ---------- sheet ---------- */
.ss__overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  background: var(--surface-overlay);
}
/* Full height: the screen under a 40 px strip (reference). */
.ss__sheet {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - var(--space-40));
  padding-bottom: env(safe-area-inset-bottom);
  border-radius: var(--radius-16) var(--radius-16) 0 0;
  background: var(--surface-default);
  color: var(--text-primary);
  outline: none;
}
/* Fit: hugs the rows (delivery, payment), never higher than the full sheet. */
.ss__sheet--fit {
  height: auto;
  max-height: calc(100% - var(--space-40));
}
.ss__head {
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  min-height: var(--space-48);
  padding: 0 var(--space-48);
  border-bottom: var(--stroke-thin) solid var(--border-divider);
  font-size: var(--font-size-18);
}
.ss__close {
  position: absolute;
  top: 50%;
  right: var(--space-8);
  display: flex;
  padding: var(--space-8);
  border: 0;
  background: none;
  color: var(--icon-secondary);
  transform: translateY(-50%);
  cursor: pointer;
}
.ss__search {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-12);
  min-height: var(--space-48);
  padding: 0 var(--space-8) 0 var(--space-12);
  border-bottom: var(--stroke-thin) solid var(--border-divider);
}
.ss__search-icon {
  flex: none;
  color: var(--icon-secondary);
}
.ss__search-input {
  flex: 1 1 0;
  min-width: 0;
  height: var(--space-48);
  border: 0;
  outline: none;
  background: none;
  color: var(--text-primary);
  font: inherit;
  font-size: var(--font-size-18);
}
.ss__search-input::placeholder {
  color: var(--text-input-hint);
}
.ss__search-input::-webkit-search-cancel-button {
  display: none;
}
.ss__clear {
  display: flex;
  padding: var(--space-8);
  border: 0;
  background: none;
  color: var(--icon-secondary);
  cursor: pointer;
}
.ss__list {
  flex: 1 1 auto;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  list-style: none;
}
/* Row as the reference: 48 high, padding 16, text 16, divider below; long titles wrap. */
.ss__row {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  min-height: var(--space-48);
  padding: var(--space-12) var(--space-16);
  border: 0;
  border-bottom: var(--stroke-thin) solid var(--border-divider);
  background: none;
  color: var(--text-primary);
  font: inherit;
  font-size: var(--font-size-16);
  line-height: var(--font-line-height-24);
  text-align: left;
  cursor: pointer;
}
.ss__row-sub {
  color: var(--text-secondary);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-16);
}
/* Selected: accent text + a 4 px bar at the left edge (reference), DS colours. */
.ss__row.is-selected {
  color: var(--text-link);
}
.ss__row.is-selected::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--space-4);
  /* Reference: 0 16 16 0 — square at the screen edge, rounded on the right (the browser scales it to the 4 px width). */
  border-radius: var(--radius-0) var(--radius-16) var(--radius-16) var(--radius-0);
  background: var(--border-selected);
}
.ss__row:active {
  background: var(--surface-hover);
}
.ss__mark {
  border-radius: var(--radius-2);
  background: var(--surface-secondary-light);
  color: inherit;
}
.ss__empty {
  padding: var(--space-16);
  color: var(--text-secondary);
  font-size: var(--font-size-16);
}
.ss-sheet-enter-active,
.ss-sheet-leave-active {
  transition: opacity 0.2s ease;
}
.ss-sheet-enter-active .ss__sheet,
.ss-sheet-leave-active .ss__sheet {
  transition: transform 0.2s ease;
}
.ss-sheet-enter-from,
.ss-sheet-leave-to {
  opacity: 0;
}
.ss-sheet-enter-from .ss__sheet,
.ss-sheet-leave-to .ss__sheet {
  transform: translateY(100%);
}
@media (prefers-reduced-motion: reduce) {
  .ss-sheet-enter-active,
  .ss-sheet-leave-active,
  .ss-sheet-enter-active .ss__sheet,
  .ss-sheet-leave-active .ss__sheet {
    transition: none;
  }
}
</style>
