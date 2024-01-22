import React, {
  ChangeEvent,
  createRef,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface ReactInputVerificationCodeProps {
  autoFocus?: boolean;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  length?: number;
  onChange?: (data: string) => void;
  onCompleted?: (data: string) => void;
  placeholder?: string;
  type?: 'alphanumeric' | 'number';
  value?: string;
  className?: string;
}

const ReactCodeInput = ({
  autoFocus = false,
  inputProps,
  className,
  length = 6,
  onChange = () => null,
  onCompleted = () => null,
  placeholder = '',
  type = 'number',
  value: defaultValue = '',
}: ReactInputVerificationCodeProps) => {
  /**
   * generate a new array, map through it
   * and replace with the value when possible
   */
  const fillValues = (value: string) =>
    new Array(length).fill('').map((_, index) => value[index] ?? '');

  const [values, setValues] = useState(fillValues(defaultValue));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const inputsRefs = useMemo(
    () => new Array(length).fill(null).map(() => createRef<HTMLInputElement>()),
    [length]
  );

  const validate = (input: string) => {
    if (type === 'number') {
      return /^\d/.test(input);
    }

    if (type === 'alphanumeric') {
      return /^[a-zA-Z0-9]/.test(input);
    }

    return true;
  };

  const selectInputContent = (index: number) => {
    const input = inputsRefs[index].current;

    if (input) {
      requestAnimationFrame(() => {
        input.select();
      });
    }
  };

  const setValue = (value: string, index: number) => {
    const nextValues = [...values];
    nextValues[index] = value;

    setValues(nextValues);

    const stringifiedValues = nextValues.join('');
    const isCompleted = stringifiedValues.length === length;

    if (isCompleted) {
      onCompleted(stringifiedValues);
      return;
    }

    onChange(stringifiedValues);
  };

  const focusInput = useCallback(
    (index: number) => {
      const input = inputsRefs[index]?.current;

      if (input) {
        requestAnimationFrame(() => {
          input.focus();
        });
      }
    },
    [inputsRefs]
  );

  const blurInput = (index: number) => {
    const input = inputsRefs[index]?.current;

    if (input) {
      requestAnimationFrame(() => {
        input.blur();
      });
    }
  };

  const onInputFocus = (index: number) => {
    const input = inputsRefs[index]?.current;

    if (input) {
      setFocusedIndex(index);
      selectInputContent(index);
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const eventValue = event.target.value;
    event.target.style.backgroundColor = 'transparent';

    /**
     * ensure we only display 1 character in the input
     * by clearing the already setted value
     */
    const value = eventValue.replace(values[index], '');

    /**1234
     * if the value is not valid, don't go any further
     * and select the content of the input for a better UX
     */
    if (!validate(value)) {
      selectInputContent(index);
      return;
    }

    /**
     * otp code
     */
    if (value.length > 1) {
      setValues(fillValues(eventValue));

      const isCompleted = eventValue.length === length;

      if (isCompleted) {
        onCompleted(eventValue);
        blurInput(index);
        return;
      }

      return;
    }

    setValue(value, index);

    /**
     * if the input is the last of the list
     * blur it, otherwise focus the next one
     */
    if (index === length - 1) {
      blurInput(index);
      return;
    }

    focusInput(index + 1);
  };

  const onInputKeyDown = (event: any, index: number) => {
    const eventKey = event.key;
    event.target.style.backgroundColor = 'rgba(27, 28, 30, 0.1)';
    if (eventKey === 'Backspace' || eventKey === 'Delete') {
      /**
       * prevent trigger a change event
       * `onInputChange` won't be called
       */
      event.preventDefault();

      setValue('', focusedIndex);
      focusInput(index - 1);

      return;
    }

    /**
     * since the value won't change, `onInputChange` won't be called
     * only focus the next input
     */
    if (eventKey === values[index]) {
      focusInput(index + 1);
    }
  };

  const onInputPaste = (event: any, index: number) => {
    event.preventDefault();

    const pastedValue = event.clipboardData.getData('text');
    const nextValues = pastedValue.slice(0, length);

    if (!validate(nextValues)) {
      return;
    }

    setValues(fillValues(nextValues));

    const isCompleted = nextValues.length === length;

    if (isCompleted) {
      onCompleted(nextValues);
      blurInput(index);
      return;
    }

    focusInput(nextValues.length);
  };

  /**
   * autoFocus
   */
  useEffect(() => {
    if (autoFocus) {
      focusInput(0);
    }
  }, [autoFocus, focusInput, inputsRefs]);

  return (
    <div className={className}>
      {inputsRefs.map((ref, index) => (
        <input
          autoComplete="one-time-code"
          key={index}
          onChange={(event) => onInputChange(event, index)}
          onFocus={() => onInputFocus(index)}
          onKeyDown={(event) => onInputKeyDown(event, index)}
          onPaste={(event) => onInputPaste(event, index)}
          placeholder={placeholder}
          ref={ref}
          value={values[index]}
          data-testid={`${index < 5 ? '' : 'input'}`}
          {...inputProps}
        />
      ))}
    </div>
  );
};

export default ReactCodeInput;
