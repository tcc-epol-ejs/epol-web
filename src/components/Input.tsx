interface InputProps {
  placeholder?: string;
}

export default function Input({ placeholder }: InputProps) {
  return (
    <input
      className="bg-[#eaf6ff] text-white placeholder-gray-300 px-4 py-2  gap-8 rounded-full outline-none border-none outline-none focus:outline-none focus:ring-0"
      placeholder={placeholder}
    />
  );
}
