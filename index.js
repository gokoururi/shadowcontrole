const { app, BrowserWindow  } = require('electron')

function createWindow(width, height, file, parent = null) {
  const win = new BrowserWindow({
    width: width,
    height: height,
    parent: parent,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile(file)
  return win
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.whenReady().then(() => {
  mainWindow = createWindow(1000, 1200, 'index.html')

})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // Unter macOS ist es üblich, für Apps und ihre Menu Bar
  // aktiv zu bleiben, bis der Nutzer explizit mit Cmd + Q die App beendet.
  //if (process.platform !== 'darwin') {
  //  app.quit()
  //}
  app.quit()
})

app.on('activate', () => {
  // Unter macOS ist es üblich ein neues Fenster der App zu erstellen, wenn
  // das Dock Icon angeklickt wird und keine anderen Fenster offen sind.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})