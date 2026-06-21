interface InputProps {
  placeholder?: string;
}

export default function Input({ placeholder }: InputProps) {
  return (
    <input
      className="bg-[#A9A9F6] text-black placeholder-[#2a2a72] min-w-[5px] min-h-[5px] w-full rounded-full border-none focus:outline-none px-4 py-3"
      placeholder={placeholder}
    />
  );
}
