<script setup lang="ts">
import { computed } from 'vue';
import meta from '../tokens/meta.json';

type Section = 'semantic-colors' | 'primitive-colors' | 'typography' | 'spacing' | 'radius' | 'shadows';
const props = defineProps<{ section: Section }>();

type Variable = (typeof meta.variables)[number];

const groupBy = (list: Variable[], depth: number) => {
  const groups = new Map<string, Variable[]>();
  for (const v of list) {
    const key = v.figma.split('/').slice(0, depth).join('/');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }
  return [...groups.entries()];
};

const colorGroups = computed(() => {
  const colors = meta.variables.filter((v) => v.type === 'COLOR');
  if (props.section === 'semantic-colors') return groupBy(colors.filter((v) => v.collection === 'Semantic'), 1);
  return groupBy(colors.filter((v) => v.collection === 'Primitive'), 1);
});

const dims = (prefix: string) =>
  meta.variables.filter((v) => v.type === 'FLOAT' && v.figma.startsWith(prefix));
</script>

<template>
  <div class="gallery">
    <template v-if="section === 'semantic-colors' || section === 'primitive-colors'">
      <section v-for="[group, items] in colorGroups" :key="group" class="group">
        <h3 class="ds-text-heading-group-title">{{ group }}</h3>
        <div class="swatches">
          <div v-for="v in items" :key="v.cssVar" class="swatch">
            <div class="chip" :style="{ background: `var(${v.cssVar})` }" />
            <div class="ds-text-special-special-13-regular">{{ v.figma }}</div>
            <code class="ds-text-special-special-12-regular muted">{{ v.cssVar }}</code>
            <code v-if="v.alias" class="ds-text-special-special-12-regular muted">→ {{ v.alias }}</code>
            <code v-else class="ds-text-special-special-12-regular muted">{{ v.value }}</code>
          </div>
        </div>
      </section>
    </template>

    <template v-else-if="section === 'typography'">
      <div v-for="t in meta.typography" :key="t.cssVar" class="type-row">
        <div :class="t.className">Шрифт Inter — Ґ Є І Ї, Щ Ъ Ь Ы — Quick brown fox 0123</div>
        <code class="ds-text-special-special-12-regular muted">{{ t.figma }} · .{{ t.className }} · {{ t.cssVar }}</code>
      </div>
    </template>

    <template v-else-if="section === 'spacing'">
      <div v-for="v in dims('space/').filter((v) => !v.figma.startsWith('space/neg-'))" :key="v.cssVar" class="bar-row">
        <code class="ds-text-special-special-12-regular label">{{ v.figma }} = {{ v.value }}px</code>
        <div class="bar" :style="{ width: `var(${v.cssVar})` }" />
      </div>
    </template>

    <template v-else-if="section === 'radius'">
      <div class="swatches">
        <div v-for="v in dims('radius/')" :key="v.cssVar" class="swatch">
          <div class="chip radius" :style="{ borderRadius: `var(${v.cssVar})` }" />
          <code class="ds-text-special-special-12-regular muted">{{ v.figma }} = {{ v.value }}px</code>
        </div>
      </div>
    </template>

    <template v-else-if="section === 'shadows'">
      <div class="swatches">
        <div v-for="s in meta.shadows" :key="s.cssVar" class="swatch">
          <div class="chip shadow" :style="{ boxShadow: `var(${s.cssVar})` }" />
          <div class="ds-text-special-special-13-regular">{{ s.figma }}</div>
          <code class="ds-text-special-special-12-regular muted">{{ s.cssVar }}</code>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  padding: var(--space-24);
}
.group {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}
.group h3 {
  margin: 0;
}
.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-16);
}
.swatch {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 200px;
}
.chip {
  height: 48px;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-8);
  /* checkerboard so transparent colors are visible */
  background-image: conic-gradient(var(--surface-subtle) 25%, transparent 0 50%, var(--surface-subtle) 0 75%, transparent 0);
  background-size: 12px 12px;
}
.chip.radius {
  background: var(--surface-secondary-light);
  border: none;
}
.chip.shadow {
  background: var(--surface-default);
  border: none;
}
.muted {
  color: var(--text-secondary);
  word-break: break-all;
}
.type-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-bottom: var(--space-12);
  border-bottom: 1px solid var(--border-divider);
}
.bar-row {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}
.bar-row .label {
  width: 140px;
}
.bar {
  height: var(--space-16);
  min-width: 1px;
  background: var(--bg-info-primary);
}
</style>
