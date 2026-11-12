// Showcase gallery registry (directive_vue_base, Phase 4). Shared file — edited only by the main session.
// One entry per component: name as in Figma, the component, and the variants (props) to render side by side.
import type { Component } from 'vue';
import ButtonFront from '../components/ButtonFront/ButtonFront.vue';
import IconButton from '../components/IconButton/IconButton.vue';
import MediaIconButton from '../components/MediaIconButton/MediaIconButton.vue';
import SocialLoginButton from '../components/SocialLoginButton/SocialLoginButton.vue';
import InputMain from '../components/InputMain/InputMain.vue';
import Input from '../components/Input/Input.vue';
import Select from '../components/Select/Select.vue';
import SearchBar from '../components/SearchBar/SearchBar.vue';
import Counter from '../components/Counter/Counter.vue';
import Price from '../components/Price/Price.vue';
import Tabs from '../components/Tabs/Tabs.vue';
import TabItem from '../components/TabItem/TabItem.vue';
import InfoTag from '../components/InfoTag/InfoTag.vue';
import GiftTag from '../components/GiftTag/GiftTag.vue';
import PromoChip from '../components/PromoChip/PromoChip.vue';
import DiscountLine from '../components/DiscountLine/DiscountLine.vue';
import DiscountLabel from '../components/DiscountLabel/DiscountLabel.vue';
import Warning from '../components/Warning/Warning.vue';
import Tooltip from '../components/Tooltip/Tooltip.vue';
import Checkbox from '../components/Checkbox/Checkbox.vue';
import Radio from '../components/Radio/Radio.vue';
import DropdownListItem from '../components/DropdownListItem/DropdownListItem.vue';
import DropdownList from '../components/DropdownList/DropdownList.vue';
import ChoiceCard from '../components/ChoiceCard/ChoiceCard.vue';
import SectionTitle from '../components/SectionTitle/SectionTitle.vue';
import PopupTitle from '../components/PopupTitle/PopupTitle.vue';
import Modal from '../components/Modal/Modal.vue';
import LoginForm from '../components/LoginForm/LoginForm.vue';
import Toast from '../components/Toast/Toast.vue';
import EmptyState from '../components/EmptyState/EmptyState.vue';
import Skeleton from '../components/Skeleton/Skeleton.vue';
import SkeletonProductCard from '../components/SkeletonProductCard/SkeletonProductCard.vue';
import Logo from '../components/Logo/Logo.vue';
import NavItem from '../components/NavItem/NavItem.vue';
import HeaderAction from '../components/HeaderAction/HeaderAction.vue';
import CartButton from '../components/CartButton/CartButton.vue';

import CheckoutHeader from '../components/CheckoutHeader/CheckoutHeader.vue';
import Header from '../components/Header/Header.vue';
import Footer from '../components/Footer/Footer.vue';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs.vue';
import Coupon from '../components/Coupon/Coupon.vue';
import CartItem from '../components/CartItem/CartItem.vue';
import OrderItem from '../components/OrderItem/OrderItem.vue';
import RecommendedItem from '../components/RecommendedItem/RecommendedItem.vue';
import OrderSummary from '../components/OrderSummary/OrderSummary.vue';
import CheckoutConfirm from '../components/CheckoutConfirm/CheckoutConfirm.vue';
import FreeShippingProgress from '../components/FreeShippingProgress/FreeShippingProgress.vue';
import CountryItem from '../components/CountryItem/CountryItem.vue';
import TimeSlot from '../components/TimeSlot/TimeSlot.vue';
import DeliveryDay from '../components/DeliveryDay/DeliveryDay.vue';
import AddressCard from '../components/AddressCard/AddressCard.vue';

export interface GalleryItem {
  name: string;
  component: Component;
  variants: Record<string, unknown>[];
}

