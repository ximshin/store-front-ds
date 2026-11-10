import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Modal from './Modal.vue';
import ModalContent from './ModalContent.vue';
import LoginForm from '../LoginForm/LoginForm.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';

const SIZES = ['s', 'm', 'l'] as const;

/**
 * Попап витрины (Figma `6220:278`, плейсхолдер содержимого — `ModalContent` `6220:207`). Size S 480 / M 560 / L 960,
 * отступы 16 / 20 / 20, radius/16, тень `DS/Shadow/l`. Содержимое — слот по умолчанию, подвал — слот `footer`.
 * Без Teleport: попап рисуется на месте; затемнение — prop `overlay`.
 */
const meta = {
  title: 'Overlays & Feedback/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 960,
    docs: {
      description: {
        component:
          'Попап витрины (Figma `6220:278`). Figma: Size → `size` (s 480 / m 560 / l 960), Title → `title`, Show footer? → `showFooter`, Content (swap) → слот по умолчанию (плейсхолдер `ModalContent`). Показ — `v-model:open`; `overlay` добавляет затемнение `surface/overlay` (position: fixed). Заголовок — `DS/Heading/H2`.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES, description: 'Figma: Size (s=480, m=560, l=960)' },
    title: { control: 'text', description: 'Figma: Title' },
    showFooter: { control: 'boolean', description: 'Figma: Show footer?' },
    open: { control: 'boolean', description: 'Показан ли попап (v-model:open)' },
    overlay: { control: 'boolean', description: 'Затемнение surface/overlay под попапом' },
    cancelLabel: { control: 'text' },
    confirmLabel: { control: 'text' },
    closeLabel: { control: 'text' },
  },
  args: { size: 's', title: 'Кошик', showFooter: true, open: true, overlay: false },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SizeS: Story = { name: 'Size S', parameters: { maxWidth: 480 } };
export const SizeM: Story = { name: 'Size M', args: { size: 'm' }, parameters: { maxWidth: 560 } };
export const SizeL: Story = { name: 'Size L', args: { size: 'l' } };

/** Без подвала. */
export const NoFooter: Story = { args: { showFooter: false, title: 'Промокод' }, parameters: { maxWidth: 480 } };

/** Вход: Size M, Content = LoginForm, без подвала (экран Login — Modal). */
export const Login: Story = {
  args: { size: 'm', title: 'Вхід', showFooter: false },
  parameters: { maxWidth: 560 },
  render: (args) => ({
    components: { Modal, LoginForm },
    setup: () => ({ args }),
    template: '<Modal v-bind="args"><LoginForm email="customer@poshta.com" password="password1234" /></Modal>',
  }),
};

/** Свой подвал и текст на английском. */
export const English: Story = {
  args: { title: 'Promo code', cancelLabel: 'Cancel', confirmLabel: 'Apply' },
  parameters: { maxWidth: 480 },
  render: (args) => ({
    components: { Modal, ModalContent },
    setup: () => ({ args }),
    template: '<Modal v-bind="args"><ModalContent>Enter your promo code</ModalContent></Modal>',
  }),
};

/** Длинный заголовок с Ґ Є І Ї. */
export const LongTitle: Story = {
  args: { title: 'Ґарантійний ремонт і повернення товарів Нової пошти', size: 's' },
  parameters: { maxWidth: 480 },
};

/** Управляемый показ: v-model:open + затемнение (overlay) внутри контейнера. */
export const WithOverlay: Story = {
  name: 'С затемнением (v-model)',
  parameters: { fullWidth: true, controls: { disable: true } },
  render: () => ({
    components: { Modal, ButtonFront },
    setup: () => ({ open: ref(true) }),
    template: `
      <div style="position:relative;transform:translateZ(0);height:480px;background:var(--surface-default);overflow:hidden">
        <div style="padding:var(--space-24)"><ButtonFront label="Відкрити кошик" @click="open = true" /></div>
        <Modal v-model:open="open" overlay size="s" title="Кошик" confirm-label="Оформити" />
      </div>`,
  }),
};

/** Все размеры. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Modal },
    template: `
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:var(--space-24);padding:var(--space-24);background:var(--surface-overlay)">
        <Modal size="s" />
        <Modal size="m" />
        <Modal size="l" />
        <Modal size="s" :show-footer="false" title="Без подвала" />
      </div>`,
  }),
};

const LONG_PARAGRAPHS = Array.from(
  { length: 14 },
  (_, i) =>
    `${i + 1}. Умови доставки та повернення: Ґарантійний термін, Єдиний тариф, Інтернет-замовлення та Їжа з доставкою Новою поштою. Товар можна повернути протягом 14 днів з моменту отримання за умови збереження товарного вигляду.`,
);

/**
 * Довгий вміст: вікно не вище екрана (max-height), тіло прокручується, заголовок і підвал лишаються видимими.
 */
export const LongScrollingContent: Story = {
  args: { size: 'm', title: 'Умови доставки та повернення' },
  parameters: { maxWidth: 560 },
  render: (args) => ({
    components: { Modal },
    setup: () => ({ args, paragraphs: LONG_PARAGRAPHS }),
    template: `
      <Modal v-bind="args">
        <div class="ds-text-paragraph-p1" style="display:flex;flex-direction:column;gap:var(--space-12)">
          <p v-for="p in paragraphs" :key="p" style="margin:0">{{ p }}</p>
        </div>
      </Modal>`,
  }),
};

/** Усі три розміри з підвалом (S 480 / M 560 / L 960), кнопки uk. */
export const SizesWithFooter: Story = {
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Modal },
    template: `
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:var(--space-24);padding:var(--space-24)">
        <Modal size="s" title="Промокод" confirm-label="Застосувати" />
        <Modal size="m" title="Швидке замовлення" confirm-label="Замовити" />
        <Modal size="l" title="Кошик" confirm-label="Оформити замовлення" />
      </div>`,
  }),
};

