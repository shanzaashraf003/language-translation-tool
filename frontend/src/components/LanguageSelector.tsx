import { SUPPORTED_LANGUAGES } from "../types/translation";

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
  excludeAuto?: boolean;
  label: string;
}

export function LanguageSelector({
  value,
  onChange,
  excludeAuto = false,
  label,
}: LanguageSelectorProps) {
  const options = excludeAuto
    ? SUPPORTED_LANGUAGES.filter((lang) => lang.code !== "auto")
    : SUPPORTED_LANGUAGES;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wider text-[#8A8D93] font-medium">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#1A1D24] text-[#EDEEF0] border border-[#2A2E38] rounded-lg px-3 py-2
                   text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7C6FF0]
                   focus:border-transparent transition-shadow cursor-pointer"
      >
        {options.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}