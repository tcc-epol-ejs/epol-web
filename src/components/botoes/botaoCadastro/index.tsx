interface BotaoCadastroProps {
  children: React.ReactNode;
  bgColor?: string;
}

export default function BotaoCadastro({
  children,
  bgColor = '#FFA400',
}: BotaoCadastroProps) {
  return (
    <button
      className="rounded-full text-[#333] font-bold py-[14px] px-[22px] text-[13px] uppercase whitespace-nowrap"
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </button>
  );
}
