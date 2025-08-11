# RAGVault

Want to keep your passwords and private data secure in a local vector database, and query it all with a simple command? RAGVault is the tool for you.

## How to Use

1.  **Install RAGVault globally:**
    ```bash
    npm i -g ragvault
    ```
    **NOTE:** Please use `npm` for installation. While other package managers like `pnpm` or `bun` might work, `ragvault` is only tested and verified with `npm`.

2.  **Ensure Docker is running:**
    RAGVault automatically starts the required ChromaDB database in the background, but you need to have Docker running on your system.

3.  **Run the application:**
    Once installed, you can run it from anywhere in your terminal.
    ```bash
    ragvault
    ```

## Features

*   **Secure Local Storage:** Saves your data in a local ChromaDB vector database.
*   **Persistent Sessions:** Keeps your user session stored in a local `session.json` file.
*   **Conversation History:** Remembers your past conversations for context, including follow-up questions for both local and remote LLMs.
*   **Flexible LLM Options:**
    *   **Local LLM:** A lightweight option that runs directly on your machine, perfect for lower-end PCs.
    *   **Remote LLMs:** Integrate with powerful models from OpenAI, Anthropic (Claude), and Google (Gemini) using your own API keys for more advanced answers.
*   **Data Import/Export:** Add data to your local brain directly from `.pdf`, `.txt`, and `.md` files, and export your data when needed.

## What's Next?

Here are some features currently under development:

*   Support for more embedding models from various AI providers.
