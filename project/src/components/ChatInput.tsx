import { useState, useRef, useEffect } from "react";
import { IntentAutocomplete } from "./IntentAutocomplete";

export function ChatInput({ onSend, disabled, loading }: { 
  onSend: (msg: string) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [text, setText] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const intents = [
    { key: "/nota", label: "Nota", icon: "📝", description: "Convierte tu mensaje en una nota clara y resumida." },
    { key: "/recordatorio", label: "Recordatorio", icon: "⏰", description: "Crea recordatorios con hora, fecha o acciones." },
    { key: "/busqueda", label: "Búsqueda", icon: "🔎", description: "Realiza una búsqueda informativa o investigativa." }
  ];

  // Cerrar autocompletado al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current && 
        !autocompleteRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Escape cierra el autocompletado
    if (e.key === "Escape") {
      setShowAutocomplete(false);
      textareaRef.current?.focus();
      return;
    }

    // Navegación de intents
    if (showAutocomplete) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % intents.length);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? intents.length - 1 : prev - 1
        );
        return;
      }

      // Tab también navega
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          setSelectedIndex((prev) =>
            prev === 0 ? intents.length - 1 : prev - 1
          );
        } else {
          setSelectedIndex((prev) => (prev + 1) % intents.length);
        }
        return;
      }

      // ENTER selecciona intent
      if (e.key === "Enter") {
        e.preventDefault();
        selectIntent(intents[selectedIndex]);
        return;
      }
    }

    // ENTER normal envía mensaje
    if (e.key === "Enter" && !e.shiftKey && !showAutocomplete) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectIntent = (intent: typeof intents[0]) => {
    setText(intent.key + " ");
    setShowAutocomplete(false);
    setSelectedIndex(0);
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (!text.trim() || disabled || loading) return;
    onSend(text);
    setText("");
    setShowAutocomplete(false);
    setSelectedIndex(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    // Mostrar autocompletado solo si empieza con "/" y no está vacío
    const shouldShowAutocomplete = value.startsWith("/") && value === "/";
    setShowAutocomplete(shouldShowAutocomplete);
    
    // Resetear selección cuando se cambia el texto
    if (shouldShowAutocomplete) {
      setSelectedIndex(0);
    }
  };

  return (
    <div className="relative w-full">
      {showAutocomplete && (
        <div ref={autocompleteRef}>
          <IntentAutocomplete 
            intents={intents} 
            selected={selectedIndex}
            onSelect={selectIntent}
          />
        </div>
      )}

      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full p-3 pr-24 rounded-lg bg-[#0F1124] text-white border border-[#2C2F4A] focus:border-accent-primary focus:outline-none resize-none"
          placeholder="Escribe un mensaje..."
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          rows={1}
          style={{
            minHeight: "44px",
            maxHeight: "120px",
          }}
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled || loading}
          className="absolute right-3 bottom-3 px-4 py-1 bg-accent-primary text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}