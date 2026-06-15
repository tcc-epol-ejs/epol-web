interface InputProps {
  placeholder?: string;
}

export default function Input({ placeholder }: InputProps) {
  return (
    <input
      type="text"
      className="w-full border border-gray-300 rounded-full px-4 py-2 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
      placeholder={placeholder}
    />
  );
}
