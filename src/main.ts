import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as fs from "fs";

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        // Hide the menu bar
        autoHideMenuBar: true,
        webPreferences: {
            allowRunningInsecureContent: false,
            nodeIntegration: false,
            webviewTag: true,
            partition: 'persist:9387f550-0e8c-11e9-ab14-d663bd873d93'
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL("https://www.furaffinity.net/login");

    // Inject the script
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(fs.readFileSync(path.join(__dirname, 'bundle.js'), 'utf8'));
    })
}

app.commandLine.appendSwitch('auto-detect', 'false');
app.commandLine.appendSwitch('no-proxy-server');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
