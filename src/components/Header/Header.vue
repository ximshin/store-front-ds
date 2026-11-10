<script setup lang="ts">
/**
 * Header — шапка витрины (Figma 6210:264), собрана из Logo, NavItem, HeaderAction, CartButton, SocialIcon, IconButton.
 * Desktop 1280: ряд main (Logo, NavItem Light ×5, поиск, контакты / вход, CartButton) + тёмная плашка bar
 * (surface/action/primary, radius/8: NavItem Dark, SocialIcon, HeaderAction S Dark). Mobile 430×48: фон surface/hover,
 * бургер, Logo, вход и корзина.
 *
 * Figma → props: Device=Desktop/Mobile → device ('desktop' | 'mobile'). Тексты и пункты (контент макета) —
 * props phone, cartCount, cartPrice, mainNav, infoNav, socials.
 */
import HeaderAction from '../HeaderAction/HeaderAction.vue';
import CartButton from '../CartButton/CartButton.vue';
import IconButton from '../IconButton/IconButton.vue';
import Logo from '../Logo/Logo.vue';
import NavItem from '../NavItem/NavItem.vue';
import SocialIcon, { type SocialNetwork } from '../SocialIcon/SocialIcon.vue';

withDefaults(
  defineProps<{
    device?: 'desktop' | 'mobile';
    phone?: string;
    cartCount?: string;
    cartPrice?: string;
    /** Верхний ряд меню (NavItem Light). */
    mainNav?: string[];
    /** Меню тёмной плашки (NavItem Dark); последний пункт — выпадающий (со стрелкой). */
    infoNav?: string[];
    /** Соцсети в тёмной плашке. */
    socials?: SocialNetwork[];
  }>(),
  {
    device: 'desktop',
    phone: '095 123-45-67',
    cartCount: '1',
    cartPrice: '1 299 грн',
    mainNav: () => ['Чоловікам', 'Жінкам', 'Взуття', 'Дітям', 'Аксесуари'],
    infoNav: () => ['Про нас', 'Оплата і доставка', 'Обмін та повернення', 'Ще'],
    socials: () => ['facebook', 'instagram', 'tiktok', 'youtube', 'whatsapp'],
  },
);
</script>

<template>
  <header v-if="device === 'desktop'" class="ds-header ds-header--desktop">
    <div class="ds-header__main">
      <div class="ds-header__group ds-header__group--left">
        <Logo />
        <nav class="ds-header__group" aria-label="Каталог">
          <NavItem v-for="item in mainNav" :key="item" :label="item" />
        </nav>
        <IconButton icon="search-24" label="Пошук" />
      </div>
      <div class="ds-header__group">
        <HeaderAction :label="phone" icon="phone-24" show-arrow />
        <HeaderAction label="Вхід" icon="user-24" />
        <CartButton :count="cartCount" :price="cartPrice" />
      </div>
    </div>
    <div class="ds-header__bar">
      <div class="ds-header__group ds-header__group--left">
        <nav class="ds-header__group" aria-label="Інформація">
          <NavItem
            v-for="(item, i) in infoNav"
            :key="item"
            theme="dark"
            :label="item"
            :show-arrow="i === infoNav.length - 1"
          />
        </nav>
        <div class="ds-header__socials">
          <SocialIcon v-for="n in socials" :key="n" :network="n" />
        </div>
      </div>
      <div class="ds-header__group">
        <HeaderAction size="s" theme="dark" label="Бажання" icon="heart-24" />
        <HeaderAction size="s" theme="dark" label="Порівняння" icon="compare-24" />
        <HeaderAction size="s" theme="dark" label="UAH" icon="currency-24" show-arrow />
      </div>
    </div>
  </header>

  <header v-else class="ds-header ds-header--mobile">
    <IconButton icon="menu-24" label="Меню" />
    <Logo size="mobile" />
    <div class="ds-header__group">
      <IconButton icon="user-24" label="Вхід" />
      <IconButton icon="cart-24" label="Кошик" />
    </div>
  </header>
</template>

<style scoped>
.ds-header {
  box-sizing: border-box;
  width: 100%;
}
.ds-header__group {
  display: flex;
  align-items: center;
}
.ds-header__group--left {
  gap: var(--space-16);
}

.ds-header--desktop {
  display: flex;
  flex-direction: column;
  padding: 0 var(--space-24) var(--space-16);
  background: var(--surface-default);
}
.ds-header__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-16) 0;
}
.ds-header__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-8);
  background: var(--surface-action-primary);
}
.ds-header__socials {
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.ds-header--mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--space-48);
  padding: 0 var(--space-8);
  background: var(--surface-hover);
}
</style>
