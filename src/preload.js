// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer,contextBridge } = require("electron");

const {port1, port2} = new MessageChannel()

port2.postMessage({answer: 42})

ipcRenderer.postMessage('port',null, [port1])

// contextBridge.exposeInMainWorld('electronAPI', {
//     sendPort: (port) => ipcRenderer.postMessage('port', null, port)
// })