export const gallery: { page: string; items: GalleryItem[] }[] = [
  {
    page: 'Actions',
    items: [
      {
        name: 'button-front',
        component: ButtonFront,
        variants: (['primary', 'default', 'destructive', 'delete', 'flat', 'dropdown'] as const).map((type) => ({
          type,
          size: 'l',
          label: 'Оформити замовлення',
          showLeftIcon: false,
          showRightIcon: type === 'dropdown',
        })),
      },
      { name: 'IconButton', component: IconButton, variants: [{ icon: 'menu-24' }, { icon: 'cart-24' }, { icon: 'delete-16' }] },
      { name: 'MediaIconButton', component: MediaIconButton, variants: [{ shape: 'rounded' }, { shape: 'square' }, { shape: 'square', flip: true }] },
      { name: 'SocialLoginButton', component: SocialLoginButton, variants: [{ network: 'google' }, { network: 'facebook' }, { network: 'apple' }] },
    ],
  },
  {
    page: 'Forms',
    items: [
      { name: 'input-main', component: InputMain, variants: [{ showLeftItems: true }] },
      { name: 'Input', component: Input, variants: [{ label: 'Прізвище', modelValue: 'Шевченко' }, { label: 'Телефон', modelValue: '+38 (066) 123-45-67', size: 'l' }, { label: 'Е-пошта', modelValue: 'poshta', error: true, hint: 'Невірний формат' }] },
      { name: 'Select', component: Select, variants: [{ label: 'Місто', modelValue: 'Київ' }, { showLabel: false, placeholder: 'Оберіть відділення', size: 'l' }] },
      { name: 'search-bar', component: SearchBar, variants: [{ height: 'm', iconSize: 'm' }] },
      { name: 'counter', component: Counter, variants: [{ showUnits: true, modelValue: 2 }] },
      { name: 'Checkbox', component: Checkbox, variants: [{ size: 'm', label: 'Nike', counter: 12 }, { size: 'm', label: 'Adidas', checked: true }, { size: 'm', label: 'Puma', indeterminate: true }, { size: 'm', label: 'Reebok', disabled: true }] },
      { name: 'Radio', component: Radio, variants: [{ label: 'Нова пошта' }, { label: 'Укрпошта', checked: true }, { label: 'Самовивіз', disabled: true }] },
      { name: 'dropdown-list-item', component: DropdownListItem, variants: [{ label: 'Редагувати' }, { label: 'Обране', hovered: true }, { label: 'Видалити', destructive: true }] },
      { name: 'ChoiceCard', component: ChoiceCard, variants: [{}, { selected: true }, { disabled: true }, { selected: true, showParams: true }, { layout: 'row' }, { layout: 'row', selected: true }, { layout: 'row', disabled: true }] },
      { name: 'SectionTitle', component: SectionTitle, variants: [{ size: 's' }, { size: 'm' }, { size: 'l' }, { size: 'm', showAction: false }] },
      { name: 'dropdown-list', component: DropdownList, variants: [{ items: ['за популярністю', 'спочатку дешевше', 'спочатку дорожче'], modelValue: 'за популярністю' }] },
    ],
  },
  {
    page: 'Navigation',
    items: [
      { name: 'Logo', component: Logo, variants: [{}, { size: 'mobile' }] },
      { name: 'NavItem', component: NavItem, variants: [{ label: 'Каталог' }, { showArrow: true, label: 'Ще' }] },
      { name: 'HeaderAction', component: HeaderAction, variants: [{}, { size: 's', icon: 'heart-24', label: 'Бажання' }] },
      { name: 'CartButton', component: CartButton, variants: [{}, { showPrice: false }] },
      { name: 'CheckoutHeader', component: CheckoutHeader, variants: [{ showCallback: true }] },
      { name: 'Header', component: Header, variants: [{ device: 'desktop' }, { device: 'mobile' }] },
      { name: 'Footer', component: Footer, variants: [{ device: 'desktop' }] },
      { name: 'Breadcrumbs', component: Breadcrumbs, variants: [{ size: '13' }] },
    ],
  },
  {
    page: 'Catalog · Product',
    items: [
      { name: 'Price', component: Price, variants: [{ size: 's' }, { size: 'm', state: 'sale' }, { size: 'l' }] },
      { name: 'TabItem', component: TabItem, variants: [{ label: 'Опис' }, { label: 'Характеристики', active: true }] },
      { name: 'Tabs', component: Tabs, variants: [{ items: [{ label: 'Звичайне', value: 'full' }, { label: 'Швидке', value: 'quick' }], modelValue: 'full', divider: false, gap: 'var(--space-24)' }] },
    ],
  },
  {
    page: 'Cart & Checkout',
    items: [
      { name: 'InfoTag', component: InfoTag, variants: [{}] },
      { name: 'GiftTag', component: GiftTag, variants: [{ type: 'outline' }, { type: 'filled' }] },
      { name: 'PromoChip', component: PromoChip, variants: [{}] },
      { name: 'DiscountLine', component: DiscountLine, variants: [{}] },
      { name: 'DiscountLabel', component: DiscountLabel, variants: [{}, { showIcon: false }] },
      { name: 'Coupon', component: Coupon, variants: [{ state: 'collapsed' }, { state: 'empty' }, { state: 'applied' }, { state: 'error', modelValue: 'Smart10' }] },
      { name: 'OrderSummary', component: OrderSummary, variants: [{}, { showTitle: false, showDiscount: false, showDivider: false, showButton: false }] },
      { name: 'CheckoutConfirm', component: CheckoutConfirm, variants: [{}] },
      { name: 'FreeShippingProgress', component: FreeShippingProgress, variants: [{ progress: 70 }] },
      { name: 'CountryItem', component: CountryItem, variants: [{}, { label: 'Польща', flag: '🇵🇱' }] },
      { name: 'TimeSlot', component: TimeSlot, variants: [{}, { active: true }] },
      { name: 'DeliveryDay', component: DeliveryDay, variants: [{}] },
      { name: 'CartItem', component: CartItem, variants: [{ type: 'product', size: 'default' }, { type: 'product', size: 'compact', showWholesale: true }, { type: 'product', size: 'compact', showGift: true }, { type: 'bundle', size: 'compact', items: [{ title: 'Футболка Basic', oldPrice: '999 грн', price: '799 грн' }, { title: 'Навушники Apple AirPods Max', oldPrice: '30 299 грн', price: '20 899 грн' }], oldSum: '31 298 грн', sum: '21 698 грн' }] },
      { name: 'OrderItem', component: OrderItem, variants: [{}, { title: 'Футболка Basic', quantity: 2 }] },
      { name: 'RecommendedItem', component: RecommendedItem, variants: [{}, { title: 'Навушники Apple AirPods Max' }] },
      { name: 'AddressCard', component: AddressCard, variants: [{ state: 'normal' }, { state: 'active' }, { state: 'popup' }] },
    ],
  },
  {
    page: 'Overlays & Feedback',
    items: [
      { name: 'warning', component: Warning, variants: [{ type: 'warning' }, { type: 'info' }, { type: 'danger' }, { type: 'success' }] },
      { name: 'PopupTitle', component: PopupTitle, variants: [{}, { showCounter: true, title: 'Кошик', showDescription: false }] },
      { name: 'Modal', component: Modal, variants: [{ size: 's', title: 'Вхід', showFooter: false }] },
      { name: 'LoginForm', component: LoginForm, variants: [{ email: 'customer@poshta.com', password: 'password1234' }] },
      { name: 'Toast', component: Toast, variants: [{ type: 'success' }, { type: 'error' }, { type: 'info' }] },
      { name: 'EmptyState', component: EmptyState, variants: [{ type: 'cart' }, { type: 'search' }] },
      { name: 'Skeleton', component: Skeleton, variants: [{ shape: 'text' }, { shape: 'rect' }, { shape: 'circle' }] },
      { name: 'SkeletonProductCard', component: SkeletonProductCard, variants: [{ state: 'default' }, { state: 'compact' }] },
      { name: 'tooltip', component: Tooltip, variants: [{ arrowPosition: 'bottom' }, { arrowPosition: 'top' }] },
    ],
  },
];
