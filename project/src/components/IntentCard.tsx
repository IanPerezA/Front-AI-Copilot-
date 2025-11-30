interface Props {
  intent: "nota" | "recordatorio" | "busqueda" | "default";
  content: string;
}

export function IntentCard({ intent, content }: Props) {
  const config = {
    nota: {
      icon: "📝",
      title: "Nota",
    },
    recordatorio: {
      icon: "⏰",
      title: "Recordatorio",
    },
    busqueda: {
      icon: "🔍",
      title: "Búsqueda",
    },
    default: {
      icon: "🤖",
      title: "Respuesta",
    },
  };

  // --- FORMATEO ESPECIAL PARA RECORDATORIOS ---
  const renderRecordatorio = () => {
    try {
      const data = JSON.parse(content);

      return (
        <div className="text-sm space-y-2">
          <p className="font-semibold">Recordatorio creado</p>

          <p>• <b>Fecha:</b> {data.fecha || data.fecha_ejecucion?.split("T")[0]}</p>
          <p>• <b>Hora:</b> {data.hora || data.fecha_ejecucion?.split("T")[1]?.substring(0, 5)}</p>
          <p>• <b>Descripción:</b> {data.descripcion || data.titulo}</p>

          {data.mensaje && (
            <p className="pt-2">
              <b>Mensaje de recordatorio:</b> "{data.mensaje}"
            </p>
          )}
        </div>
      );
    } catch (e) {
      // Si no es JSON válido, se muestra tal cual
      return <div className="whitespace-pre-wrap text-sm">{content}</div>;
    }
  };

  // --- FORMATEO ESPECIAL PARA NOTA ---
  const renderNota = () => (
    <div className="whitespace-pre-wrap text-sm leading-relaxed">
      {content}
    </div>
  );

  const renderDefault = () => (
    <div className="whitespace-pre-wrap text-sm leading-relaxed">
      {content}
    </div>
  );

  const renderContent = () => {
    if (intent === "recordatorio") return renderRecordatorio();
    if (intent === "nota") return renderNota();
    return renderDefault();
  };

  return (
    <div className="bg-white/90 text-black rounded-xl shadow-md border border-gray-200 max-w-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{config[intent].icon}</span>
        <span className="text-lg font-bold">{config[intent].title}</span>
      </div>

      <div className="border-t border-gray-300 pt-3">
        {renderContent()}
      </div>
    </div>
  );
}
