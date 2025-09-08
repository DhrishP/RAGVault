# RAGVault

Want to keep your passwords and private data secure in a local vector database, and query it all with a simple command? RAGVault is the tool for you.

## Platform Compatibility

RAGVault is **fully cross-platform compatible** and supports:

- 🐧 **Linux** (tested on Ubuntu, Debian, CentOS, Fedora)
- 🍎 **macOS** (tested on Intel and Apple Silicon)
- 🪟 **Windows** (tested on Windows 10/11)

## Requirements

- **Node.js 18+** 
- **npm 8+**
- **Docker** (for ChromaDB database)

## Installation

### Quick Install (All Platforms)

```bash
npm i -g ragvault
```

### Platform-Specific Installation Scripts

**Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/DhrishP/RAGVault/main/scripts/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iwr -useb https://raw.githubusercontent.com/DhrishP/RAGVault/main/scripts/install.ps1 | iex
```

### Manual Installation

1.  **Install Node.js 18+:**
    - **Windows:** Download from [nodejs.org](https://nodejs.org/) or use `winget install OpenJS.NodeJS`
    - **macOS:** Use Homebrew: `brew install node` or download from [nodejs.org](https://nodejs.org/)
    - **Linux:** Use your package manager or [NodeSource repository](https://github.com/nodesource/distributions)

2.  **Install Docker:**
    - **Windows:** [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
    - **macOS:** [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
    - **Linux:** [Docker Engine](https://docs.docker.com/engine/install/) or [Docker Desktop for Linux](https://docs.docker.com/desktop/install/linux-install/)

3.  **Install RAGVault:**
    ```bash
    npm i -g ragvault
    ```

4.  **Verify Installation:**
    ```bash
    ragvault --version
    npm run test:platform  # Check platform compatibility
    ```

**NOTE:** Please use `npm` for installation. While other package managers like `pnpm` or `bun` might work, `ragvault` is only tested and verified with `npm`.

## Usage

1.  **Ensure Docker is running:**
    - **Windows:** Start Docker Desktop
    - **macOS:** Start Docker Desktop
    - **Linux:** Start Docker service: `sudo systemctl start docker`

2.  **Run the application:**
    ```bash
    ragvault
    ```

RAGVault automatically starts the required ChromaDB database in the background.

## Features

*   **Secure Local Storage:** Saves your data in a local ChromaDB vector database.
*   **Persistent Sessions:** Keeps your user session stored in a local `session.json` file.
*   **Conversation History:** Remembers your past conversations for context, including follow-up questions for both local and remote LLMs.
*   **Flexible LLM Options:**
    *   **Local LLM:** A lightweight option that runs directly on your machine, perfect for lower-end PCs.
    *   **Remote LLMs:** Integrate with powerful models from OpenAI, Anthropic (Claude), and Google (Gemini) using your own API keys for more advanced answers.
*   **Data Import/Export:** Add data to your local brain directly from `.pdf`, `.txt`, and `.md` files, and export your data when needed.

## Troubleshooting

### Common Cross-Platform Issues

**Docker Not Starting:**
- **Windows:** Ensure Docker Desktop is installed and running, check Windows Subsystem for Linux (WSL2) is enabled
- **macOS:** Check Docker Desktop is running and has proper permissions
- **Linux:** Ensure Docker daemon is running: `sudo systemctl status docker`

**Permission Errors:**
- **Windows:** Run PowerShell as Administrator for global npm installs
- **macOS/Linux:** Use `sudo` for global npm installs if needed: `sudo npm i -g ragvault`

**Path Issues:**
- Ensure Node.js and npm are in your system PATH
- Restart your terminal after installation

**ChromaDB Connection Issues:**
- Check if port 8765 is available: `netstat -an | grep 8765` (Linux/macOS) or `netstat -an | findstr 8765` (Windows)
- Ensure Docker has sufficient resources allocated

### Platform-Specific Data Locations

RAGVault stores your data in platform-appropriate locations:

- **Windows:** `%APPDATA%\ragvault\`
- **macOS:** `~/Library/Application Support/ragvault/`
- **Linux:** `~/.ragvault/`

### Development Setup

For developers wanting to contribute or build from source:

```bash
git clone https://github.com/DhrishP/RAGVault.git
cd RAGVault
npm run setup  # Cross-platform development setup
```

## What's Next?

Here are some features currently under development:

*   Support for more embedding models from various AI providers.