/** Усі три розміри без підвалу. */
export const SizesWithoutFooter: Story = {
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Modal },
    template: `
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:var(--space-24);padding:var(--space-24)">
        <Modal size="s" :show-footer="false" title="Size S" />
        <Modal size="m" :show-footer="false" title="Size M" />
        <Modal size="l" :show-footer="false" title="Size L" />
      </div>`,
  }),
};

/** Демо анімації: кнопка перемикає `open` — fade + scale (0.2s ease), `prefers-reduced-motion` вимикає перехід. */
export const OpenCloseAnimation: Story = {
  name: 'Анімація відкриття / закриття',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Modal, ButtonFront },
    setup: () => ({ open: ref(false) }),
    template: `
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:var(--space-16);padding:var(--space-24);min-height:400px;background:var(--surface-hover)">
        <ButtonFront :label="open ? 'Закрити' : 'Відкрити'" @click="open = !open" />
        <Modal v-model:open="open" size="s" title="Промокод" confirm-label="Застосувати" />
      </div>`,
  }),
};

/** Режим overlay з розміром M і довгим текстом: затемнення на весь контейнер, закриття хрестиком або «Скасувати». */
export const OverlayMode: Story = {
  name: 'Overlay',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Modal, ButtonFront },
    setup: () => ({ open: ref(true), paragraphs: LONG_PARAGRAPHS.slice(0, 2) }),
    template: `
      <div style="position:relative;transform:translateZ(0);width:720px;max-width:100%;height:640px;background:var(--surface-default);overflow:hidden">
        <div style="padding:var(--space-24)"><ButtonFront label="Відкрити умови" @click="open = true" /></div>
        <Modal v-model:open="open" overlay size="m" title="Умови доставки" confirm-label="Погоджуюсь">
          <div class="ds-text-paragraph-p1" style="display:flex;flex-direction:column;gap:var(--space-12)">
            <p v-for="p in paragraphs" :key="p" style="margin:0">{{ p }}</p>
          </div>
        </Modal>
      </div>`,
  }),
};
