<script setup lang="ts">
// Showcase (directive_vue_base, Phase 4): semantic palette, text scale, component gallery.
// Values come from src/tokens/meta.json — nothing is hardcoded. Component sections are added as the base grows.
import meta from './tokens/meta.json';
import { gallery } from './showcase/gallery';

const storybookUrl = import.meta.env.BASE_URL + 'storybook/';
const semanticColors = meta.variables.filter((v) => v.type === 'COLOR' && v.collection === 'Semantic');
</script>

<template>
  <main class="showcase">
    <header class="top">
      <h1 class="ds-text-display-m">Store Front DS — Vue</h1>
      <a class="ds-text-special-special-16-medium top__link" :href="storybookUrl">Каталог компонентів (Storybook) →</a>
    </header>

    <section>
      <h2 class="ds-text-heading-h2">Цвета — Semantic</h2>
      <div class="swatches">
        <div v-for="v in semanticColors" :key="v.cssVar" class="swatch">
          <div class="chip" :style="{ background: `var(${v.cssVar})` }" />
          <div class="ds-text-special-special-12-regular">{{ v.figma }}</div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="ds-text-heading-h2">Типографика</h2>
      <div v-for="t in meta.typography" :key="t.className" class="type-row">
        <code class="ds-text-special-special-12-regular muted">{{ t.figma }}</code>
        <span :class="t.className">Оформлення замовлення — Ґ Є І Ї</span>
      </div>
    </section>

    <section v-for="g in gallery" :key="g.page">
      <h2 class="ds-text-heading-h2">{{ g.page }}</h2>
      <div v-for="item in g.items" :key="item.name" class="item">
        <code class="ds-text-special-special-12-regular muted">{{ item.name }}</code>
        <div class="row">
          <component :is="item.component" v-for="(p, i) in item.variants" :key="i" v-bind="p" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.showcase {
  display: flex;
  flex-direction: column;
  gap: var(--space-40);
  padding: var(--space-40);
  background: var(--surface-subtle);
  min-height: 100vh;
}
section {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-24);
  border-radius: var(--radius-12);
  background: var(--surface-default);
}
.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-12);
}
.swatch {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.chip {
  height: var(--space-40);
  border-radius: var(--radius-8);
  border: var(--stroke-thin) solid var(--border-card);
}
.type-row,
.item {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-16);
}
.top {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-16);
}
.top h1 {
  margin: 0;
}
.top__link {
  color: var(--text-link);
}
.muted {
  color: var(--text-secondary);
}
</style>
