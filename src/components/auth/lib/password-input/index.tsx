import { useState } from 'react';
import { Input } from 'antd';
import zxcvbn from 'zxcvbn';
import {
  PasswordStrengthIndicator,
  defaultSettings,
} from '@grc/_shared/components/password-strength-indicator';
import { PasswordInputProps } from '@grc/_shared/components/password-strength-indicator/type';

const PasswordInput = (props: PasswordInputProps) => {
  const { onChange, settings = defaultSettings } = props;
  const [level, setLevel] = useState(-1);

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const score = value.length === 0 ? -1 : zxcvbn(value).score;
    setLevel(score);

    if (onChange) onChange(e);
  };

  const handlePaste = (event: any) => {
    event.preventDefault();
    return false;
  };

  return (
    <div>
      <Input.Password
        onChange={onChangePassword}
        placeholder={'Enter password'}
        className="h-14"
        onPaste={handlePaste}
      />
      {level > -1 && (
        <div className="mt-2.5">
          <PasswordStrengthIndicator level={level} settings={settings} />
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
