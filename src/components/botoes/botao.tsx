interface BotaoRecuperarProps {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

export default function BotaoRecuperar({
  children,
  bgColor = "#2A2A72",
  textColor = "#ffffff",
}: BotaoRecuperarProps) {
  return (
    <button
      className="rounded-full font-bold py-[14px] px-[50px] text-[13px] uppercase whitespace-nowrap hover:brightness-[.85]"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {children}
    </button>
  );
}
