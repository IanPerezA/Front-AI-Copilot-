export interface IntentAutocompleteProps {
  intents: {
    key: string;
    label: string;
    description: string;
    icon: string;
  }[];
  selected: number;
  onSelect: (intent: any) => void;
}

export function IntentAutocomplete({ intents, selected, onSelect }: IntentAutocompleteProps) {
  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
      <div className="bg-[#1B1D33] border border-[#2C2F4A] rounded-xl p-2 w-full shadow-2xl">
        <p className="text-xs text-gray-400 px-3 py-2 border-b border-[#2C2F4A]">
          Selecciona un tipo de mensaje:
        </p>
        {intents.map((intent, i) => (
          <button
            key={intent.key}
            onClick={() => onSelect(intent)}
            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition w-full text-left
              ${
                selected === i
                  ? "bg-[#2C2F4A] border border-[#464A6A]"
                  : "hover:bg-[#262842]"
              }`}
          >
            <span className="text-xl flex-shrink-0">{intent.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white">{intent.label}</p>
              <p className="text-xs text-gray-300 truncate">{intent.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}