import type { ChangeEvent } from 'react';

type SelectProps = {
  children?: string;
  placeholder?: string;
  options: string[];
  value?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  bgColor?: string;
  textColor?: string;
  className?: string;
};

export default function Select({
  children,
  placeholder = '',
  options,
  value,
  onChange,
  bgColor = '#e3e3fc',
  textColor = '#1f2a52',
  className = '',
}: SelectProps) {
  const placeholderText = children ?? placeholder;

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        className={`w-full rounded-full border border-[#a9a9f6] bg-[#a9a9f6] px-4 py-2.5 font-medium text-sm text-[#1f2a52] outline-none transition-all duration-300 focus:brightness-[1.2] ${className}`.trim()}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: '1px solid #a9a9f6',
        }}
      >
        {placeholderText && (
          <option value="" disabled hidden>
            {placeholderText}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
