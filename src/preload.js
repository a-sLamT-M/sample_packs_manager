const { contextBridge, ipcRenderer } = window.require('electron')

window.ipcRenderer = ipcRenderer

contextBridge.exposeInMainWorld('ipc', {
  startdrag: (fileName) => {
    ipcRenderer.send('ondragstart', fileName)
  }
})
