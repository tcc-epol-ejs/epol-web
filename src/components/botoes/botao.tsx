interface BotaoRecuperarProps {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

export default function BotaoRecuperar({
  children,
  bgColor = '#2A2A72',
  textColor = '#ffffff',
  onClick,
  className = '',
}: BotaoRecuperarProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-full font-bold py-[14px] px-[50px] text-[13px] uppercase whitespace-nowrap transition-all duration-300 hover:brightness-[.85] ${className}`.trim()}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {children}
    </button>
  );
}
