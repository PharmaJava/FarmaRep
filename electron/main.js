const { app, BrowserWindow, Menu, shell, dialog, ipcMain, clipboard, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

// Copiar imagen al portapapeles del sistema (solicitado desde el renderer).
ipcMain.handle('copy-image', (event, dataURL) => {
  try {
    clipboard.writeImage(nativeImage.createFromDataURL(dataURL));
    return true;
  } catch (err) {
    return false;
  }
});

// ── Inicio automático con Windows ──────────────────────────────────────────
// La preferencia se guarda en un fichero JSON en la carpeta de datos del
// usuario. En la primera ejecución se activa por defecto; después respeta la
// elección del usuario (menú Archivo → "Iniciar con Windows").
function settingsPath() {
  return path.join(app.getPath('userData'), 'farmastock-settings.json');
}
function readSettings() {
  try { return JSON.parse(fs.readFileSync(settingsPath(), 'utf8')); } catch (e) { return null; }
}
function writeSettings(s) {
  try { fs.writeFileSync(settingsPath(), JSON.stringify(s)); } catch (e) {}
}
function applyAutoStart(enabled) {
  try {
    app.setLoginItemSettings({ openAtLogin: !!enabled, path: process.execPath });
  } catch (e) {}
}
function initAutoStart() {
  let s = readSettings();
  if (!s) { s = { autoStart: true }; writeSettings(s); } // primera ejecución → activado
  applyAutoStart(s.autoStart);
}
function setAutoStart(enabled) {
  writeSettings({ autoStart: enabled });
  applyAutoStart(enabled);
}
function isAutoStartOn() {
  try { return app.getLoginItemSettings().openAtLogin; } catch (e) { return false; }
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 900,
    minHeight: 600,
    title: 'FarmaStock',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  buildMenu();
}

function buildMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Guardar copia de seguridad…',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.executeJavaScript('exportData()'),
        },
        {
          label: 'Restaurar copia de seguridad…',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.executeJavaScript(
            'document.getElementById("ifi").click()'
          ),
        },
        { type: 'separator' },
        {
          label: 'Editor de Mapas',
          accelerator: 'CmdOrCtrl+M',
          click: () => mainWindow.loadFile(path.join(__dirname, '..', 'map-editor.html')),
        },
        {
          label: 'Volver al Almacén',
          accelerator: 'CmdOrCtrl+Shift+M',
          click: () => mainWindow.loadFile(path.join(__dirname, '..', 'index.html')),
        },
        { type: 'separator' },
        {
          label: 'Iniciar con Windows',
          type: 'checkbox',
          checked: isAutoStartOn(),
          click: (item) => setAutoStart(item.checked),
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: 'Alt+F4',
          role: 'quit',
        },
      ],
    },
    {
      label: 'Ver',
      submenu: [
        { label: 'Recargar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { type: 'separator' },
        { label: 'Acercar', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Alejar', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { label: 'Tamaño original', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'Pantalla completa', accelerator: 'F11', role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de FarmaStock',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'FarmaStock',
              message: 'FarmaStock v1.5.0',
              detail:
                'Gestión visual de inventario para almacén farmacéutico.\n\n' +
                'Los datos se guardan localmente en este equipo.\n' +
                'Usa "Exportar copia de seguridad" para hacer backups.',
              buttons: ['Cerrar'],
            });
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  initAutoStart();
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
