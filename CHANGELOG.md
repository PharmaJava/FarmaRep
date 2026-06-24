# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [1.4.0] — 2026-06-24

### Añadido
- Botón **Copiar mapa**: copia el plano del almacén como imagen PNG al portapapeles para pegarlo en Word, correo, WhatsApp, etc. Usa el portapapeles nativo de Electron en la app de escritorio, con respaldo al portapapeles del navegador y, si no está disponible, descarga el PNG.
- Botón **Imprimir**: imprime únicamente el plano del almacén mediante estilos `@media print` (oculta cabecera y panel lateral).
- Puente seguro `copyImage` por IPC en Electron (`preload.js` + `main.js`) para escribir imágenes en el portapapeles del sistema.
- Campo `author` (PharmaJava) en `package.json` para los metadatos del instalador.

### Cambiado
- El plano del almacén ahora se ajusta automáticamente al alto de la ventana y se ve completo sin hacer scroll (antes el SVG desbordaba verticalmente).

### Corregido
- El instalador de Windows no empaquetaba `map-editor.html` ni la carpeta `vendor/` (fuentes e importación de Excel). En la app instalada el **Editor de Mapas** no abría y fallaban las fuentes y la importación desde Excel. Ahora se incluyen en `build.files`.

---

## [1.3.0] — 2026-04-03

### Corregido
- **Bug crítico**: un artículo podía aparecer en 2 ubicaciones simultáneas.
  - Causa raíz 1: los índices de array pasados como strings desde `onclick` fallaban la comparación estricta `===` en JavaScript, por lo que el artículo nunca se excluía de su propia validación al editar.
  - Causa raíz 2: el índice capturado al abrir el modal de mover quedaba obsoleto si se modificaba la lista antes de confirmar, causando que `splice` eliminara el artículo equivocado.
  - Solución: cada artículo tiene ahora un `_id` único e inmutable. Todas las operaciones (editar, mover, borrar, validar) localizan el artículo por `_id` en tiempo de ejecución, nunca por índice.
- Migración automática de datos existentes en `localStorage` para asignar `_id` a artículos sin él.

---

## [1.2.0] — 2026-04-03

### Añadido
- Edición inline de artículos con formulario dentro de la tarjeta
- Mover artículos entre zonas mediante modal con selector visual
- Exportar inventario a archivo `.json` con fecha en el nombre
- Importar inventario desde `.json` con validación de estructura y duplicados

### Cambiado
- Los botones de acción de cada artículo usan delegación de eventos (más robusto)

---

## [1.1.0] — 2026-04-01

### Añadido
- Validación de nombre duplicado entre zonas
- Validación de Código Nacional duplicado entre zonas

### Cambiado
- El Código Nacional (CN) pasa a ser campo opcional

### Corregido
- El buscador fallaba con artículos sin CN asignado

---

## [1.0.0] — 2026-04-01

### Añadido
- Plano interactivo SVG con 23 zonas numeradas + Casonera
- Alta de artículos por zona (nombre + CN)
- Eliminación de artículos
- Buscador por nombre o CN
- Indicador visual de zonas con artículos
- Contador de artículos por zona en el plano
- Persistencia con localStorage
- Interfaz responsive
