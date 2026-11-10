import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Input from './Input.vue';

const POSITIONS = ['top', 'left'] as const;
const SIZES = ['m', 'l'] as const;

/**
 * Поле ввода (Figma `6108:2853`). Обводка border/input, фокус — 2 px border/input-active, ошибка — border/danger.
 * Size **m** — поле 32 (по умолчанию), **l** — поле 40 (оформление заказа). Подпись — сверху или слева.
 */
const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 444,
    docs: {
      description: {
        component:
          'Поле ввода (Figma `6108:2853`). Собрано из `InputMain`. Filled определяется значением `modelValue`: пусто — placeholder (text/disabled). Подсказка `hint` видна в состоянии `error`.',
      },
    },
  },
  argTypes: {
    clearable: { control: 'boolean', description: 'Крестик очистки справа, когда поле заполнено (событие clear)' },
    modelValue: { control: 'text', description: 'Figma: Filled (пусто → placeholder)' },
    label: { control: 'text', description: 'Figma: Label' },
    showLabel: { control: 'boolean', description: 'Figma: Show label' },
    placeholder: { control: 'text' },
    type: { control: 'select', options: ['text', 'tel', 'email', 'password', 'number'], description: 'Figma: Type=Default → html-тип' },
    labelPosition: { control: 'inline-radio', options: POSITIONS, description: 'Figma: Label position' },
    size: { control: 'inline-radio', options: SIZES, description: 'Figma: Size (m = поле 32, l = поле 40)' },
    disabled: { control: 'boolean', description: 'Figma: State=Disabled' },
    error: { control: 'boolean', description: 'Figma: State=Error' },
    hint: { control: 'text', description: 'Подсказка в состоянии error' },
    name: { control: 'text' },
  },
  args: {
    modelValue: '',
    label: 'Прізвище',
    showLabel: true,
    placeholder: 'Введіть прізвище',
    type: 'text',
    labelPosition: 'top',
    size: 'm',
    disabled: false,
    error: false,
    hint: 'Вкажіть прізвище',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Пустое поле с placeholder. */
export const Default: Story = {};

/** Заполненное поле. */
export const Filled: Story = { args: { modelValue: 'Шевченко' } };

export const LabelLeft: Story = { args: { labelPosition: 'left', label: 'Телефон', modelValue: '+380 50 123 45 67', type: 'tel' } };
export const SizeL: Story = { args: { size: 'l', label: 'Місто', modelValue: 'Київ' } };
export const Error: Story = { args: { error: true, modelValue: '+380 50', label: 'Телефон', hint: 'Вкажіть повний номер телефону' } };
export const Disabled: Story = { args: { disabled: true, modelValue: 'Шевченко' } };
export const WithoutLabel: Story = { args: { showLabel: false, placeholder: 'Промокод' } };
export const English: Story = { args: { label: 'Last name', placeholder: 'Enter last name', modelValue: 'Smith' } };

/** Подпись и значение с Ґ Є І Ї — длинный текст обрезается рамкой поля. */
export const LongText: Story = {
  args: {
    label: 'Адреса доставки (відділення «Нова пошта», вулиця Ґроші Єлизавети Їжакевич)',
    modelValue: 'м. Київ, вул. Хрещатик, 22, кв. 15, під’їзд 3, домофон 15 Ґ, поверх 5, Єдина Їдальня Іванівна',
    labelPosition: 'top',
  },
};

/** Size × Label position × (пусто / заполнено / ошибка / disabled). Hover и focus — наведите курсор и кликните. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Input },
    setup: () => ({ POSITIONS, SIZES }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,444px));gap:var(--space-24) var(--space-32);padding:var(--space-24)">
        <template v-for="s in SIZES" :key="s">
          <template v-for="p in POSITIONS" :key="s + p">
            <div style="display:flex;flex-direction:column;gap:var(--space-16)">
              <code class="ds-text-special-special-12-regular">size {{ s }} · label {{ p }}</code>
              <Input :size="s" :label-position="p" placeholder="Placeholder"/>
              <Input :size="s" :label-position="p" model-value="Шевченко"/>
              <Input :size="s" :label-position="p" model-value="Шевченко" error hint="Field hint"/>
              <Input :size="s" :label-position="p" model-value="Шевченко" disabled/>
            </div>
          </template>
        </template>
      </div>`,
  }),
};

/** Поле с крестиком очистки (`clearable`) — промокод, поиск адреса. */
export const Clearable: Story = {
  args: { label: 'Промокод', modelValue: 'SMART10', clearable: true, size: 'l' },
};
