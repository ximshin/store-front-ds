import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, Transition } from 'vue';
import Toast from './Toast.vue';

const TYPES = ['success', 'error', 'info'] as const;

/**
 * Всплывающее уведомление (Figma `6256:205`): тёмная плашка с иконкой статуса, текстом, действием и закрытием.
 * Ширина 400, на мобайле — Fill с отступами 16 внизу экрана.
 */
const meta = {
  title: 'Overlays & Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 400,
    docs: {
      description: {
        component:
          'Toast (Figma `6256:205`). Figma: Type → `type` (success / error / info), Action → `action`, Show action? → `showAction`, Show close? → `showClose`. Текст — prop `message` или слот по умолчанию; без него показывается пример по типу.',
      },
    },
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES, description: 'Figma: Type' },
    message: { control: 'text', description: 'Текст сообщения (по умолчанию — пример по типу)' },
    action: { control: 'text', description: 'Figma: Action' },
    showAction: { control: 'boolean', description: 'Figma: Show action?' },
    showClose: { control: 'boolean', description: 'Figma: Show close?' },
    closeLabel: { control: 'text', description: 'Доступное имя кнопки закрытия' },
  },
  args: { type: 'success', action: 'Перейти', showAction: true, showClose: true },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {};
export const Error: Story = { args: { type: 'error' } };
export const Info: Story = { args: { type: 'info' } };
export const NoAction: Story = { args: { showAction: false } };
export const NoClose: Story = { args: { showClose: false } };

export const English: Story = { args: { message: 'Item added to cart', action: 'View' } };

/** Длинный текст переносится, действие и закрытие остаются справа. */
export const LongText: Story = {
  args: {
    type: 'error',
    message: 'Не вдалося оформити доставку Новою поштою до відділення №Ґ-12 в місті Їжакевичі. Спробуйте ще раз',
  },
};

/** Все Type × (с действием / без / без закрытия). */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Toast },
    setup: () => ({ TYPES }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,400px);gap:var(--space-24);padding:var(--space-24)">
        <template v-for="t in TYPES" :key="t">
          <Toast :type="t" />
          <Toast :type="t" :show-action="false" />
          <Toast :type="t" :show-close="false" />
        </template>
      </div>`,
  }),
};

const VERY_LONG =
  'Не вдалося оформити доставку Новою поштою до відділення №Ґ-12 у місті Їжакевичі, Івано-Франківська область: відділення тимчасово не приймає посилки понад 30 кг. Оберіть інше відділення або кур’єра і спробуйте ще раз';

/** Дуже довге повідомлення переноситься на кілька рядків; дія та закриття лишаються справа й не стискаються. */
export const VeryLongMessage: Story = {
  args: { type: 'info', message: VERY_LONG },
};

/** Дуже довге повідомлення без дії та закриття. */
export const VeryLongMessageBare: Story = {
  args: { type: 'success', message: VERY_LONG, showAction: false, showClose: false },
};

/** Усі типи з дією та закриттям (uk). */
export const AllTypesWithActionAndClose: Story = {
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Toast },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);padding:var(--space-24);width:448px">
        <Toast type="success" message="Товар додано в кошик" action="Перейти" />
        <Toast type="error" message="Не вдалося додати товар. Спробуйте ще раз" action="Повторити" />
        <Toast type="info" message="Ціну оновлено" action="Переглянути" />
      </div>`,
  }),
};

/** Стек із трьох тостів: вертикальний відступ `space/8`, ширина 400. */
export const Stack: Story = {
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Toast },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-8);padding:var(--space-24);width:448px">
        <Toast type="success" message="Товар додано в кошик" action="Перейти" />
        <Toast type="info" message="Ціну оновлено" action="Переглянути" />
        <Toast type="error" message="Не вдалося застосувати промокод SMART-10. Перевірте код і спробуйте ще раз" action="Повторити" />
      </div>`,
  }),
};

/**
 * Демо анімації появи / зникнення: `Toast` сам не анімується, тому у story він обгорнутий в `<Transition>`
 * з Web Animations API (translateY 16px + fade, 0.2s ease; при `prefers-reduced-motion` — без анімації).
 */
export const AppearDisappearAnimation: Story = {
  name: 'Анімація появи / зникнення',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Toast, Transition },
    setup: () => {
      const visible = ref(false);
      const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const run = (el: Element, from: Keyframe, to: Keyframe, done: () => void) => {
        if (reduce()) return done();
        el.animate([from, to], { duration: 200, easing: 'ease', fill: 'both' }).onfinish = done;
      };
      const enter = (el: Element, done: () => void) =>
        run(el, { opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }, done);
      const leave = (el: Element, done: () => void) =>
        run(el, { opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(16px)' }, done);
      return { visible, enter, leave };
    },
    template: `
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:var(--space-16);padding:var(--space-24);min-height:200px">
        <button type="button" class="ds-text-special-special-14-medium" @click="visible = !visible">{{ visible ? 'Сховати' : 'Показати' }} тост</button>
        <Transition :css="false" @enter="enter" @leave="leave">
          <Toast v-if="visible" type="success" @close="visible = false" />
        </Transition>
      </div>`,
  }),
};
