# AI Copilot — Multi-Agente + Multi-Proveedor  
_Asistente conversacional inteligente con arquitectura de agentes especializados y orquestación multiproveedor._

---

## 📌 1. Descripción general

**AI Copilot** es un asistente conversacional impulsado por modelos LLM, capaz de operar mediante **intents especializados**, cada uno optimizado con un agente propio, un proveedor distinto y prompts ajustados según la tarea.

Durante una sesión de hasta **20 turnos**, el sistema mantiene contexto, admite tareas de productividad y responde en español claro y estructurado.

### Funcionalidades principales

- 🧠 Conversación general
- 📝 Creación de **notas resumidas** con formato claro (`/nota`)
- ⏰ Creación de **recordatorios inteligentes** con fecha y hora absoluta (`/recordatorio`)
- 🔍 **Búsquedas informativas** o explicaciones conceptuales (`/búsqueda`)
- ✨ Autocompletado de intents en el frontend
- 📊 Métricas visibles: latencia, proveedor, modelo y fallback

---

## 🏗️ 2. Arquitectura general

### Frontend (deploy en **Vercel**)
- React 18  
- Vite  
- TypeScript  
- TailwindCSS (tema bolt.new)  
- Autocompletado de intents  
- Cards especializadas según el tipo de respuesta  
- Manejo de sesiones y turnos  

### Backend (deploy en **Railway**)
- FastAPI  
- Python 3.10  
- Sistema multi-agente  
- Módulo multiproveedor (Strategy)  
- Pytest  
- CORS configurado para entornos locales y productivos  

---

# 🤖 3. Sistema Multi-Agente

Además del patrón **Strategy**, este proyecto implementa **un sistema completo de agentes especializados**, donde cada intent tiene:

- System prompt propio  
- Proveedor y modelo óptimo para la tarea  
- Parámetros de inferencia ajustados  
- Lógica interna independiente  

### Clases base

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
