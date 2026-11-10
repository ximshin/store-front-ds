import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Footer from './Footer.vue';

/**
 * Підвал вітрини (Figma `6221:356`). **Desktop** 1280 — колонки: бренд, «Покупцям», «Інформація», соцмережі;
 * **Mobile** 430 — стек. Фон `surface/action/primary`.
 */
const meta = {
  title: 'Navigation/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 1280,
    docs: {
      description: {
        component:
          'Подвал витрины (Figma `6221:356`): Logo, HeaderAction S Dark (контакты), заголовки `DS/Heading/Group Title` + NavItem Dark, SocialIcon, нижняя строка с разделителем `border/on-media`.',
      },
    },
  },
  argTypes: {
    device: { control: 'inline-radio', options: ['desktop', 'mobile'], description: 'Figma: Device' },
    column1Title: { control: 'text', description: 'Figma: Column 1 title' },
    column2Title: { control: 'text', description: 'Figma: Column 2 title' },
    socialTitle: { control: 'text', description: 'Figma: Social title' },
    copyright: { control: 'text', description: 'Figma: Copyright' },
    credit: { control: 'text', description: 'Figma: Credit' },
    phone: { control: 'text' },
    schedule: { control: 'text' },
    column1Links: { control: 'object' },
    column2Links: { control: 'object' },
    socials: { control: 'object' },
  },
  args: { device: 'desktop' },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

/** Мобильный подвал 430. */
export const Mobile: Story = { args: { device: 'mobile' }, parameters: { maxWidth: 430 } };

export const English: Story = {
  args: {
    column1Title: 'Customers',
    column2Title: 'Information',
    socialTitle: 'Follow us',
    copyright: '© 2026 Store. All rights reserved',
    credit: 'Powered by Horoshop',
    schedule: 'Mon–Fri 9:00–18:00',
    column1Links: ['Delivery & payment', 'Returns', 'Warranty', 'FAQ'],
    column2Links: ['About us', 'Contacts', 'Blog', 'Terms of use'],
  },
};

/** Desktop и Mobile. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Footer },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-24);padding:var(--space-24)">
        <Footer device="desktop" />
        <div style="width:430px;max-width:100%"><Footer device="mobile" /></div>
      </div>`,
  }),
};
