interface InputProps {
  placeholder?: string;
}

export default function Input({ placeholder }: InputProps) {
  return (
    <input
      className="bg-[#A9A9F6] text-black placeholder-[#2a2a72] min-w-[100px] min-h-[30px] w-full rounded-full border-none focus:outline-none "
      placeholder={placeholder}
    />
  );
}
