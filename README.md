# FarmaStock — Control de Stock de Almacén

Sistema para la gestión visual del inventario de un almacén. Permite ubicar artículos en zonas de un plano interactivo, consultarlos, editarlos, moverlos entre zonas y exportar/importar el inventario.

> **Sin servidor. Sin base de datos. Funciona 100% offline.**  
> Disponible como **app de escritorio (.exe)** y como página web estática.

---

## Instalación como app de escritorio (Windows)

### Opción A — Descargar el instalador ya compilado

1. Ve a [Releases](../../releases) y descarga `FarmaStock Setup X.Y.Z.exe`
2. Ejecuta el instalador (puede pedir permisos de Windows SmartScreen → "Más info" → "Ejecutar igualmente")
3. Se instala en `Archivos de programa` y crea acceso directo en el escritorio
4. Los datos se guardan localmente en el equipo y persisten entre reinicios

### Opción B — Compilar desde el código fuente

Requisitos: **Node.js 18+** y **Windows** (o Wine en Linux/macOS)

```bash
git clone https://github.com/PharmaJava/FarmaRep.git
cd FarmaRep
npm install
npm run build:win        # genera dist/FarmaStock Setup X.Y.Z.exe
```

Para ejecutar en modo desarrollo sin compilar:
```bash
npm start
```

### Generar un nuevo release automáticamente (GitHub Actions)

```bash
git tag v1.4.0
git push origin v1.4.0
```

El workflow de CI compila el `.exe` en `windows-latest` y lo adjunta al release de GitHub automáticamente.

---

## Uso como página web (GitHub Pages / offline local)

La app funciona directamente en el navegador sin servidor:

- **GitHub Pages**: sube los archivos al repositorio, activa Pages en `main /root`
- **Offline local**: abre `index.html` directamente con `file://` en cualquier navegador moderno
- **Todas las fuentes y librerías están incluidas** en la carpeta `vendor/` — no requiere conexión a internet

---

## Funcionalidades

| Acción | Cómo |
|---|---|
| Ver zona | Clic en la zona del plano |
| Añadir artículo | Selecciona zona → rellena el formulario → Añadir |
| Editar artículo | Botón ✏️ en la tarjeta del artículo |
| Mover artículo | Botón ↔ → elige zona destino en el modal |
| Eliminar artículo | Botón ✕ en la tarjeta |
| Buscar | Campo de búsqueda superior → Enter |
| Importar desde Excel | Botón ⬇ Desde Excel → selecciona `.xls/.xlsx/.csv` |
| Exportar backup | Botón ⬇ Exportar (JSON con artículos + config de zonas) |
| Importar backup | Botón ⬆ Importar → selecciona `.json` |
| Mover zona | Arrastra la zona en el plano |
| Redimensionar zona | Click derecho en la zona → Editar zona |
| Nueva zona | Botón ➕ Nueva Zona en la cabecera |

---

## Editor de Mapas — para otros negocios

FarmaStock puede adaptarse a cualquier almacén o negocio. El **Editor de Mapas** permite diseñar un plano personalizado desde cero:

1. Haz clic en **🗺 Editor Mapa** en la cabecera (o `Ctrl+M` en la app de escritorio)
2. Introduce el **nombre del negocio**
3. Selecciona el modo **✏️ Dibujar zona** y arrastra para crear zonas en el canvas
4. Haz clic en cada zona para asignarle un **ID**, **etiqueta** y **color**
5. Pulsa **✅ Aplicar a FarmaStock** — el mapa se activa inmediatamente

Para reutilizar el mismo mapa en otro equipo:
- **💾 Exportar JSON** guarda el mapa como archivo
- En el otro equipo: abre el Editor de Mapas → **📂 Abrir mapa** → selecciona el JSON exportado → **Aplicar**

El mapa personalizado se guarda en el almacenamiento local del equipo y se carga automáticamente al abrir la app.

---

## Almacenamiento de datos

Los datos se guardan localmente bajo estas claves:

| Clave localStorage | Contenido |
|---|---|
| `farmastock_v1` | Artículos por zona |
| `farmastock_zones_v1` | Posición y color de cada zona |
| `farmastock_map_config` | Mapa personalizado (si se ha configurado) |

- Los datos persisten al cerrar y reabrir la app
- Limpiar el caché del navegador / desinstalar la app elimina los datos
- Usa **Exportar** regularmente para hacer copias de seguridad

---

## Estructura del repositorio

```
FarmaRep/
├── index.html              # App principal
├── farmacia-almacen.html   # Vista alternativa del almacén
├── map-editor.html         # Editor visual de mapas
├── vendor/
│   ├── xlsx.full.min.js    # Librería Excel (offline)
│   └── fonts/              # Fuentes IBM Plex (offline)
├── electron/
│   ├── main.js             # Proceso principal Electron
│   ├── preload.js          # Bridge seguro renderer↔main
│   └── assets/icon.ico     # Icono de la app
├── .github/workflows/
│   └── build-electron.yml  # CI → genera .exe
└── package.json            # Dependencias y scripts de compilación
```

---

## Tecnologías

HTML5 · CSS3 · JavaScript ES6+ · SVG · localStorage · IBM Plex (offline) · Electron 31 · electron-builder

---

## Licencia

MIT — libre para uso, modificación y distribución.
