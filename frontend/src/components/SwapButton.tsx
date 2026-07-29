interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SwapButton({ onClick, disabled }: SwapButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Swap languages"
      className="group relative flex h-10 w-10 items-center justify-center rounded-full
                 bg-[#1A1D24] border border-[#2A2E38] text-[#7C6FF0]
                 hover:border-[#7C6FF0] hover:bg-[#7C6FF0]/10
                 disabled:opacity-40 disabled:cursor-not-allowed
                 transition-all duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
      >
        <path d="M17 3L21 7L17 11" />
        <path d="M21 7H9C6.79086 7 5 8.79086 5 11" />
        <path d="M7 21L3 17L7 13" />
        <path d="M3 17H15C17.2091 17 19 15.2091 19 13" />
      </svg>
    </button>
  );
}