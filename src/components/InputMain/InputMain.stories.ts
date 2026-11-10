import type { Meta, StoryObj } from '@storybook/vue3-vite';
import InputMain from './InputMain.vue';
import Icon from '../Icon/Icon.vue';

/**
 * Базовая строка поля ввода (Figma `4032:8049`) со слотами `left-items` / `main-items` / `right-items`,
 * подсказкой и выпадающим списком. Внутри Input, Select, SearchBar — сама по себе в макетах не используется.
 */
const meta = {
  title: 'Forms/input-main',
  component: InputMain,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 444,
    docs: {
      description: {
        component:
          'Базовая строка поля ввода (Figma `4032:8049`). Рамка border/input, радиус 8, поле 32 (size=m) или 40 (size=l). Слоты: `left-items`, `main-items`, `right-items`, `list`, `hint`.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['m', 'l'], description: 'Высота поля: m = 32, l = 40' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean', description: 'Рамка border/danger, подсказка text/danger' },
    showLeftItems: { control: 'boolean', description: 'Figma: Show left-items' },
    showRightItems: { control: 'boolean', description: 'Figma: Show right-items' },
    showHint: { control: 'boolean', description: 'Figma: Show hint' },
    showList: { control: 'boolean', description: 'Figma: Show list (слот `list`)' },
    hint: { control: 'text' },
  },
  args: {
    size: 'm',
    disabled: false,
    error: false,
    showLeftItems: false,
    showRightItems: true,
    showHint: true,
    showList: false,
    hint: 'Підказка до поля',
  },
} satisfies Meta<typeof InputMain>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Как в Figma: текст, крестик справа, подсказка. */
export const Default: Story = {};

/** Иконка слева (слот `left-items`). */
export const WithLeftItems: Story = {
  args: { showLeftItems: true },
  render: (args) => ({
    components: { InputMain, Icon },
    setup: () => ({ args }),
    template: `<InputMain v-bind="args"><template #main-items><span class="ds-text-form-input-text">Київ</span></template></InputMain>`,
  }),
};

export const SizeL: Story = { args: { size: 'l', showHint: false } };
export const Error: Story = { args: { error: true, hint: 'Вкажіть номер телефону' } };
export const Disabled: Story = { args: { disabled: true, showHint: false } };
export const English: Story = { args: { hint: 'Field hint' } };

/** Выпадающий список под полем (слот `list`). */
export const WithList: Story = {
  args: { showList: true, showHint: false },
  render: (args) => ({
    components: { InputMain },
    setup: () => ({ args }),
    template: `
      <div style="min-height:140px">
        <InputMain v-bind="args">
          <template #main-items><span class="ds-text-form-input-text">Нова пошта</span></template>
          <template #list>
            <div class="ds-text-form-input-text" style="padding:var(--space-8);border-radius:var(--radius-4);background:var(--surface-hover)">Нова пошта</div>
            <div class="ds-text-form-input-text" style="padding:var(--space-8)">Укрпошта</div>
          </template>
        </InputMain>
      </div>`,
  }),
};

/** Size × состояния. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { InputMain, Icon },
    template: `
      <div style="display:grid;grid-template-columns:max-content 1fr 1fr;gap:var(--space-16) var(--space-24);align-items:center;padding:var(--space-24);max-width:900px">
        <span></span><code class="ds-text-special-special-12-regular">m</code><code class="ds-text-special-special-12-regular">l</code>
        <code class="ds-text-special-special-12-regular">default</code>
        <InputMain size="m" :show-hint="false"/><InputMain size="l" :show-hint="false"/>
        <code class="ds-text-special-special-12-regular">left-items</code>
        <InputMain size="m" show-left-items :show-hint="false"/><InputMain size="l" show-left-items :show-hint="false"/>
        <code class="ds-text-special-special-12-regular">error + hint</code>
        <InputMain size="m" error hint="Вкажіть прізвище"/><InputMain size="l" error hint="Enter last name"/>
        <code class="ds-text-special-special-12-regular">disabled</code>
        <InputMain size="m" disabled :show-hint="false"/><InputMain size="l" disabled :show-hint="false"/>
      </div>`,
  }),
};
