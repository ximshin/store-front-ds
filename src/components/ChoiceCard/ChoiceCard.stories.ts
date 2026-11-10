import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import ChoiceCard from './ChoiceCard.vue';
import Icon from '../Icon/Icon.vue';

const LAYOUTS = ['card', 'row'] as const;

/**
 * Выбор способа доставки / оплаты (Figma `6254:522`). **Layout=Card** — карточка с рамкой (Selected — `border/input-active` +
 * `surface/subtle`), **Layout=Row** — строка списка без рамки с нижней линией `border/divider`. Внутри `Radio`, название,
 * описание, цена и иконка. Hover — `:hover`, Disabled — prop `disabled`, Selected — prop `selected`.
 * `showParams` + слот `params` — поля выбранного способа (по умолчанию Select + «Обрати на мапі»); включать у выбранного пункта.
 */
const meta = {
  title: 'Forms/ChoiceCard',
  component: ChoiceCard,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 444,
    docs: {
      description: {
        component:
          'Выбор способа доставки / оплаты (Figma `6254:522`). Card: `border/card`, radius/8. Row: без рамки, линия `border/divider`, название `DS/Paragraph/P1`. Цена — `DS/Price/S`. Иконка — prop `icon` или слот `icon`; слот `params` — поля выбранного способа.',
      },
    },
  },
  argTypes: {
    layout: { control: 'inline-radio', options: LAYOUTS, description: 'Figma: Layout (Card / Row)' },
    title: { control: 'text', description: 'Figma: Title' },
    description: { control: 'text', description: 'Figma: Description' },
    price: { control: 'text', description: 'Figma: Price' },
    showDescription: { control: 'boolean', description: 'Figma: Show description' },
    showPrice: { control: 'boolean', description: 'Figma: Show price' },
    showIcon: { control: 'boolean', description: 'Figma: Show icon' },
    icon: { control: 'text', description: 'Figma: Icon (swap) — имя иконки, напр. `location-24` (или слот `icon`)' },
    showParams: { control: 'boolean', description: 'Figma: Show params' },
    selected: { control: 'boolean', description: 'Figma: State=Selected' },
    disabled: { control: 'boolean', description: 'Figma: State=Disabled' },
    name: { control: 'text', description: 'name радио-кнопки (группа)' },
    value: { control: 'text' },
    params: { control: false, description: 'Слот: поля выбранного способа (Figma: params). По умолчанию Select + ButtonFront.' },
  },
  args: {
    layout: 'card',
    title: 'Нова Пошта — відділення',
    description: 'Завтра, 8 жовтня',
    price: '70 грн',
    showDescription: true,
    showPrice: true,
    showIcon: true,
    icon: 'location-24',
    showParams: false,
    selected: false,
    disabled: false,
  },
} satisfies Meta<typeof ChoiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Карточка по умолчанию. Наведите курсор — Hover. */
export const Card: Story = {};

/** Выбранная карточка. */
export const CardSelected: Story = { args: { selected: true } };

/** Недоступный способ. */
export const CardDisabled: Story = { args: { disabled: true } };

/** Выбранная карточка с полями: список відділень и кнопка «Обрати на мапі». */
export const WithParams: Story = { args: { selected: true, showParams: true } };

/** Строка списка. */
export const Row: Story = { args: { layout: 'row' } };

export const RowSelected: Story = { args: { layout: 'row', selected: true } };
export const RowDisabled: Story = { args: { layout: 'row', disabled: true } };

/** Своё содержимое слота `params` (самовивіз). */
export const CustomParams: Story = {
  args: { selected: true, showParams: true, title: 'Самовивіз з магазину', description: 'Сьогодні, безкоштовно', price: '0 грн', icon: 'user-24' },
  render: (args) => ({
    components: { ChoiceCard },
    setup: () => ({ args }),
    template: `
      <ChoiceCard v-bind="args">
        <template #params>
          <span class="ds-text-paragraph-p1">вул. Хрещатик, 22, Київ · щодня 10:00–20:00</span>
        </template>
      </ChoiceCard>`,
  }),
};

/** Без описання, ціни та іконки. */
export const Minimal: Story = {
  args: { title: 'Оплата при отриманні', showDescription: false, showPrice: false, showIcon: false },
};

/** Довгі тексти uk (Ґ Є І Ї) — перенос рядків. */
export const LongText: Story = {
  args: {
    title: 'Укрпошта — доставка до відділення з можливістю огляду посилки Ґанок Єнакієве Їжак',
    description: 'Орієнтовно 3–5 робочих днів, залежно від віддаленості населеного пункту та завантаження відділення',
    price: '1 250 грн',
  },
};

export const English: Story = {
  args: { title: 'Nova Poshta — branch pickup', description: 'Tomorrow, October 8', price: 'UAH 70' },
};

