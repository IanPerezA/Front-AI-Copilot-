import { Message } from "../types";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const intent = message.metadata?.intent || "default";

  // Función para procesar negritas **texto**
  const formatContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-bold">
            {boldText}
          </strong>
        );
      }
      return part;
    });
  };

  // Función para formatear JSON de manera elegante
const formatJSON = (content: string) => {
  try {
    // Buscar JSON en el contenido
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      const jsonObj = JSON.parse(jsonString);
      
      const beforeJSON = content.substring(0, jsonMatch.index);
      const afterJSON = content.substring(jsonMatch.index + jsonString.length);

      return (
        <>
          {formatContent(beforeJSON)}
          <div className="bg-[#0F1124] border border-[#2C2F4A] rounded-lg p-4 my-3 font-mono text-sm">
            <div className="text-accent-primary font-semibold mb-2">Detalles del recordatorio:</div>
            <div className="space-y-2">
              {Object.entries(jsonObj).map(([key, value]) => {
                // Si es fecha_ejecucion, formatearla bonito
                if (key === 'fecha_ejecucion') {
                  const fechaFormateada = new Date(value as string).toLocaleString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  
                  return (
                    <div key={key} className="flex">
                      <span className="text-gray-400 min-w-32 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-accent-secondary flex-1">
                        {fechaFormateada}
                      </span>
                    </div>
                  );
                }
                
                // Para otros campos normales
                return (
                  <div key={key} className="flex">
                    <span className="text-gray-400 min-w-32 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-white flex-1">
                      {value as string}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {formatContent(afterJSON)}
        </>
      );
    }
  } catch (error) {
    // Si hay error al parsear JSON, mostrar contenido normal
    console.log('No se pudo parsear JSON:', error);
  }

  // Contenido normal sin JSON
  return formatContent(content);
};

  // estilos
  const bubbleBase = isUser
    ? "bg-accent-primary text-white rounded-br-none"
    : "dark-bg-tertiary text-primary rounded-bl-none";

  const intentCard =
    "bg-[#1E1F3A] border border-[#3A3B5A] text-white rounded-xl p-4 max-w-md shadow-lg";

  const intentTitle = {
    nota: "📝 Nota",
    recordatorio: "⏰ Recordatorio",
    busqueda: "🔎 Búsqueda",
  }[intent];

  // si es intent especial → tarjeta
  if (!isUser && intent !== "default") {
    return (
      <div className="flex justify-start mb-4">
        <div className={intentCard}>
          <p className="font-bold mb-2">{intentTitle}</p>
          <div className="whitespace-pre-wrap leading-relaxed">
            {intent === "recordatorio" ? formatJSON(message.content) : formatContent(message.content)}
          </div>

          {message.metadata && (
            <div className="flex gap-3 text-xs mt-3 opacity-70 flex-wrap">
              {message.metadata.latency_ms && (
                <span className="bg-[#2C2F4A] px-2 py-1 rounded">Latencia: {Math.round(message.metadata.latency_ms)} ms</span>
              )}
              {message.metadata.model && (
                <span className="bg-[#2C2F4A] px-2 py-1 rounded">Modelo: {message.metadata.model}</span>
              )}
              {message.metadata.provider && (
                <span className="bg-[#2C2F4A] px-2 py-1 rounded">Proveedor: {message.metadata.provider}</span>
              )}
              {message.metadata.fallback && (
                <span className="bg-[#4A2C2C] px-2 py-1 rounded">Fallback</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // mensaje normal
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`px-4 py-3 rounded-xl max-w-md ${bubbleBase}`}>
        <div className="whitespace-pre-wrap break-words">
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  );
}