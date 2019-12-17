const { app, dialog, BrowserWindow, Menu, ipcMain} = require("electron");
let dev;
const args = process.argv.slice(1);
dev = args.some(val => val === '--dev');
////uncomment below to hide security alert on console
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1";


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let browserWindow;

function sendStatusToWindow(text) {
  browserWindow.webContents.send(text);
}

function sendDataToWindow(event,data) {
  browserWindow.webContents.send(event,data);
}

function aboutApp() {
  dialog.showMessageBox({
    type: 'none',
    // icon: __dirname + "/build/assets/logo/logo.png",
    message: 'Vdemy Online Custom Element' ,
    detail: 'Author: Salil V Nair \nversion:'+app.getVersion()+'',
  });
}

function createWindow() {

  // Create the browser window.
  browserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + "/build/icon.icns",
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    autoHideMenuBar: false //auto hiding menu bar
  });

  // toggle between the index.html of the app or localhost:4200.
  //browserWindow.loadURL(`file://${__dirname}/index.html`);
  if(dev){
    browserWindow.loadURL('http://localhost:3000');
  }
  else{
    browserWindow.loadURL(`file://${__dirname}/build/index.html`);
  }

  // Emitted when the window is closed.
  browserWindow.on("closed", (event) => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    browserWindow = null;
  });


  // Create the Application's main menu
  var template = [{
    label: "Application",
    submenu: [
        { label: "About Application", click: function() {
          aboutApp();
        } },
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
app.on("ready", createWindow);


// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (browserWindow === null) {
    createWindow();
  }
});

ipcMain.on('login',(event, data)=>{
  var parent = browserWindow
  var dimensions = parent.getSize();
  let udemyLoginWindow = new BrowserWindow({
    width: dimensions[0],
    height: dimensions[1],
    webPreferences: {
      partition: 'persist:vdemy_'+data.email
    },
    parent, modal:true})
  udemyLoginWindow.loadURL(`https://www.udemy.com`);
  udemyLoginWindow.webContents.session.webRequest.onBeforeSendHeaders({urls: ['*://*.udemy.com/*']},
  function(request,callback){
    if(request.requestHeaders.Authorization){
        let token = request.requestHeaders.Authorization.split(' ')[1];
        sendDataToWindow('logged-in',{token:token});
        udemyLoginWindow.destroy();
    }
    callback({ requestHeaders: request.requestHeaders })
  });
})

ipcMain.on('last-visited-lecture', (event, data)=>{
  var redirectionWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      partition: 'persist:vdemy_'+data.email
    }
  });
  redirectionWindow.loadURL(data.url);
  const redirectUri = 'https://www.udemy.com/course-dashboard-redirect'
  const filter = {
    urls: [redirectUri + '*']
  };
  redirectionWindow.webContents.session.webRequest.onBeforeRedirect(filter, appWebResponse);
  function appWebResponse(details) {
    sendDataToWindow('lecture-redirect-url', details.redirectURL);
    redirectionWindow.destroy();
  }
});
