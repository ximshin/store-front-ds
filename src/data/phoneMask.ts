// Ukrainian phone mask «+38 (0XX) XXX-XX-XX» for a plain <input type="tel"> (Baymard: localized input masks for phone;
// review — briefs/checkout/review_baymard_checkout_mobile.md). Used by /checkout-mobile; usePhoneMask wires the events.
//
// The value keeps the formatted text (the validator `phone()` reads digits only). Behaviour:
// - focus on an empty field → «+38 (0», caret at the end; leaving with only that → the field is cleared (placeholder back);
// - typing — formatted as you go, at most 10 national digits (0XXXXXXXXX), extra digits ignored; a typed leading 0 after
//   the prefix is not doubled;
// - Backspace / Delete on a separator removes the neighbouring digit instead (otherwise nothing would change);
// - paste in any form (+380…, 380…, 0…, 67…, with spaces / brackets) replaces the whole value.

const PREFIX = '+38 (';
export const PHONE_START = `${PREFIX}0`;

/** National digits «0XXXXXXXXX» (up to 10) from any input: the formatted value, a paste, a bare number. */
export function nationalDigits(raw: string): string {
  const prefixed = raw.startsWith('+38');
  let d = (prefixed ? raw.slice(3) : raw).replace(/\D/g, '');
  if (!prefixed && d.startsWith('380')) d = d.slice(2);
  if (!d) return '';
  if (!d.startsWith('0')) d = `0${d}`;
  while (d.startsWith('00')) d = d.slice(1);
  return d.slice(0, 10);
}

/** «0671234567» → «+38 (067) 123-45-67»; partial numbers get only the separators they have reached. */
export function formatPhone(national: string): string {
  if (!national) return '';
  let s = PREFIX + national.slice(0, 3);
  if (national.length > 3) s += `) ${national.slice(3, 6)}`;
  if (national.length > 6) s += `-${national.slice(6, 8)}`;
  if (national.length > 8) s += `-${national.slice(8, 10)}`;
  return s;
}

/** Caret position right after the k-th national digit of a formatted value. */
function caretAfter(formatted: string, k: number): number {
  if (k <= 0) return Math.min(PREFIX.length, formatted.length);
  let seen = 0;
  for (let i = PREFIX.length; i < formatted.length; i++) {
    if (/\d/.test(formatted[i]) && ++seen === k) return i + 1;
  }
  return formatted.length;
}

/** Event handlers for <input type="tel">: `get` / `set` read and write the model (store field). */
export function usePhoneMask(get: () => string, set: (v: string) => void) {
  function apply(el: HTMLInputElement, value: string, caretDigits: number) {
    set(value);
    el.value = value;
    const pos = caretAfter(value, caretDigits);
    // Right away (no caret jump to the end), and once more after Vue's re-render in case it touched the value.
    el.setSelectionRange(pos, pos);
    requestAnimationFrame(() => el.setSelectionRange(pos, pos));
  }

  function onFocus(e: FocusEvent) {
    const el = e.target as HTMLInputElement;
    if (!get()) apply(el, PHONE_START, 1);
  }

  function onInput(e: Event) {
    const el = e.target as HTMLInputElement;
    const ie = e as InputEvent;
    const before = nationalDigits(get());
    let caret = el.selectionStart ?? el.value.length;
    let digits = nationalDigits(el.value);
    // Deleting a separator alone changes no digit — remove the digit next to it instead.
    if (ie.inputType?.startsWith('delete') && digits === before && before.length) {
      const k = nationalDigits(el.value.slice(0, caret)).length;
      const at = ie.inputType === 'deleteContentBackward' ? k - 1 : k;
      if (at >= 0 && at < before.length) {
        digits = before.slice(0, at) + before.slice(at + 1);
        apply(el, formatPhone(digits), at);
        return;
      }
    }
    const k = caret === el.value.length ? digits.length : nationalDigits(el.value.slice(0, caret)).length;
    apply(el, formatPhone(digits), Math.min(k, digits.length));
  }

  function onPaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text') ?? '';
    if (!/\d/.test(text)) return;
    e.preventDefault();
    const digits = nationalDigits(text);
    apply(e.target as HTMLInputElement, formatPhone(digits), digits.length);
  }

  /** Call before validating on blur: a lone «+38 (0» is treated as empty. */
  function onBlur() {
    if (nationalDigits(get()).length <= 1) set('');
  }

  return { onFocus, onInput, onPaste, onBlur };
}
