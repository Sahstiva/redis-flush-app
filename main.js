const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const k8s = require('@kubernetes/client-node');
const { PassThrough, finished } = require('stream');
require('dotenv').config();

const REDIS_POD = process.env.REDIS_POD;
const CONTAINER = process.env.CONTAINER
const ALLOWED_NAMESPACES = process.env.ALLOWED_NAMESPACES;

let mainWindow;

// Kubernetes helper functions
async function getNamespaces() {
    const kubeConfig = new k8s.KubeConfig();
    kubeConfig.loadFromDefault();
    const k8sApi = kubeConfig.makeApiClient(k8s.CoreV1Api);
    const namespaces = await k8sApi.listNamespace();
    return namespaces.body.items.map((ns) => ns.metadata.name).filter(item => ALLOWED_NAMESPACES.includes(item));
}

async function getKeysCount(namespace) {
    const kubeConfig = new k8s.KubeConfig();
    kubeConfig.loadFromDefault();
    const exec = new k8s.Exec(kubeConfig);

    const execRedisCommand = async (command) => {
        return new Promise((resolve, reject) => {
            const stdoutStream = new PassThrough(); // Capture stdout
            const stderrStream = new PassThrough(); // Capture stderr
            let output = '';
            let errorOutput = '';

            // Collect stdout data
            stdoutStream.on('data', (chunk) => {
                console.log('chunk');
                output += chunk.toString();
            });

            // Collect stderr data
            stderrStream.on('data', (chunk) => {
                console.log('error');
                errorOutput += chunk.toString();
            });

            // Use `finished` to ensure all streams are processed
            finished(stdoutStream, (err) => {
                console.log('finished');
                if (err) {
                    reject(new Error(`Stream error: ${err.message}`));
                }
                // Resolve with captured stdout
                setTimeout(() => {
                    resolve(output.trim());
                }, 1000);
            });

            exec.exec(
                namespace,
                REDIS_POD,
                CONTAINER,
                command,
                stdoutStream,
                stderrStream,
                null,
                true,
                (status) => {
                    if (status && status.status !== 'Success') {
                        reject(new Error('Failed to execute Redis command'));
                    }
                }
            );
        });
    };

    const result = await execRedisCommand(['redis-cli', 'DBSIZE']);
    console.log(result);
    return parseInt(result.split(' ')[1], 10) || 0;
}

async function flushRedis(namespace) {
    const kubeConfig = new k8s.KubeConfig();
    kubeConfig.loadFromDefault();
    const exec = new k8s.Exec(kubeConfig);

    await new Promise((resolve, reject) => {
        exec.exec(
            namespace,
            REDIS_POD,
            CONTAINER,
            ['redis-cli', 'FLUSHALL'],
            process.stdout,
            process.stderr,
            null,
            true,
            (status) => {
                if (status && status.status === 'Success') {
                    resolve();
                } else {
                    reject(new Error('Failed to flush Redis'));
                }
            }
        );
    });
}

// Electron setup
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    mainWindow.loadFile('index.html');
});

ipcMain.handle('fetch-namespaces', async () => {
    return await getNamespaces();
});

ipcMain.handle('get-keys-count', async (event, namespace) => {
    return await getKeysCount(namespace);
});

ipcMain.handle('flush-redis', async (event, namespace) => {
    await flushRedis(namespace);
});
