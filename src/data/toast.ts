// Toast notifications store (mock layer). Rendered by src/components-free host in App.vue (ToastHost).
import { reactive } from 'vue';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  type: ToastKind;
  message: string;
}

export const toasts = reactive<ToastItem[]>([]);
let nextId = 1;

export function showToast(type: ToastKind, message: string, timeout = 3500): void {
  const id = nextId++;
  toasts.push({ id, type, message });
  setTimeout(() => closeToast(id), timeout);
}

export function closeToast(id: number): void {
  const i = toasts.findIndex((t) => t.id === id);
  if (i >= 0) toasts.splice(i, 1);
}
