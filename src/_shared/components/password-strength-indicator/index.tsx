import { PasswordInputSettings, PasswordStrengthIndicatorProps } from './type';

export const defaultSettings: PasswordInputSettings = {
  colorScheme: {
    levels: ['#ff4033', '#fe940d', '#ffd908', '#cbe11d', '#6ecc3a'],
    noLevel: 'lightgrey',
  },
  height: 3,
  alwaysVisible: false,
};

function getWrapperStyle(height: number) {
  return {
    lineHeight: `${height}px`,
  };
}

function getIndicatorStyle(color: string, height: number) {
  return {
    display: 'inline-block',
    width: '20%',
    backgroundColor: color,
    height: `${height}px`,
    borderRadius: '2px',
  };
}

export const PasswordStrengthIndicator = ({ level, settings }: PasswordStrengthIndicatorProps) => {
  if (!settings?.alwaysVisible && level < 0) {
    return null;
  }

  const indicators = [];

  for (let i = 0; i < 5; i++) {
    const color =
      i <= level ? settings?.colorScheme?.levels[level] : settings?.colorScheme?.noLevel;
    indicators.push(
      <div key={`indicator-${i}`} style={getIndicatorStyle(color, settings?.height)} />
    );
  }

  return <div style={getWrapperStyle(settings?.height)}>{indicators}</div>;
};
