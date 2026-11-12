<script setup lang="ts">
// Screens index (directive_screens_vue, Phase 5): tiles are built from the registry — nothing is hardcoded here.
import { RouterLink } from 'vue-router';
import { screens } from './registry';
import Icon from '../components/Icon/Icon.vue';

const storybookUrl = import.meta.env.BASE_URL + 'storybook/';
</script>

<template>
  <main class="index">
    <header class="index__head">
      <h1 class="ds-text-display-m index__title">Store Front — екрани</h1>
      <p class="ds-text-paragraph-lead index__lead">
        Екрани, зібрані з дизайн-системи й оживлені на мок-даних: кліки, форми, промокоди, стани.
      </p>
    </header>

    <div class="index__grid">
      <RouterLink v-for="s in screens" :key="s.id" :to="s.route" class="tile">
        <span class="tile__name ds-text-heading-h4">{{ s.name }}</span>
        <span class="tile__desc ds-text-paragraph-p1">{{ s.description }}</span>
        <span class="tile__meta">
          <code class="ds-text-special-special-12-regular">#{{ s.route }}</code>
          <span class="ds-text-special-special-12-regular">Figma: {{ s.figma }}</span>
        </span>
      </RouterLink>
    </div>

    <footer class="index__foot">
      <RouterLink to="/showcase" class="foot-link ds-text-special-special-16-medium">
        Дизайн-система: палітра, типографіка, компоненти <Icon name="arrow-right-16" />
      </RouterLink>
      <a :href="storybookUrl" class="foot-link ds-text-special-special-16-medium">
        Каталог компонентів (Storybook) <Icon name="arrow-right-16" />
      </a>
    </footer>
  </main>
</template>

<style scoped>
.index {
  display: flex;
  flex-direction: column;
  gap: var(--space-32);
  box-sizing: border-box;
  min-height: 100vh;
  padding: var(--space-48) var(--space-40);
  background: var(--surface-subtle);
  color: var(--text-primary);
}
.index__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
.index__title,
.index__lead {
  margin: 0;
}
.index__lead {
  color: var(--text-secondary);
}
.index__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
  gap: var(--space-16);
}
.tile {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-20);
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-12);
  background: var(--surface-default);
  color: var(--text-primary);
  text-decoration: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.tile:hover {
  border-color: var(--border-hover-card);
  box-shadow: var(--shadow-m);
}
.tile__desc {
  color: var(--text-secondary);
}
.tile__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4) var(--space-16);
  margin-top: auto;
  padding-top: var(--space-8);
  color: var(--text-secondary);
}
.index__foot {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-24);
}
.foot-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--text-link);
  text-decoration: none;
}
.foot-link:hover {
  text-decoration: underline;
}
@media (max-width: 600px) {
  .index {
    padding: var(--space-24) var(--space-16);
  }
}
</style>
