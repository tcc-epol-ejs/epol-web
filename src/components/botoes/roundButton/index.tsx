interface RoundButtonProps {
  onClick: () => void;
  ariaLabel: string;
  variant?: 'default' | 'small' | 'accent';
  children: React.ReactNode;
}

function RoundButton({
  onClick,
  ariaLabel,
  variant = 'default',
  children,
}: RoundButtonProps) {
  const base =
    'rounded-full border-none flex items-center justify-center cursor-pointer transition-transform duration-150';

  const variantClass =
    variant === 'accent'
      ? 'w-[52px] h-[52px] bg-[#2E2A47] text-white shadow-[0_5px_0_#16142a] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#16142a]'
      : variant === 'small'
        ? 'w-[42px] h-[42px] self-center bg-[#FFE1B0] text-[#7A4A00] shadow-[0_4px_0_#E8B87A] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#E8B87A]'
        : 'w-[52px] h-[52px] bg-[#FFE1B0] text-[#7A4A00] shadow-[0_5px_0_#E8B87A] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#E8B87A]';

  return (
    <button
      className={`${base} ${variantClass}`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default RoundButton;
