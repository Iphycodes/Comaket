import { createContext, ReactNode } from 'react';
import { IUseTheme, useTheme } from '@grc/hooks/useTheme';

type AppProviderPropType = {
  children: ReactNode;
};

interface AppContextPropType extends IUseTheme {
  handleLogOut: () => void;
}

export const AppContext = createContext<AppContextPropType>({
  handleLogOut: () => {},
  onChangeTheme: () => {},
  theme: '',
});

export const AppProvider = (props: AppProviderPropType) => {
  const { children } = props;
  const { theme, onChangeTheme } = useTheme();

  const values: any = {
    theme,
    onChangeTheme,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
