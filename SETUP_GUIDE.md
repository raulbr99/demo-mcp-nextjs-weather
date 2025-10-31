# Weather App - Setup Guide

Esta aplicación tiene **dos modos de uso**:

## 1. Modo Standalone (Navegador)

Usa la aplicación directamente en tu navegador con interfaz de búsqueda.

### Pasos:
1. Asegúrate de que el archivo `.env` existe con tu API key:
   ```bash
   cp .env.example .env
   ```

2. Inicia el servidor:
   ```bash
   npm run dev
   ```

3. Abre http://localhost:3000 en tu navegador

4. Escribe consultas como:
   - "What's the weather in Vigo?"
   - "Show me a 5-day forecast for Madrid"
   - "Compare weather between Barcelona and Valencia"

## 2. Modo MCP Server (con ChatGPT/Claude Code)

Usa la aplicación a través de ChatGPT o Claude Code con respuestas automáticas.

### Opción A: Con Claude Code (Solo texto - Ya funciona)

Claude Code ya está usando el servidor MCP correctamente. Cuando preguntas "dime el tiempo en vigo", Claude Code llama al servidor MCP y te muestra la información en **formato texto**.

**Esto es lo que ya funciona** - como viste en la captura de pantalla.

### Opción B: Con ChatGPT (Con widget visual)

Para que ChatGPT muestre el widget visual (el frontend bonito de Next.js) cuando preguntas sobre el clima, necesitarías desplegar la aplicación y configurarla como Custom GPT.

## Diferencia entre los modos

### Claude Code (MCP Server)
- ✅ Respuestas automáticas cuando preguntas
- ✅ Ya configurado y funcionando
- ❌ Solo muestra texto (no el widget visual)
- **Ejemplo**: Preguntas "dime el tiempo en vigo" → Claude responde con texto

### Navegador Standalone
- ✅ Interfaz visual bonita
- ❌ Requiere escribir en el buscador de la página
- ✅ No requiere configuración extra
- **Ejemplo**: Abres localhost:3000 y escribes en el campo de búsqueda

## ¿Qué tienes actualmente?

Basándome en tus capturas de pantalla:

1. ✅ **Claude Code funciona** - Muestra el clima de Tokyo en formato texto
2. ✅ **Navegador funciona** - Ahora tiene interfaz de búsqueda funcionando
