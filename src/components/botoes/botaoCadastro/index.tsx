interface BotaoCadastroProps {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

export default function BotaoCadastro({
  children,
  bgColor = '#FFA400',
  textColor = '#333',
}: BotaoCadastroProps) {
  return (
    <button
      className="rounded-full font-bold py-[14px] px-[22px] text-[13px] uppercase whitespace-nowrap hover:brightness-[.85]"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {children}
    </button>
  );
}
