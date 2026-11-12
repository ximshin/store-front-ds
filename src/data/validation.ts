// Field validation for checkout forms (mock layer). Each function returns an error text or '' when valid.

export function required(value: string, message = 'Заповніть поле'): string {
  return value.trim() ? '' : message;
}

/** Ukrainian phone: +380XXXXXXXXX or 0XXXXXXXXX (spaces, brackets and dashes are ignored). */
export function phone(value: string): string {
  if (!value.trim()) return 'Вкажіть телефон';
  const digits = value.replace(/\D/g, '');
  const ok = (digits.length === 12 && digits.startsWith('380')) || (digits.length === 10 && digits.startsWith('0'));
  return ok ? '' : 'Телефон у форматі +38 (0XX) XXX-XX-XX';
}

/** Optional e-mail: empty is fine, otherwise must look like an address. */
export function email(value: string): string {
  if (!value.trim()) return '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? '' : 'Перевірте адресу пошти';
}

export function maxLength(value: string, max: number): string {
  return value.length > max ? `Не більше ${max} символів` : '';
}
