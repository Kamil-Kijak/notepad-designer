
const {BrowserWindow, app, Menu, ipcMain} = require("electron");
const path = require("path");
const fs = require("fs");

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width:"800",
        height:"600",
        icon:"./icon.png",
        webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            preload:path.join(__dirname, 'preload.js')
        },
    });
    mainWindow.loadURL("http://localhost:5173");

    const menuTemplate = [
        {
            label:"File",
            submenu:[
                {
                    type:"separator"
                },
                {
                    label:"Logout",
                    click: () => {
                        mainWindow.webContents.send("logout");
                    },
                    accelerator: ''
                },
                {
                    label:"Exit",
                    role:"close"
                }
            ]
        }
    ]
    //mainWindow.webContents.openDevTools();
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    mainWindow.maximize();
});
ipcMain.on("save-data", (event, message) => {
    const {fileName, content} = message;
    const savePath = path.join(app.getPath("userData"), fileName);
    fs.writeFileSync(savePath, JSON.stringify(content));
});
ipcMain.on("load-data", (event, message) => {
    const {fileName} = message;
    const loadPath = path.join(app.getPath("userData"), fileName);
    if(fs.existsSync(loadPath)) {
        try {
            const data = fs.readFileSync(loadPath, "utf-8");
            const parsedData = JSON.parse(data); 
            event.reply("loaded-data", parsedData);
        } catch (err) {
            event.reply("loaded-data", { status: "error" });
        }
    } else {
        event.reply("loaded-data", {
            "status":"error"
        });
    }
});
app.on("window-all-closed", () => {
    if(process.platform != "darwin") {
        app.quit();
    }
})