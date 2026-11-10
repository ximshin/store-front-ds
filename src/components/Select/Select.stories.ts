import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Select from './Select.vue';

const POSITIONS = ['top', 'left'] as const;
const SIZES = ['m', 'l'] as const;

const LIST = `
  <template #list>
    <div class="ds-text-form-input-text" style="padding:var(--space-8);border-radius:var(--radius-4);background:var(--surface-hover)">Відділення №1: вул. Хрещатик, 22</div>
    <div class="ds-text-form-input-text" style="padding:var(--space-8);border-radius:var(--radius-2)">Відділення №2: просп. Перемоги, 10</div>
    <div class="ds-text-form-input-text" style="padding:var(--space-8);border-radius:var(--radius-2)">Поштомат №4501</div>
  </template>`;

/**
 * Выпадающий список (Figma `6108:3333`). Default — стрелка (icon/dropdown-arrow), Selected — значение и крестик очистки,
 * Disabled — обводка border/disabled. Опции — слот `list`.
 * Size **m** — поле 32 (по умолчанию), **l** — поле 40 (оформление заказа).
 */
const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 444,
    docs: {
      description: {
        component:
          'Выпадающий список (Figma `6108:3333`). Собран из `InputMain`. State=Selected — когда задан `modelValue` (или `selected`). Клик по полю переключает список, крестик очищает значение (`clear`).',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text', description: 'Figma: State=Selected (подпись выбранного значения)' },
    placeholder: { control: 'text' },
    label: { control: 'text', description: 'Figma: Label' },
    showLabel: { control: 'boolean', description: 'Figma: Show label' },
    showList: { control: 'boolean', description: 'Figma: Show list (слот `list`)' },
    selected: { control: 'boolean', description: 'Принудительно State=Selected' },
    labelPosition: { control: 'inline-radio', options: POSITIONS, description: 'Figma: Label position' },
    size: { control: 'inline-radio', options: SIZES, description: 'Figma: Size (m = поле 32, l = поле 40)' },
    disabled: { control: 'boolean', description: 'Figma: State=Disabled' },
  },
  args: {
    modelValue: '',
    placeholder: 'Оберіть відділення',
    label: 'Відділення Нова пошта',
    showLabel: true,
    showList: false,
    labelPosition: 'top',
    size: 'm',
    disabled: false,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: `<div style="min-height:${args.showList ? 200 : 0}px"><Select v-bind="args">${LIST}</Select></div>`,
  }),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Не выбрано — стрелка. */
export const Default: Story = {};

/** Выбрано — значение и крестик очистки. */
export const Selected: Story = { args: { modelValue: 'Відділення №1: вул. Хрещатик, 22' } };

export const Disabled: Story = { args: { disabled: true } };
export const LabelLeft: Story = { args: { labelPosition: 'left', label: 'Місто', placeholder: 'Оберіть місто' } };
export const SizeL: Story = { args: { size: 'l', modelValue: 'Київ', label: 'Місто' } };

/** Список опций открыт (слот `list`). */
export const WithList: Story = { args: { showList: true } };

export const English: Story = { args: { label: 'Delivery point', placeholder: 'Select option', modelValue: 'Branch #1' } };

/** Подпись и значение с Ґ Є І Ї — значение обрезается многоточием. */
export const LongText: Story = {
  args: {
    label: 'Відділення «Нова пошта» (Ґанок, Єдність, Їжа, Іванівка)',
    modelValue: 'Відділення №15 (до 30 кг): вул. Ґалаґанівська, 125/Є, м. Їржавець, Івано-Франківська область',
  },
};

