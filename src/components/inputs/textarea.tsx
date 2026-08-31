import { ChangeEvent } from 'react';

type TextareaProps = {
  children?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  bgColor?: string;
  textColor?: string;
  className?: string;
};

export default function Textarea({
  children,
  placeholder = '',
  value,
  onChange,
  bgColor = '#a9a9f6',
  textColor = '#1f2a52',
  className = '',
}: TextareaProps) {
  const placeholderText = children ?? placeholder;

  return (
    <div className="relative w-full">
      <textarea
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        className={`w-full rounded-[20px] border border-[#a9a9f6] bg-[#a9a9f6] px-4 py-3 font-medium text-sm placeholder:text-[#5A5A70] text-[#1f2a52] outline-none transition-all duration-300 focus:brightness-[1.2] resize-y ${className}`.trim()}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: '1px solid #a9a9f6',
          minHeight: '120px',
        }}
      />
    </div>
  );
}
