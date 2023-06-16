const { ipcRenderer,contextBridge } = require("electron");
ipcRenderer.on('port', e => {
    window.electronMessagePort = e.ports[0]
    console.log(e.ports[0]);
    window.electronMessagePort.onmessage = messageEvent => {
        console.log(messageEvent.data);
    }
})