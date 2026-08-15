# Uso de Inteligencia Artificial

Documento de transparencia sobre el uso de herramientas de IA en este proyecto.

---

## Herramientas utilizadas

| Herramienta | Uso                                      |
| ----------- | ---------------------------------------- |
| Kiro (AWS)  | Asistente de desarrollo en IDE           |

---

## ¿En qué partes del proyecto se usó IA?

- **Scaffolding inicial**: Generación de la estructura de carpetas y archivos base.
- **Componentes UI**: Generación de componentes reutilizables con variantes.
- **Mock data**: Creación de datos de ejemplo realistas.
- **Documentación**: Ayuda en la redacción de README y DECISIONS.

---

## ¿Qué acepté directamente?

- Estructura de archivos y organización del proyecto.
- Componentes UI básicos (Button, Input, Card, Spinners).
- Formateo de código y estilos de Tailwind.

---

## ¿Qué corregí o ajusté?

- **Reglas de negocio**: Revisé que las validaciones estuvieran en la capa correcta (no solo en UI).
- **Flujo de transacción**: Ajusté la navegación entre pasos para que fuera intuitiva.
- **Tipos de dominio**: Refiné los tipos para que fueran más expresivos (discriminated unions para ConfirmationResult).
- **Manejo de errores**: Verifiqué que todos los escenarios estuvieran cubiertos.

---

## Decisiones que tomé yo (no la IA)

1. **Zustand sobre Redux/Context**: Decisión basada en experiencia previa con apps de alto volumen.
2. **Separación de validaciones en 3 capas**: Patrón de defensa en profundidad que aplico en proyectos reales.
3. **CSR sobre SSR**: Decisión consciente por la naturaleza de la app (sesión en localStorage, datos personalizados).
4. **Flujo multi-paso sin router**: Mantener el estado del flujo en un store en lugar de múltiples páginas reduce complejidad.
5. **Funciones puras para business rules**: Facilita testing y reutilización.
6. **No incluir tests**: Decisión de priorizar funcionalidad completa sobre cobertura de tests dado el tiempo disponible.

---

## Reflexión

La IA aceleró significativamente el desarrollo del boilerplate y componentes repetitivos. Sin embargo, las decisiones de arquitectura, la separación de responsabilidades y el diseño del flujo de datos fueron criterios de ingeniería propios basados en experiencia profesional.
