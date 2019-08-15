const { app, BrowserWindow,Menu } = require('electron');
let dev;
const args = process.argv.slice(1);
dev = args.some(val => val === '--dev');
//initializing nedb here as on electron anglur cli has certain restrictions
 var nedbDatastore = require('nedb');
 global.ngpa_provider = { nedb: nedbDatastore };
// Keep a global reference of the window object, if you don't, the window will

//added video utils to get video length
//it requires "get-video-duration": "^1.0.2" dependecy
//hence add it in ngxeu dependencies of package.json
let vdoUtil = require('./js-lib/video-util.js');
global.utils = {
  vdoUtil: vdoUtil
};

// be closed automatically when the JavaScript object is garbage collected.
let browserWindow;

//send status to angular app
function sendStatusToWindow(text) {
  browserWindow.webContents.send(text);
}

function createWindow() {
  // Create the browser window.
  browserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '/build/icon.icns',
    webPreferences: { webSecurity: false },
    autoHideMenuBar: false //added for auto hiding menu bar
  });
  console.log(__dirname + '/build/index.html');
  // and load the index.html of the app.
  if(dev){
    browserWindow.loadURL('http://localhost:4200');
  }
  else{
    browserWindow.loadURL(`file://${__dirname}/build/index.html`);
  }

  // Open the DevTools.
  //browserWindow.webContents.openDevTools();
  // Emitted when the window is closed.
  browserWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    browserWindow = null;
  });

   // Create the Application's main menu
   var template = [{
      label: "Application",
      submenu: [
          { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
          { type: "separator" },
          { label: "Hide", accelerator: "CmdOrCtrl+H", click: function() {
            if(browserWindow.isMenuBarVisible()){
              browserWindow.setMenuBarVisibility(false);
            }
            else{
              browserWindow.setMenuBarVisibility(true);
            }
           }},
          { type: "separator" },
          { label: "Check for Updates", accelerator: "CmdOrCtrl+U", click: function() {
              sendStatusToWindow('checkForUpdate');
           }},
          { type: "separator" },
          { label: "Quit", accelerator: "CmdOrCtrl+Q", click: function() { app.quit(); }},
          { type: "separator" },
          { label: "Developer Mode", accelerator: "CmdOrCtrl+D", click: function() { browserWindow.webContents.openDevTools(); }}
      ]}, {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "CmdOrCtrl+Y", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
    ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
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