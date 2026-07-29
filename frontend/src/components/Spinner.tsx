export function Spinner() {
  return (
    <div
      role="status"
      aria-label="Translating"
      className="h-4 w-4 rounded-full border-2 border-[#2A2E38] border-t-[#7C6FF0]
                 motion-safe:animate-spin"
    />
  );
}