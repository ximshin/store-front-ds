<script setup lang="ts">
// Screen «Оформлення замовлення» — Figma «Checkout Tabs — Desktop» (6355:10633), mockup HOROSHOP-8318.
// Composition from the base (directive_screens_vue), wired to the mock store (directive_wire_vue):
// tabs switch the full form / quick order, header «back» → screens index, «Передзвонити вам?» → quick order.
// Shop setting «quick order» off (prop quickOrder=false): no tabs, no «Передзвонити вам?», the full form only.
// Layout «accordion» (Figma variant 1991:61158): no tabs — the quick order is a collapsible card above the full form.
// Layout «folder» (Figma 1986:29745): folder tabs «Новий покупець / Увійти / Швидке замовлення» over one card —
// the full form, the login form (the popup's content) or the quick-order form. Sizes and the order column as «accordion».
import { computed, nextTick, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { CheckoutHeader, Tabs, LoginForm, SectionTitle } from '../../main';
import CheckoutForm from './parts/CheckoutForm.vue';
import QuickOrderForm from './parts/QuickOrderForm.vue';
import QuickOrderAccordion from './parts/QuickOrderAccordion.vue';
import QuickOrderFields from './parts/QuickOrderFields.vue';
import FolderTabs from './parts/FolderTabs.vue';
import OrderCard from './parts/OrderCard.vue';
import { checkout, login, loginSocial, forgotPassword, type Mode } from '../../data/checkout';

const props = withDefaults(defineProps<{ quickOrder?: boolean; quickLayout?: 'tabs' | 'accordion' | 'folder' }>(), {
  quickOrder: true,
  quickLayout: 'tabs',
});
const router = useRouter();
const accordion = props.quickLayout === 'accordion';
const folder = props.quickLayout === 'folder';
/** Card-style layouts (accordion, folder): order column up to 600, item count + scroll fade. */
const cardLayout = props.quickOrder && (accordion || folder);
const quickOpen = ref(false);
const quickCard = ref<HTMLElement | null>(null);
// Quick order switched off, or shown as a card — the full form is always there.
watchEffect(() => {
  if ((!props.quickOrder || accordion || folder) && checkout.mode !== 'full') checkout.mode = 'full';
});
// Folder tabs: «Увійти» disappears once logged in (the form shows «Вийти» instead).
const folderTab = ref<'new' | 'login' | 'quick'>('new');
const folderTabs = computed(() => [
  { value: 'new', label: 'Новий покупець', icon: 'cart-24' },
  ...(checkout.loggedIn ? [] : [{ value: 'login', label: 'Увійти', icon: 'user-24' }]),
  ...(props.quickOrder ? [{ value: 'quick', label: 'Швидке замовлення', icon: 'fast-24' }] : []),
]);
const l = checkout.login;
// Login done → back to the order form, already filled from the account.
async function onLogin() {
  if (await login()) folderTab.value = 'new';
}
async function onSocial(network: string) {
  if (await loginSocial(network)) folderTab.value = 'new';
}
async function onCallback() {
  if (folder) {
    folderTab.value = 'quick';
    await nextTick();
    return quickCard.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (!accordion) return setMode('quick');
  quickOpen.value = true;
  await nextTick();
  quickCard.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
const tabs = [
  { label: 'Звичайне', value: 'full' },
  { label: 'Швидке', value: 'quick' },
];
function setMode(value: string) {
  checkout.mode = value as Mode;
}
</script>

<template>
  <div class="screen" :class="{ 'screen--no-quick': !quickOrder, 'screen--accordion': cardLayout }">
    <CheckoutHeader
      :show-callback="quickOrder"
      phones="050 029-37-94, 063 500-89-85, 067 189-29-84"
      @back="router.push('/')"
      @callback="onCallback"
    />
    <main class="main">
      <div class="left">
        <div class="left__inner">
          <div class="head">
            <h1 class="ds-text-display-m head__title">Оформлення замовлення</h1>
            <Tabs
              v-if="quickOrder && !accordion && !folder"
              :items="tabs"
              :model-value="checkout.mode"
              :divider="false"
              gap="var(--space-24)"
              @update:model-value="setMode"
            />
            <div v-if="quickOrder && accordion" ref="quickCard" class="head__quick">
              <QuickOrderAccordion v-model:open="quickOpen" />
            </div>
            <div v-if="folder" ref="quickCard"><FolderTabs v-model="folderTab" :items="folderTabs" /></div>
          </div>
          <!-- Folder layout: one card under the tabs; top-left corner square while the first tab is active. -->
          <div v-if="folder" class="folder-panel" :class="{ 'is-first': folderTab === 'new', ['is-' + folderTab]: true }" role="tabpanel">
            <CheckoutForm v-if="folderTab === 'new'" :show-login="false" />
            <div v-else-if="folderTab === 'login'" class="folder-panel__login">
              <LoginForm
                v-model:email="l.email"
                v-model:password="l.password"
                :error="l.error"
                :loading="l.loading"
                :submit-label="l.loading ? 'Входимо…' : 'Увійти'"
                @submit="onLogin"
                @social="onSocial"
                @forgot="forgotPassword"
              />
            </div>
            <div v-else class="folder-panel__quick">
              <SectionTitle size="m" title="Одержувач замовлення" :show-action="false" />
              <QuickOrderFields />
            </div>
          </div>
          <!-- Accordion layout: while the quick order is open the full form is pale; using it closes the quick order. -->
          <div
            v-else-if="!quickOrder || accordion || checkout.mode === 'full'"
            class="full-form"
            :class="{ 'is-dimmed': accordion && quickOpen }"
            @pointerdown="quickOpen = false"
            @focusin="quickOpen = false"
          >
            <CheckoutForm />
          </div>
          <QuickOrderForm v-else />
        </div>
      </div>
      <aside class="right">
        <OrderCard :scroll-hint="cardLayout" />
      </aside>
    </main>
  </div>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background: var(--surface-subtle);
  color: var(--text-primary);
}
.main {
  display: flex;
  align-items: flex-start;
  gap: var(--space-16);
  max-width: 1280px;
  margin: 0 auto;
}
/* Figma: left column Fill, its 600-wide content centred; right column 500 (padding 32 / 16 / 16 / 0). */
.left {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  justify-content: center;
  padding: var(--space-16) var(--space-16) var(--space-40);
}
.left__inner {
  width: 100%;
  max-width: 600px;
}
.head {
  padding-top: var(--space-8);
}
/* Figma copy (header 1947:20086): title bottom padding 24 (gap/24). */
.head__title {
  margin: 0;
  padding-bottom: var(--space-24);
}
/* Accordion layout (Figma 1991:61158): the quick-order card, then 16 to the form. */
.head__quick {
  padding-bottom: var(--space-16);
}
/* Folder layout (Figma 1986:29745): one card, border/card, radius 8 (0 top-left under the first tab). */
.folder-panel {
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
.folder-panel.is-first {
  border-top-left-radius: 0;
}
/* The full form brings its own frame — inside the panel it has none. */
.folder-panel :deep(.form) {
  border: 0;
  background: none;
}
/* Figma: the recipient title row stays 40 high without the «Увійти» action (it moved to a tab). */
.folder-panel :deep(.form__section:first-child .ds-section-title) {
  min-height: var(--space-40);
}
/* «Швидке замовлення» tab: title «Одержувач замовлення» (row 40, as on the full form), then the quick form. */
.folder-panel__quick {
  padding: var(--space-16);
}
.folder-panel__quick :deep(.ds-section-title) {
  min-height: var(--space-40);
}
/* «Увійти» tab (Figma 2008:64156): LoginForm over the full card width (padding 24 top / 20 sides / 16 bottom);
   «Увійти» (hug) and «Забули пароль?» (flat, 32 high, padding 0 12) side by side, gap 16, 24 under the password.
   Screen-level arrangement of the DS LoginForm — the popup keeps its stacked layout. */
.folder-panel__login {
  padding: var(--space-24) var(--space-20) var(--space-16);
}
.folder-panel__login :deep(.ds-login-form) {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: var(--space-16);
}
.folder-panel__login :deep(.ds-login-form > *) {
  grid-column: 1 / -1;
}
.folder-panel__login :deep(.ds-login-form > .ds-login-form__submit) {
  grid-column: 1;
  width: auto;
}
.folder-panel__login :deep(.ds-login-form__submit .ds-button) {
  width: auto;
}
.folder-panel__login :deep(.ds-login-form > .ds-login-form__forgot) {
  grid-column: 2;
  justify-content: flex-start;
  padding: 0;
}
.folder-panel__login :deep(.ds-login-form__forgot-link) {
  height: 32px;
  padding: 0 var(--space-12);
  border-radius: var(--radius-4);
}
.folder-panel__login :deep(.ds-login-form__forgot-link:hover) {
  background: var(--surface-hover);
}
.full-form {
  transition: opacity 0.2s ease;
}
/* Quick order open — the full form steps back (0.4, as disabled elements in the DS) but stays usable. */
.full-form.is-dimmed {
  opacity: 0.4;
}
/* Figma: Tabs instance — container padding 16 left / right (tabs themselves have none). */
.head :deep(.ds-tabs) {
  box-sizing: border-box;
  padding: 0 var(--space-16);
}
/* Regular checkout, desktop — proportions from the Figma copy (main 1947:20084): container padding 32 / 32,
   gap 40, the left column fills the rest and the form fills it (no 600 cap), the order column 480
   (padding 32 top / 16 bottom). Content band max 1440, as the header. */
@media (min-width: 1101px) {
  .screen:not(.screen--no-quick) .main {
    box-sizing: border-box;
    gap: var(--space-40);
    max-width: 1440px;
    padding: 0 var(--space-32);
  }
  .screen:not(.screen--no-quick) .left {
    padding: var(--space-16) 0 var(--space-40);
  }
  .screen:not(.screen--no-quick) .left__inner {
    max-width: none;
  }
  .screen:not(.screen--no-quick) .right {
    flex-basis: 480px;
    padding: var(--space-32) 0 var(--space-16);
  }
  /* Accordion layout: the order column shares the width with the form, up to 600. */
  .screen.screen--accordion .right {
    flex: 1 1 0;
    max-width: 600px;
  }
}
/* Desktop: the order card sticks to the top, its item list scrolls inside (OrderCard). */
.right {
  position: sticky;
  top: 0;
  flex: 0 0 500px;
  box-sizing: border-box;
  padding: var(--space-32) var(--space-16) var(--space-16) 0;
}
/* CheckoutHeader exists in the DS only for desktop (1280): on narrow screens the screen hides
   the phones (< 900) and the back label (< 600, the arrow stays). No base change. */
@media (max-width: 900px) {
  .screen :deep(.ds-checkout-header__contacts) {
    display: none;
  }
}
@media (max-width: 600px) {
  .screen :deep(.ds-checkout-header) {
    padding: 0 var(--space-16);
  }
  .screen :deep(.ds-checkout-header__back .ds-button__label) {
    display: none;
  }
}
/* Vue only (not in the mockups): checkout without quick order. Content band max 1440, centred (as the header —
   global rule in CheckoutHeader): the form lives in it. The order card is the exception — always pinned to the
   right edge of the window (16 from it). The form is centred between the band's left edge and the card. */
@media (min-width: 1101px) {
  .screen--no-quick .main {
    max-width: none;
    gap: 0; /* the left column's own 16 px padding keeps the form off the card; equal space on both sides */
    padding-left: max(0px, calc((100% - 1440px) / 2));
  }
}
/* Narrow widths: columns stack, the order card goes under the form. */
@media (max-width: 1100px) {
  .main {
    flex-direction: column;
    align-items: stretch;
  }
  .right {
    position: static;
    flex: none;
    width: 100%;
    max-width: calc(600px + 2 * var(--space-16));
    margin: 0 auto;
    padding: 0 var(--space-16) var(--space-40);
  }
}
</style>
