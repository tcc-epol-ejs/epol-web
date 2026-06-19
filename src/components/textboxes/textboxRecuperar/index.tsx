import type { ChangeEvent } from 'react';

type TextboxProps = {
  type?: 'email';
  children?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  bgColor?: string;
  textColor?: string;
  className?: string;
};

export default function Textbox({
  type = 'email',
  children,
  placeholder = '',
  value,
  onChange,
  bgColor = '#a9a9f6',
  textColor = '#1f2a52',
  className = '',
}: TextboxProps) {
  const placeholderText = children ?? placeholder;

  return (
    <input
      type={type}
      placeholder={placeholderText}
      value={value}
      onChange={onChange}
      className={`w-[320px] h-[50px] rounded-full border border-[#a9a9f6] bg-[#a9a9f6] px-5 py-4 text-base placeholder:text-[#5A5A70] text-[#1f2a52] outline-none ${className}`.trim()}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: '1px solid #a9a9f6',
      }}
    />
  );
}
