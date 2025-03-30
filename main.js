
const {BrowserWindow, app, Menu, Tray} = require("electron");

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width:"800",
        height:"600",
        icon:"./icon.png",
        webPreferences:{
            nodeIntegration:false
        },
    });
    mainWindow.loadURL("http://localhost:5173");

    const menuTemplate = [
        {
            label:"File",
            submenu:[
                {
                    label:"Exit",
                    role:"close"
                }
            ]
        }
    ]
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    mainWindow.maximize();
});
app.on("window-all-closed", () => {
    if(process.platform != "darwin") {
        app.quit();
    }
})