import type { ReactNode } from "react";

type BotaoProps = {
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function Botao({
  type = "button",
  children,
  onClick,
  className = "",
}: BotaoProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`botao ${className}`.trim()}
    >
      {children}
    </button>
  );
}