/** Группа карточек: выбор способа доставки (интерактивно). */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { ChoiceCard },
    setup: () => {
      const current = ref('np');
      const items = [
        { id: 'np', title: 'Нова Пошта — відділення', description: 'Завтра, 8 жовтня', price: '70 грн' },
        { id: 'courier', title: 'Нова Пошта — кур’єр', description: 'Завтра, 8 жовтня', price: '120 грн' },
        { id: 'ukr', title: 'Укрпошта', description: '3–5 робочих днів', price: '45 грн' },
        { id: 'pickup', title: 'Самовивіз', description: 'Сьогодні', price: '0 грн' },
      ];
      return { current, items };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-8)">
        <ChoiceCard
          v-for="i in items" :key="i.id" v-bind="i" name="delivery"
          :selected="current === i.id" :show-params="current === i.id && i.id === 'np'"
          @select="current = i.id" />
      </div>`,
  }),
};

/** Вся матрица Layout × State; с параметрами и со слотом иконки. Hover — наведите курсор. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { ChoiceCard, Icon },
    setup: () => ({ LAYOUTS }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,444px));gap:var(--space-24);align-items:start;padding:var(--space-24)">
        <template v-for="l in LAYOUTS" :key="l">
          <div style="display:flex;flex-direction:column;gap:var(--space-16)">
            <code class="ds-text-special-special-12-regular">{{ l }}</code>
            <ChoiceCard :layout="l" />
            <ChoiceCard :layout="l" selected />
            <ChoiceCard :layout="l" disabled />
            <ChoiceCard :layout="l" selected show-params />
            <ChoiceCard :layout="l" icon="user-24" title="Оплата карткою" description="Visa / Mastercard" price="0 грн" />
            <ChoiceCard :layout="l" :show-description="false" :show-price="false" :show-icon="false" title="Без деталей" />
          </div>
        </template>
      </div>`,
  }),
};

const LONG_TITLE =
  'Укрпошта — експрес-доставка до відділення з можливістю огляду посилки Ґанок Єнакієве Їжак Інтернет-замовлення';
const LONG_DESCRIPTION =
  'Орієнтовно 3–5 робочих днів, залежно від віддаленості населеного пункту, завантаження відділення та погодних умов. Ґарантія збереження посилки, Єдиний тариф.';

/** Довга назва та довгий опис у Card: текст переноситься (`overflow-wrap: anywhere`), ціна та іконка не стискаються. */
export const LongTitleAndDescription: Story = {
  args: { title: LONG_TITLE, description: LONG_DESCRIPTION, price: '1 250 грн', selected: true },
};

/** Довга назва та довгий опис у Row. */
export const LongTitleAndDescriptionRow: Story = {
  args: { layout: 'row', title: LONG_TITLE, description: LONG_DESCRIPTION, price: '1 250 грн' },
};

/** Ціна «Безкоштовно» — довший рядок замість «0 грн». */
export const PriceFree: Story = {
  args: { title: 'Самовивіз з магазину', description: 'Сьогодні', price: 'Безкоштовно', icon: 'user-24' },
};

/** Група з шести способів доставки (Row): вибрана «Нова пошта · відділення» з відкритими параметрами. */
export const DeliveryRowGroup: Story = {
  name: 'Група з 6 способів доставки (Row)',
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { ChoiceCard },
    setup: () => {
      const current = ref('np-branch');
      const items = [
        { id: 'np-branch', title: 'Нова пошта · відділення', description: 'Завтра, 8 жовтня', price: '70 грн', icon: 'location-24' },
        { id: 'np-locker', title: 'Нова пошта · поштомат', description: 'Завтра, 8 жовтня', price: '60 грн', icon: 'location-24' },
        { id: 'np-courier', title: 'Нова пошта · кур’єр', description: 'Завтра, 8 жовтня', price: '120 грн', icon: 'user-24' },
        { id: 'ukr', title: 'Укрпошта', description: '3–5 робочих днів', price: '45 грн', icon: 'location-24' },
        { id: 'meest', title: 'Meest', description: '2–3 робочих дні', price: '65 грн', icon: 'location-24' },
        { id: 'pickup', title: 'Самовивіз', description: 'Сьогодні', price: 'Безкоштовно', icon: 'user-24' },
      ];
      return { current, items };
    },
    template: `
      <div style="display:flex;flex-direction:column;min-height:480px">
        <ChoiceCard
          v-for="i in items" :key="i.id" v-bind="i" layout="row" name="delivery-row"
          :selected="current === i.id" :show-params="current === i.id && (i.id === 'np-branch' || i.id === 'np-locker')"
          @select="current = i.id" />
      </div>`,
  }),
};

/** Disabled і Selected у всіх комбінаціях (Card та Row). */
export const DisabledSelectedCombos: Story = {
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { ChoiceCard },
    setup: () => ({ LAYOUTS }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,444px));gap:var(--space-24);align-items:start;padding:var(--space-24)">
        <div v-for="l in LAYOUTS" :key="l" style="display:flex;flex-direction:column;gap:var(--space-16)">
          <code class="ds-text-special-special-12-regular">{{ l }}</code>
          <ChoiceCard :layout="l" title="Звичайний" />
          <ChoiceCard :layout="l" title="Вибраний" selected />
          <ChoiceCard :layout="l" title="Вимкнений" disabled />
          <ChoiceCard :layout="l" title="Вибраний і вимкнений" selected disabled />
          <ChoiceCard :layout="l" title="Вибраний і вимкнений з параметрами" selected disabled show-params />
        </div>
      </div>`,
  }),
};

/** Card та Row поруч з однаковим довгим вмістом. */
export const CardVsRow: Story = {
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { ChoiceCard },
    setup: () => ({ LAYOUTS, LONG_TITLE, LONG_DESCRIPTION }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,444px));gap:var(--space-24);align-items:start;padding:var(--space-24)">
        <div v-for="l in LAYOUTS" :key="l" style="display:flex;flex-direction:column;gap:var(--space-16)">
          <code class="ds-text-special-special-12-regular">{{ l }}</code>
          <ChoiceCard :layout="l" :title="LONG_TITLE" :description="LONG_DESCRIPTION" price="Безкоштовно" />
          <ChoiceCard :layout="l" selected show-params />
          <ChoiceCard :layout="l" title="Nova Poshta — branch pickup" description="Tomorrow, October 8" price="UAH 70" />
        </div>
      </div>`,
  }),
};
