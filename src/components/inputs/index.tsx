import { useState } from 'react';
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  HTMLInputTypeAttribute,
} from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type TextboxProps = Pick<
  ComponentPropsWithoutRef<'input'>,
  'aria-label' | 'autoComplete' | 'inputMode'
> & {
  type?: HTMLInputTypeAttribute;
  children?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  bgColor?: string;
  textColor?: string;
  className?: string;
  showToggle?: boolean;
};

export default function Textbox({
  type = 'text',
  children,
  placeholder = '',
  value,
  onChange,
  bgColor = '#a9a9f6',
  textColor = '#1f2a52',
  className = '',
  showToggle = false,
  ...inputProps
}: TextboxProps) {
  const [visible, setVisible] = useState(false);
  const placeholderText = children ?? placeholder;
  const inputType = showToggle ? (visible ? 'text' : 'password') : type;

  return (
    <div className="relative w-full">
      <input
        {...inputProps}
        type={inputType}
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        className={`w-full rounded-full border border-[#a9a9f6] bg-[#a9a9f6] px-4 py-2.5 font-medium text-sm placeholder:text-[#5A5A70] text-[#1f2a52] outline-none transition-all duration-300 focus:brightness-[1.2] ${showToggle ? 'pr-12' : ''} ${className}`.trim()}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: '1px solid #a9a9f6',
        }}
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-full text-[#2a2a72]"
        >
          {visible ? FaEyeSlash({ size: 16 }) : FaEye({ size: 16 })}
        </button>
      )}
    </div>
  );
}
