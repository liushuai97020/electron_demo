// elsewhere in your code to send a message to the other renderers message handler
// window.electronMessagePort.postmessage('ping')
window.onmessage = (event) => {
    console.log(event);
    if (event.source === window && event.data === 'port') {
        const [ port ] = event.ports
        console.log(port);
        port.postMessage('ping')
        // 一旦我们有了这个端口，我们就可以直接与主进程通信
        port.onmessage = (event) => {
            console.log('from other process:', event.data)
        }
    }
}