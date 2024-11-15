const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    fetchNamespaces: () => ipcRenderer.invoke('fetch-namespaces'),
    getKeysCount: (namespace) => ipcRenderer.invoke('get-keys-count', namespace),
    flushRedis: (namespace) => ipcRenderer.invoke('flush-redis', namespace),
});
