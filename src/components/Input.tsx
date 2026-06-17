interface InputProps {
  placeholder?: string;
}

export default function Input({ placeholder }: InputProps) {
  return (
    <input
      className="bg-[#A9A9F6] text-white placeholder-gray-600 px-8 py-6  gap-8 rounded-full border-none focus:outline-none focus:ring-0"
      placeholder={placeholder}
    />
  );
}
