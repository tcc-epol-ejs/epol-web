interface BotaoConfirmarProps {
  children: React.ReactNode;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

export default function BotaoConfirmar({
  children,
  textColor = '#ffffff',
  onClick,
  className = '',
}: BotaoConfirmarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full bg-[#2A2A72] px-[45px] py-[14px] text-[13px] font-bold uppercase text-center text-white hover:brightness-[.9] ${className}`.trim()}
      style={{ color: textColor }}
    >
      {children}
    </button>
  );
}
