import React, { createContext, useContext, useState, useCallback } from 'react';

export type Theme = {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    accent: string;
    muted: string;
  };
};

const light: Theme = {
  mode: 'light',
  colors: {
    background: '#FFFFFF',
    card: '#F7F9FC',
    text: '#111827',
    subtext: '#6B7280',
    border: 'rgba(0,0,0,0.06)',
    accent: '#0099ff',
    muted: '#888',
  },
};

const dark: Theme = {
  mode: 'dark',
  colors: {
    background: '#0d0d0d',
    card: '#181818',
    text: '#fff',
    subtext: '#cfd8dc',
    border: 'rgba(79,209,255,0.18)',
    accent: '#4fd1ff',
    muted: '#777',
  },
};

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setMode: (mode: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: light,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMode: () => {},
});

export const ThemeProvider: React.FC<{
  initial?: 'light' | 'dark';
  children: React.ReactNode;
}> = ({ initial = 'light', children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(initial);

  const setModeFn = useCallback((m: 'light' | 'dark') => setMode(m), []);

  const toggleTheme = useCallback(
    () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
    [],
  );

  const value: ThemeContextValue = {
    theme: mode === 'light' ? light : dark,
    toggleTheme,
    setMode: setModeFn,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext).theme;
export const useToggleTheme = () => useContext(ThemeContext).toggleTheme;

export default ThemeContext;