/** Size × Label position × State. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Select },
    setup: () => ({ POSITIONS, SIZES }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,444px));gap:var(--space-24) var(--space-32);padding:var(--space-24)">
        <template v-for="s in SIZES" :key="s">
          <template v-for="p in POSITIONS" :key="s + p">
            <div style="display:flex;flex-direction:column;gap:var(--space-16)">
              <code class="ds-text-special-special-12-regular">size {{ s }} · label {{ p }}</code>
              <Select :size="s" :label-position="p" placeholder="Select option"/>
              <Select :size="s" :label-position="p" model-value="Option"/>
              <Select :size="s" :label-position="p" placeholder="Select option" disabled/>
            </div>
          </template>
        </template>
      </div>`,
  }),
};

const LONG_VALUE =
  'Відділення №15 (до 30 кг): вул. Ґалаґанівська, 125/Є, м. Їржавець, Івано-Франківська область, Україна, 76000';

const MANY_OPTIONS = Array.from({ length: 24 }, (_, i) =>
  i % 5 === 0
    ? `Поштомат №${4500 + i}: вул. Ґалицька, ${i + 1}, Їжакевичі`
    : `Відділення №${i + 1}: вул. Хрещатик, ${i + 10}`,
);

/** Довге вибране значення обрізається багатокрапкою (`text-overflow: ellipsis`), хрестик очищення лишається видимим. */
export const LongSelectedValue: Story = {
  args: { label: 'Відділення Нова пошта', modelValue: LONG_VALUE },
};

/** Довге вибране значення, мітка зліва: поле стискається, значення обрізається. */
export const LongSelectedValueLabelLeft: Story = {
  args: { labelPosition: 'left', label: 'Відділення', modelValue: LONG_VALUE },
};

/**
 * Дуже довгий список (24 пункти) у відкритому стані: меню не вище 5 × 48 і прокручується.
 */
export const VeryLongList: Story = {
  parameters: { controls: { disable: true } },
  args: { showList: true, placeholder: 'Оберіть відділення' },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args, options: MANY_OPTIONS }),
    template: `
      <div style="min-height:320px">
        <Select v-bind="args">
          <template #list>
            <div>
              <div v-for="(o, i) in options" :key="o" class="ds-text-form-input-text"
                :style="{ padding: 'var(--space-8)', borderRadius: 'var(--radius-4)', background: i === 2 ? 'var(--surface-hover)' : 'transparent' }">{{ o }}</div>
            </div>
          </template>
        </Select>
      </div>`,
  }),
};

/** Вимкнений зі значенням: текст `text/disabled`, обводка `border/disabled`, без хрестика очищення. */
export const DisabledWithValue: Story = {
  args: { disabled: true, modelValue: 'Відділення №1: вул. Хрещатик, 22' },
};

/** Size M (32) та L (40) поруч: порожні, вибрані та вимкнені. */
export const SizeMvsL: Story = {
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Select },
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,444px));gap:var(--space-24);align-items:start;padding:var(--space-24)">
        <div style="display:flex;flex-direction:column;gap:var(--space-16)">
          <code class="ds-text-special-special-12-regular">size m</code>
          <Select size="m" label="Місто" placeholder="Оберіть місто" />
          <Select size="m" label="Місто" model-value="Київ" />
          <Select size="m" label="Місто" model-value="Київ" disabled />
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-16)">
          <code class="ds-text-special-special-12-regular">size l</code>
          <Select size="l" label="Місто" placeholder="Оберіть місто" />
          <Select size="l" label="Місто" model-value="Київ" />
          <Select size="l" label="Місто" model-value="Київ" disabled />
        </div>
      </div>`,
  }),
};

/**
 * Порожній обов'язковий вибір: окремого стану error у Select (як і в Figma `6108:3333`) немає,
 * тому показано порожнє поле з позначкою «*» у підписі та текстом-підказкою під ним. Червоної обводки компонент не підтримує.
 */
export const EmptyRequired: Story = {
  args: { label: 'Відділення Нова пошта *', placeholder: 'Оберіть відділення' },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: `
      <div>
        <Select v-bind="args" />
        <p class="ds-text-special-special-12-regular" style="margin:var(--space-4) 0 0;color:var(--text-danger)">Оберіть відділення, щоб продовжити</p>
      </div>`,
  }),
};
