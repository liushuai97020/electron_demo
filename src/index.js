const { app, BrowserWindow,ipcMain, MessageChannelMain  } = require('electron');
const path = require('path');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 使用ipcMain去监听渲染进程发来的MessagePort
  ipcMain.on('port',(e) => {
    const port = e.ports[0]
    port.on('message',(event) => {
      console.log(event.data.answer);
    })
    port.start()
  })
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);
app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      preload: path.join(__dirname, 'preload/mainPreload.js')
    }
  })
  const otherWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      preload: path.join(__dirname, 'preload/otherPreload.js')
    }
  })


  const {port1, port2} = new MessageChannelMain()

  mainWindow.once('ready-to-show',() => {
    mainWindow.webContents.postMessage('port', null, [port1])
  })
  otherWindow.once('ready-to-show',() => {
    mainWindow.webContents.postMessage('port', null, [port2])
  })
  mainWindow.loadFile(path.join(__dirname, 'views/main.html'));
  otherWindow.loadFile(path.join(__dirname, 'views/other.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  otherWindow.webContents.openDevTools();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
