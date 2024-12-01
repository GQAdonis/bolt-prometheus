import { atom } from 'nanostores';

type Theme = 'dark' | 'light' | 'system';

function initStore() {
  const store = atom<Theme>('system');

  // Only access localStorage in the browser
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bolt_theme') as Theme | null;
    if (stored) {
      store.set(stored);
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      store.set(systemTheme);
    }

    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (store.get() === 'system') {
        store.set(e.matches ? 'dark' : 'light');
      }
    });
  }

  return store;
}

export const themeStore = initStore();
