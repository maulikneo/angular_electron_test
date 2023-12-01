const { app, BrowserWindow ,desktopCapturer} = require('electron');
const path = require('path');
const fs = require('fs');
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load your Angular app from http://localhost:4200
  win.loadURL('C:/Users/786as/OneDrive/Documents/electron/electron/dist/my-first-project/index.html');

  // Open the DevTools (remove this line for production)
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
  setInterval(()=>{
    captureDesktop()
  },10000)
  
}

function captureDesktop() {
    desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 800, height: 600 } })
      .then(sources => {
        if (sources.length > 0) {
            console.log("success")
          const source = sources[0];
          const screenshotPath =path.join(__dirname, 'screenshorts/'+new Date().getTime()+'screenshot.png');
          fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
            if (error) {
              console.error('Error saving screenshot:', error);
            } else {
              win.webContents.send('screenshot', screenshotPath);
            }
          });
        }
      })
      .catch(error => {
        console.error('Error capturing desktop:', error);
      });
  }

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) createWindow();
});
