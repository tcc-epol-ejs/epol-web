interface BotaoVoltarProps {
  children: React.ReactNode;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

export default function BotaoVoltar({
  children,
  textColor = '#2a2a72',
  onClick,
  className = '',
}: BotaoVoltarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full font-bold px-[50px] text-[13px] uppercase whitespace-nowrap hover:brightness-[.100] ${className}`.trim()}
      style={{ backgroundColor: 'transparent', color: textColor }}
    >
      {children}
    </button>
  );
}
