import { InputProps } from 'antd/lib/input';

export interface PasswordInputProps extends InputProps {
  settings?: PasswordInputSettings;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps?: InputProps;
}

export interface ColorScheme {
  levels: string[];
  noLevel: string;
}

export interface PasswordInputSettings {
  colorScheme: ColorScheme;
  height: number;
  alwaysVisible: boolean;
}

export interface PasswordStrengthIndicatorProps {
  level: number;
  settings: PasswordInputSettings;
}
