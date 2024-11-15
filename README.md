# Redis Management Electron App

A simple Electron-based application to manage Redis instances in a Kubernetes environment. The app allows users to:

- View all available namespaces.
- Select a namespace and check the number of keys in Redis.
- Clear (flush) Redis keys for the selected namespace.
- Refresh the key count to verify changes.

---

## Features

- **Namespace Management**: Lists all namespaces and allows the user to select one.
- **Redis Key Count**: Displays the current number of keys in Redis for the selected namespace.
- **Flush Redis**: Clears all keys in Redis with a single click.
- **Refresh**: Updates the key count after changes.

---

## Installation

### Prerequisites

- **Node.js**: Install [Node.js](https://nodejs.org) (version 18 or later).
- **npm**: Comes with Node.js installation.
- **Kubernetes Configuration**:
  - Ensure you have GKE auth plugin installed `gcloud components install gke-gcloud-auth-plugin`.
  - Ensure you have kubectl installed `gcloud components install kubectl`.
  - Ensure you have a valid Kubernetes configuration (`~/.kube/config`).
  - Authenticate using `gcloud auth` and ensure you have access to your Kubernetes cluster.

---

### Steps to Install

1. **Clone the Repository**
   ```bash
   git clone <https://github.com/Sahstiva/redis-flush-app>
   cd redis-flush-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Environment Variables**
   Update the configuration in `.env` if needed:
    - `REDIS_POD`: The name of the Redis pod in the Kubernetes cluster.
    - `CONTAINER`: The Redis container name within the pod.
    - `ALLOWED_NAMESPACES`: The list of namespaces where Redis management is allowed

---

## Usage

1. **Run the Application**
   ```bash
   npm start
   ```

2. **User Interface**
    - **Namespace Dropdown**: Select a namespace to manage.
    - **Keys in Redis**: View the current number of keys in Redis for the selected namespace.
    - **Refresh Button**: Fetch the latest count of keys in Redis.
    - **Clear Button**: Flush all keys in Redis.
    - **Exit Button**: Close the application.

---

## Example Output

### Upon Start:
1. Application fetches namespaces and selects the first one by default.
2. Displays the number of keys in Redis for the selected namespace.

### Operations:
- Selecting a different namespace updates the key count.
- Clicking "Clear" flushes all keys and refreshes the count.
- Clicking "Refresh" updates the count without clearing keys.

---

## Development

### Directory Structure
```plaintext
redis-flush-app/
├── .env            # Configuration file (doesn't included to git)
├── main.js         # Electron main process
├── preload.js      # Preload script for renderer process
├── renderer.js     # Renderer script for UI logic
├── index.html      # Main UI file
├── package.json    # Project metadata and dependencies
└── README.md       # This manual
```

### Scripts

- **Start the Application**:
  ```bash
  npm start
  ```

---

- **Build the Application (Optional)**:
  To package the application for distribution, use a bundler like `electron-builder`. Install it and run:
  ```bash
  npm install --save-dev electron-builder
  npm run build
  ```

---

## Building the Application

To build the application for distribution, you can use the provided scripts in `package.json`:

1. **macOS (Intel-based)**:
   ```bash
   npm run dist:mac-intel
   ```

2. **macOS (ARM-based)**:
   ```bash
   npm run dist:mac-arm
   ```

3. **Windows**:
   ```bash
   npm run dist:windows
   ```

4. **All Platforms**:
   ```bash
   npm run dist
   ```

The application will be built and saved in the `dist` folder for distribution. You can distribute the installer for each platform or provide a portable version of the app.

---

## Dependencies

- **Electron**: Desktop application framework.
- **@google-cloud/container**: Interacts with Google Kubernetes Engine (GKE).
- **@kubernetes/client-node**: Communicates with the Kubernetes cluster.
- **Bootstrap**: Provides a professional UI.

---

## Troubleshooting

1. **No Namespaces Found**:
    - Ensure your `~/.kube/config` is set up correctly.
    - Verify your Kubernetes cluster credentials using:
      ```bash
      kubectl config view
      ```

2. **Error Fetching Redis Keys**:
    - Ensure the Redis pod name (`REDIS_POD`) and namespace are correct.
    - Confirm you have permissions to execute commands in the Redis pod.

3. **Google Cloud Authentication**:
    - Ensure you have authenticated with Google Cloud:
      ```bash
      gcloud auth login
      gcloud auth application-default login
      ```

---

## License

This project is licensed under the MIT License.
