interface InputProps {
  placeholder?: string;
}

export default function Input({ placeholder }: InputProps) {
  return (
    <input
      type="text"
      className="w-120 px-5 py-5 rounded-full bg-[#c5b8e8] placeholder-gray-500 outline-none border-none focus:outline-none text-2xl mt-5"
      placeholder={placeholder}
    />
  );
}
