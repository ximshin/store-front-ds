import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  ButtonFront, Icon, Input, Select, Tabs, SectionTitle, CheckoutHeader, CheckoutConfirm, OrderSummary, PromoChip,
  CartItem, Modal, LoginForm, Coupon, FreeShippingProgress, RecommendedItem, Header, Footer, Breadcrumbs,
  Toast, Warning, Tooltip, EmptyState,
} from '../main';

/**
 * Песочницы: компоненты базы в реальной композиции магазина (directive_storybook_vue, Фаза 5).
 * Собираются только из компонентов `src/components` — ничего не перерисовывается.
 */
const meta = {
  title: 'Sandboxes',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', fullWidth: true, controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const page = 'background:var(--surface-subtle);min-height:100%;';
const card = 'background:var(--surface-default);border:var(--stroke-thin) solid var(--border-card);border-radius:var(--radius-8);overflow:hidden;';
const section = 'display:flex;flex-direction:column;gap:var(--space-16);padding:var(--space-16);border-bottom:var(--stroke-thin) solid var(--border-divider);';

/** Оформление заказа — как экран Figma `Checkout Tabs — Desktop` (макет HOROSHOP-8318). */
export const Checkout: Story = {
  name: 'Оформлення замовлення',
  render: () => ({
    components: { ButtonFront, Icon, Input, Select, Tabs, SectionTitle, CheckoutHeader, CheckoutConfirm, OrderSummary, PromoChip, CartItem },
    setup: () => ({
      page, card, section,
      tabs: [{ label: 'Звичайне', value: 'full' }, { label: 'Швидке', value: 'quick' }],
      bundle: [
        { title: 'Футболка чоловіча Basic, темно-синя', oldPrice: '899 грн', price: '749 грн' },
        { title: 'Комбінезон джинсовий жіночий Relaxed Fit', oldPrice: '2 499 грн', price: '2 199 грн' },
      ],
    }),
    template: `
      <div :style="page">
        <CheckoutHeader show-callback phones="050 029-37-94, 063 500-89-85, 067 189-29-84" />
        <div style="display:flex;gap:var(--space-16);align-items:flex-start;max-width:1280px;margin:0 auto">
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:var(--space-16) var(--space-16) 0">
            <div style="width:600px;padding-top:var(--space-8)">
              <h1 class="ds-text-display-m" style="margin:0 0 var(--space-16)">Оформлення замовлення</h1>
              <Tabs :items="tabs" model-value="full" :divider="false" gap="var(--space-24)" />
            </div>
            <div :style="card + 'width:600px'">
              <div :style="section">
                <SectionTitle size="m" title="Одержувач замовлення" />
                <div style="display:flex;gap:var(--space-8)"><Input size="l" label="Прізвище" model-value="Шевченко" style="flex:1" /><Input size="l" label="Ім'я" model-value="Олександр" style="flex:1" /></div>
                <div style="display:flex;gap:var(--space-8)"><Input size="l" label="Телефон" model-value="+38 (066) 123-45-67" style="flex:1" /><Input size="l" label="Е-пошта" model-value="poshta@gmail.com" style="flex:1" /></div>
                <Input size="l" label="Країна" model-value="Україна" />
                <Input size="l" label="Місто" model-value="Київ" />
                <div><ButtonFront type="flat" size="m" label="Додати коментар до замовлення" /></div>
              </div>
              <div :style="section">
                <SectionTitle size="m" title="Доставка" :show-action="false" />
                <Select size="l" :show-label="false" placeholder="Новою поштою" />
                <div style="display:flex;gap:var(--space-8);align-items:center">
                  <Select size="l" :show-label="false" placeholder="виберіть відділення" style="flex:1" />
                  <ButtonFront type="default" size="l" label="Обрати на мапі" show-left-icon><template #left><Icon name="location-24" /></template></ButtonFront>
                </div>
              </div>
              <div :style="section">
                <SectionTitle size="m" title="Оплата" :show-action="false" />
                <Select size="l" :show-label="false" placeholder="На карту Visa/MasterCard" />
              </div>
              <CheckoutConfirm />
            </div>
          </div>
          <div style="width:500px;flex:none;padding:var(--space-32) var(--space-16) var(--space-16) 0">
            <div :style="card">
              <div style="padding:var(--space-16)"><SectionTitle size="m" title="Ваше замовлення" :show-action="false" /></div>
              <div style="display:flex;flex-direction:column;gap:var(--space-16);padding:var(--space-16) 0;border-top:var(--stroke-thin) solid var(--border-card);border-bottom:var(--stroke-thin) solid var(--border-card)">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:0 var(--space-16)">
                  <PromoChip code="SMART10" />
                  <ButtonFront type="flat" size="m" label="Додати код" show-left-icon />
                </div>
                <OrderSummary :show-title="false" :show-discount="false" :show-divider="false" :show-button="false"
                  items-label="Проміжна сума" items-total="215 280 грн" delivery-value="за тарифами перевізника" total-label="Загальна сума" total="215 280 грн" />
              </div>
              <CartItem size="compact" title="Навушники Apple AirPods Max, Space Gray" old-price="25 999 грн" price="21 999 грн" sum="43 998 грн" :quantity="2" :show-min-order="false" show-wholesale wholesale-text="додайте ще 3 одиниці та заощадьте 1 200 грн" :show-gift="false" />
              <CartItem type="bundle" size="compact" :items="bundle" old-sum="3 398 грн" sum="2 948 грн" />
              <CartItem size="compact" title="Apple iPhone 15 Pro 128GB Natural Titanium" old-price="49 999 грн" price="47 499 грн" sum="94 998 грн" :quantity="2" show-discount discount-label="smart-5 (−2 500 грн)" min-order-text="Замовлення від 2 шт." :show-gift="false" />
              <CartItem size="compact" title="Сукня-футболка оверсайз, сіра" old-price="1 290 грн" price="990 грн" sum="990 грн" :quantity="1" :show-min-order="false" show-gift :gift="{ title: 'Свічка ароматична «№7» — подарунок', oldPrice: '450 грн' }" />
              <CartItem size="compact" title="AppleCare+ для iPhone 15 Pro, 2 роки (електронний ключ)" old-price="8 999 грн" price="8 099 грн" sum="8 099 грн" :show-min-order="false" show-discount discount-label="smart-10 (−900 грн)" show-electronic :show-counter="false" :show-gift="false" />
            </div>
          </div>
        </div>
      </div>`,
  }),
};

/** Модальное окно входа поверх оформления (макет 1912:103858). */
export const LoginModal: Story = {
  name: 'Модальне вікно входу',
  render: () => ({
    components: { Modal, LoginForm },
    template: `
      <div style="position:relative;transform:translateZ(0);min-height:640px;background:var(--surface-subtle)">
        <div style="position:absolute;inset:0;background:var(--surface-overlay)"></div>
        <div style="position:relative;display:flex;justify-content:center;padding-top:100px">
          <Modal size="s" title="Вхід" :show-footer="false">
            <LoginForm email="customer@poshta.com" password="password1234" />
          </Modal>
        </div>
      </div>`,
  }),
};

/** Кошик: товари, промокод, прогрес до безкоштовної доставки, підсумок, рекомендації. */
export const Cart: Story = {
  name: 'Кошик',
  render: () => ({
    components: { CartItem, Coupon, FreeShippingProgress, OrderSummary, RecommendedItem },
    setup: () => ({ page, card }),
    template: `
      <div :style="page + 'padding:var(--space-32)'">
        <h1 class="ds-text-display-m" style="margin:0 0 var(--space-24)">Кошик</h1>
        <div style="display:flex;gap:var(--space-32);align-items:flex-start">
          <div :style="card + 'flex:1'">
            <CartItem title="Навушники Apple AirPods Max, Space Gray" old-price="25 999 грн" price="21 999 грн" sum="43 998 грн" :quantity="2" show-wholesale wholesale-text="додайте ще 3 одиниці та заощадьте 1 200 грн" />
            <CartItem title="Сукня-футболка оверсайз, сіра" old-price="1 290 грн" price="990 грн" sum="990 грн" :quantity="1" :show-min-order="false" show-gift-tag />
            <CartItem type="bundle" title="Комплект «Осінь»" sum="2 248 грн" />
          </div>
          <div style="width:400px;display:flex;flex-direction:column;gap:var(--space-16)">
            <FreeShippingProgress text="До безкоштовної доставки залишилось 459 грн" :progress="70" />
            <Coupon state="collapsed" />
            <OrderSummary />
          </div>
        </div>
        <h2 class="ds-text-heading-h2" style="margin:var(--space-32) 0 var(--space-16)">Рекомендуємо</h2>
        <div style="display:flex;gap:var(--space-16)">
          <RecommendedItem title="Футболка чоловіча Basic" />
          <RecommendedItem title="Світшот «Хвилі»" />
          <RecommendedItem title="Свічка ароматична «№7»" />
        </div>
      </div>`,
  }),
};

/** Навигация: шапка, хлебные крошки, вкладки товара, подвал. */
export const Navigation: Story = {
  name: 'Навігація',
  render: () => ({
    components: { Header, Breadcrumbs, Tabs, Footer },
    setup: () => ({
      crumbs: ['Головна', 'Одяг', 'Сукні', 'Сукня-футболка оверсайз'],
      tabs: [{ label: 'Опис', value: 'd' }, { label: 'Характеристики', value: 's' }, { label: 'Відгуки (12)', value: 'r' }, { label: 'Доставка й оплата', value: 'p' }],
    }),
    template: `
      <div style="background:var(--surface-default)">
        <Header device="desktop" />
        <div style="max-width:1232px;margin:0 auto;padding:var(--space-24) 0;display:flex;flex-direction:column;gap:var(--space-24)">
          <Breadcrumbs size="13" :items="crumbs" />
          <h1 class="ds-text-heading-h1" style="margin:0">Сукня-футболка оверсайз, сіра</h1>
          <Tabs :items="tabs" model-value="d" />
        </div>
        <Footer device="desktop" />
      </div>`,
  }),
};

/** Обратная связь: тосты, плашки, подсказка, пустое состояние. */
export const Feedback: Story = {
  name: 'Зворотний зв’язок',
  render: () => ({
    components: { Toast, Warning, Tooltip, EmptyState },
    template: `
      <div style="padding:var(--space-32);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-32);background:var(--surface-subtle)">
        <div style="display:flex;flex-direction:column;gap:var(--space-12)">
          <Toast type="success" message="Товар додано до кошика" />
          <Toast type="error" message="Не вдалося застосувати промокод" />
          <Toast type="info" message="Ціну оновлено" :show-action="false" />
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-12)">
          <Warning type="warning" text="Знижки не діють під час оплати цим способом" />
          <Warning type="info" text="Доставка 1–2 дні" :show-info="false" />
          <Warning type="danger" text="Товару немає в наявності" :show-info="false" />
          <Warning type="success" text="Промокод застосовано" :show-info="false" />
          <div style="padding-top:var(--space-12)"><Tooltip text="Знижка за промокодом не поєднується з оплатою частинами" /></div>
        </div>
        <div style="grid-column:1 / -1;display:flex;justify-content:center"><EmptyState type="cart" /></div>
      </div>`,
  }),
};
