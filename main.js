const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
//initializing nedb here as on electron anglur cli has certain restrictions
var nedbDatastore = require('nedb');
global.tsc_repository = { nedb: nedbDatastore };
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let browserWindow;

function createWindow() {
  // Create the browser window.
  browserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '/src/favicon.ico',
    webPreferences: { webSecurity: false }
  });
  //console.log(__dirname + '/src/favicon.ico');
  // and load the index.html of the app.
  browserWindow.loadURL(`file://${__dirname}/dist/index.html`);

  //browserWindow.setMenu(null);

  // browserWindow.loadURL('http://localhost:4200');

  // Open the DevTools.
  browserWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  browserWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    browserWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (browserWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
