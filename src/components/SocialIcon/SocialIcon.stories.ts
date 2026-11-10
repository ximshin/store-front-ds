import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SocialIcon from './SocialIcon.vue';

const NETWORKS = [
  'facebook', 'instagram', 'youtube', 'telegram', 'threads', 'x', 'whatsapp', 'tiktok', 'linkedin', 'discord', 'bluesky',
] as const;

/**
 * Иконка соцсети 16×16 (Figma `6209:82`) для тёмной плашки шапки и подвала. Цвет `icon/primary-white`;
 * на светлом фоне задаётся `--social-icon-color: var(--icon-strong)`.
 */
const meta = {
  title: 'Navigation/SocialIcon',
  component: SocialIcon,
  tags: ['autodocs'],
  decorators: [
    () => ({ template: '<div style="background:var(--surface-action-primary);padding:var(--space-16);display:inline-block"><story /></div>' }),
  ],
  parameters: {
    maxWidth: 120,
    docs: {
      description: {
        component:
          'Иконка соцсети 16×16 (Figma `6209:82`). Использует моно-логотипы `social-<сеть>-32` (масштаб до 16). Фон на примерах — тёмная плашка.',
      },
    },
  },
  argTypes: {
    network: { control: 'select', options: NETWORKS, description: 'Figma: Network' },
    href: { control: 'text' },
  },
  args: { network: 'facebook' },
} satisfies Meta<typeof SocialIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Facebook: Story = {};
export const Instagram: Story = { args: { network: 'instagram' } };
export const Telegram: Story = { args: { network: 'telegram' } };
export const YouTube: Story = { args: { network: 'youtube' } };

/** Все 11 сетей на тёмном фоне и на светлом (с переопределением цвета). */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  decorators: [() => ({ template: '<story />' })],
  render: () => ({
    components: { SocialIcon },
    setup: () => ({ NETWORKS }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);padding:var(--space-24)">
        <div style="background:var(--surface-action-primary);padding:var(--space-16);display:flex;gap:var(--space-16)">
          <SocialIcon v-for="n in NETWORKS" :key="n" :network="n" />
        </div>
        <div style="--social-icon-color:var(--icon-strong);display:flex;gap:var(--space-16);padding:var(--space-16)">
          <SocialIcon v-for="n in NETWORKS" :key="n" :network="n" />
        </div>
      </div>`,
  }),
};
