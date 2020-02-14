const {app, BrowserWindow, Menu, shell, dialog, ipcMain} = require('electron')
const path = require('path');
const fs = require('fs');
const openAboutWindow = require('about-window').default

let mainWindow
global.data = {
  "filename": null,
  "options": [
    {"type":"file","name":"image"},
    {"type":"text","name":"name"},
    {"type":"text","name":"where"}
  ],
  "paintings": [
//    {"name":"Test1", "where":"Over The Rainbow"}
  ]
}

ipcMain.on( "setGlobalPaint", ( event, myGlobalVariable ) => {
  global.data.paintings = myGlobalVariable;
} );

function createWindow () {
  var menu = Menu.buildFromTemplate([
    {
      label: 'Arter',
      submenu: [
        {label:'About', click(){openAboutWindow({icon_path:path.join(__dirname, 'icon.png'),package_json_dir:__dirname,open_devtools:false})},accelerator:"CmdOrCtrl+Alt+Shift+?"},
        {label:'Quit', click(){app.quit()},accelerator:"CmdOrCtrl+Q"}
      ]
    },
    {
      label: 'File',
      submenu: [
        {label:'New', click(){newFile()},accelerator:"CmdOrCtrl+N"},
        {label:'Open', click(){openFile()},accelerator:"CmdOrCtrl+O"},
        {label:'Save', click(){saveFile()},accelerator:"CmdOrCtrl+S"},
        {label:'Save As', click(){saveFileAs()},accelerator:"CmdOrCtrl+Shift+S"},
        {label:'Reload', click(){mainWindow.reload()},accelerator:"CmdOrCtrl+R"}
      ]
    },
    {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]
    },
    {
      label: 'Help!',
      submenu: [
        {label:'Report an issue', click(){shell.openExternal("https://github.com/ThatCreeper/arter/issues/new")}},
        {label:'View source code', click(){shell.openExternal("https://github.com/ThatCreeper/arter")}},
        {label:'View issues', click(){shell.openExternal("https://github.com/ThatCreeper/arter/issues")}}
      ]
    }
  ])
  Menu.setApplicationMenu(menu);
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: path.join(__dirname, "icon.png"),
    title: 'Arter',
    titleBarStyle: 'hidden',
    webPreferences: {
        nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.show()
  mainWindow.webContents.openDevTools();
  //mainWindow.setTitle('Arter')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.on('page-title-updated', function(e) {
    e.preventDefault()
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

function openFile(){
  var openPath = dialog.showOpenDialogSync(
    {
      filters: [
        { name: 'Arter Files', extensions: ['arter'] }
      ],
      properties: ['openFile']
    }
  )
  //alert(openPath)
  mainWindow.webContents.openDevTools()
  console.log(openPath)
  if (openPath == undefined) return;
  var data = fs.readFileSync(openPath[0],{encoding:"utf8"});
  console.log(data)
  global.data = JSON.parse(data)
  global.data.filename = openPath[0]
  mainWindow.webContents.send("regen")
}

function saveFileAs(){
  var savePath = dialog.showSaveDialogSync(
  {
    filters: [
      {name:'Arter Files', extensions: ['arter']}
    ]
  })
  if (savePath == undefined) return;
  if (savePath.substr(savePath.length-6).toLowerCase()==".arter"){
    global.data.filename = savePath
  } else {
    global.data.filename = savePath+'.arter';
  }
  console.log(savePath)
  fs.writeFileSync(global.data.filename,JSON.stringify(global.data))
}

function saveFile() {
  if (global.data.filename == null) {
    saveFileAs()
    return;
  }
  fs.writeFileSync(global.data.filename,JSON.stringify(global.data))
}
