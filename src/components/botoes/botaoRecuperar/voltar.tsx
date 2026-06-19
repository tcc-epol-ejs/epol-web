interface BotaoVoltarProps {
  children: React.ReactNode;
  textColor?: string;
}

export default function BotaoVoltar({
  children,
  textColor = '#2a2a72',
}: BotaoVoltarProps) {
  return (
    <button
      className="rounded-full font-bold px-[50px] text-[13px] uppercase whitespace-nowrap hover:brightness-[.100]"
      style={{ backgroundColor: 'transparent', color: textColor }}
    >
      {children}
    </button>
  );
}
