const {app, BrowserWindow, Menu, shell, dialog} = require('electron')
const path = require('path');
const fs = require('fs');
let mainWindow
global.data = {
  "filename": null,
  "options": [
    {"type":"text","name":"name"},
    {"type":"text","name":"where"}
  ],
  "paintings": [
    {"name":"Test1", "where":"Over The Rainbow"}
  ]
}

function createWindow () {
  var menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {label:'New', click(){newFile()}},
        {label:'Open', click(){openFile()}},
        {label:'Save', click(){saveFile()}},
        {label:'Save As', click(){saveFileAs()}},
        {label:'Exit', click(){app.quit()}},
        {label:'Reload', click(){mainWindow.reload()}}
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
    //icon: path.join(__dirname, "icon.png"),
    webPreferences: {
        nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html')
  //mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null
  })
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