# AI Copilot — Multi-Agente + Multi-Proveedor

_Asistente conversacional inteligente con arquitectura profesional, agentes especializados y orquestación multiproveedor._

**Autor:** Ian Pérez A.  
*Desarrollador Backend & AI Engineer*

---

## 1. Descripción general

**AI Copilot** es un asistente conversacional impulsado por modelos LLM, capaz de operar mediante **intents especializados**, cada uno optimizado con un agente propio, un proveedor distinto y prompts ajustados según la tarea.

Durante una sesión de hasta **20 turnos**, el sistema mantiene contexto, admite tareas de productividad y responde en español claro y estructurado.

### Funcionalidades principales

- **Conversación general:** Chat fluido y natural.
- **Creación de notas resumidas:** Comando `/nota` para convertir texto libre en notas organizadas.
- **Recordatorios inteligentes:** Comando `/recordatorio` con cálculo de fecha y hora absoluta.
- **Búsquedas informativas:** Comando `/búsqueda` para explicaciones conceptuales.
- **Autocompletado de intents:** Sugerencias en el frontend.
- **Métricas visibles:** Latencia, proveedor, modelo y fallback mostrados en tiempo real.

---

## 2. Arquitectura general

### Frontend (Deploy en Vercel)
- **Frameworks:** React 18, Vite.
- **Lenguaje:** TypeScript.
- **Estilos:** TailwindCSS (bolt.new theme).
- **Features:** Autocompletado de intents, Cards especializadas, manejo de sesiones y turnos.

### Backend (Deploy en Railway)
- **Framework:** FastAPI.
- **Lenguaje:** Python 3.10.
- **Arquitectura:** Sistema Multi-agente y Patrón Strategy (Multiproveedor).
- **Testing:** Pytest.
- **Config:** CORS configurado para entornos locales y productivos.

---

## 3. Sistema Multi-Agente

Además del patrón **Strategy**, este proyecto implementa **un sistema completo de agentes especializados**, donde cada intent tiene:

- System prompt propio.
- Proveedor y modelo óptimo para la tarea.
- Parámetros de inferencia ajustados.
- Lógica interna independiente.

### Clase base de agentes

```python
class AgentStrategy:
    def system_prompt(self) -> str:
        raise NotImplementedError()

    def select_provider(self) -> str:
        raise NotImplementedError()

    def select_model(self) -> str:
        raise NotImplementedError()

    def llm_params(self) -> Dict:
        return {}
```

### Agentes Implementados

#### 1. DefaultAgent – Conversación general
- **Uso:** Charlas naturales, preguntas abiertas.
- **Proveedor:** Groq.
- **Modelo:** `llama-3.1-8b-instant`.

#### 2. NoteAgent – `/nota`
- **Uso:** Convierte texto libre en una nota organizada y resumida.
- **Proveedor:** HuggingFace.
- **Modelo:** `meta-llama/Meta-Llama-3-8B-Instruct`.
- **Parámetros:**
  ```json
  {
    "temperature": 0.2,
    "top_p": 0.9,
    "max_tokens": 200
  }
  ```

#### 3. ReminderAgent – `/recordatorio`
- **Uso:** Genera recordatorios con fecha y hora absoluta usando la hora real del servidor como referencia.
- **Ejemplo:** "Recuérdame apagar la estufa en 15 minutos" → Calcula automáticamente la fecha exacta.
- **Proveedor:** Groq.
- **Modelo:** `meta-llama/llama-4-maverick-17b-128e-instruct`.
- **Obtención de hora:**
  ```python
  def get_now_iso(self):
      return datetime.now(timezone.utc).isoformat()
  ```

#### 4. SearchAgent – `/búsqueda`
- **Uso:** Explica temas, conceptos o consultas informativas.
- **Proveedor:** HuggingFace.
- **Modelo:** `Qwen/Qwen2.5-7B-Instruct`.
- **Temperatura:** 0.1.

---

## 4. Multiproveedor (Strategy Pattern)

Implementación del patrón Strategy para cambiar dinámicamente de proveedor:

```python
def get_provider(name: str, model: str):
    if name == "groq":
        return GroqProvider(model)
    if name == "huggingface":
        return HFProvider(model)
    raise ValueError("Proveedor no soportado")
```

---

## 5. Lógica conversacional

### Contexto
Se mantiene un historial de conversación que se envía al modelo:
```json
[
  {"role": "system", "content": "..."},
  {"role": "user", "content": "..."},
  {"role": "assistant", "content": "..."},
  {"role": "user", "content": "..."}
]
```

### Reglas
- **Límite:** 20 turnos por sesión.
- **Formatos especiales:**
  - `/nota` → Retorna notas formateadas.
  - `/recordatorio` → Retorna un JSON limpio.
  - `/búsqueda` → Retorna una explicación clara.

---

## 6. Frontend

- **Autocompletado:** Implementado en `IntentAutocomplete.tsx`.
- **Cards:** Definidas en `IntentCard.tsx`.
- **Manejo de métricas:** Se muestra en cada mensaje (Latencia, Proveedor, Modelo, Fallback).

---

## 7. Backend

### Estructura de carpetas
```bash
app/
 ├── agents/
 ├── providers/
 ├── routers/
 ├── services/
 ├── models/
 └── main.py
```

### Pipeline principal (`POST /api/chat`)
`user_input` → `IntentParser` → `AgentSelector` → `ProviderStrategy` → `LLM` → `ResponseBuilder`

---

## 8. Métricas del MVP

| Métrica | Resultado |
| :--- | :--- |
| **Latencia p50** | 550–900 ms |
| **Latencia p95** | 1200–1800 ms |
| **Tokens-in promedio** | 80–120 |
| **Tokens-out promedio** | 80–160 |
| **Reintentos** | hasta 3 |
| **Fallback rate** | < 3% |
| **Precisión de intents** | ~95% |

---

## 9. Limitaciones actuales

- Sin persistencia de notas o recordatorios.
- No hay memoria global entre diferentes agentes.
- Sin navegación web real (live crawling).
- Sin integración con calendarios externos.
- No cuenta con autenticación de usuarios.

---

## 10. Mejoras futuras

- [ ] Persistencia con Base de Datos.
- [ ] Memory Agent global.
- [ ] RAG para búsquedas reales.
- [ ] Integración con calendarios (Google/Outlook).
- [ ] Historial de sesiones.
- [ ] Soporte para más proveedores (Anthropic, OpenAI, Mistral).

---

## 11. Guía de desarrollo

### Backend
```bash
cd back-prueba-carso
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd front-prueba-carso/project
npm install
npm run dev
```

---

## 12. Deploy

- **Frontend (Vercel):** [https://front-ai-copilot.vercel.app](https://front-ai-copilot.vercel.app)
- **Backend (Railway):** [https://back-ai-copilot-production.up.railway.app](https://back-ai-copilot-production.up.railway.app)
