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

    const fechaRaw =
      data.fecha_ejecucion ||
      data.fecha ||
      data.fecha_hora ||
      null;

    let fechaLocal = "";
    let horaLocal = "";

    if (fechaRaw) {
      const d = new Date(fechaRaw);

      // Obtener fecha local
      fechaLocal = d.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Obtener hora local
      horaLocal = d.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    return (
      <div className="text-sm space-y-2">
        <p className="font-semibold text-base">Recordatorio creado</p>

        <p><b>• Fecha:</b> {fechaLocal || "—"}</p>
        <p><b>• Hora:</b> {horaLocal || "—"}</p>
        <p><b>• Descripción:</b> {data.descripcion || data.titulo}</p>

        {data.mensaje && (
          <p className="pt-2">
            <b>Mensaje de recordatorio:</b> "{data.mensaje}"
          </p>
        )}
      </div>
    );
  } catch (e) {
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
