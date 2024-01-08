import { Storage } from '@grc/_shared/storage';
import { useEffect, useState } from 'react';

export type ThemeInterface = 'dark' | 'light';

export interface IUseTheme {
  theme: string;
  onChangeTheme: (cb: (prevTheme: ThemeInterface) => ThemeInterface) => void;
  loadAndObserve?: () => void;
}

const THEME_KEY = 'giro-client-theme-key';
const THEME_KEY_SET = 'giro-client-storage/set';
const ls = Storage(THEME_KEY, { set: THEME_KEY_SET });

export const changeTheme = (theme: ThemeInterface = 'dark') => {
  document.documentElement.setAttribute('data-theme', theme);
  ls.set(theme);
};

export const useTheme = () => {
  const [theme, setTheme] = useState(ls.get());
  const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

  useEffect(() => {
    window.addEventListener(THEME_KEY_SET, (e: Record<string, any>) => setTheme(e.detail.state));
  }, []);

  const onChangeTheme = (cb: (prevTheme: ThemeInterface) => ThemeInterface) => {
    const newTheme = cb(theme);
    changeTheme(newTheme);
  };

  useEffect(() => {
    loadAndObserve();
  }, []);

  const loadAndObserve = () => {
    systemDarkMode.addEventListener('change', (e) => {
      const newColorScheme = e.matches ? 'dark' : 'light';
      changeTheme(newColorScheme);
    });

    if (!ls.get()) {
      if (systemDarkMode.matches) {
        return changeTheme('dark');
      }
      changeTheme('light');
    } else {
      changeTheme(ls.get());
    }
  };

  return { theme, onChangeTheme, loadAndObserve } as IUseTheme;
};
