# RAGVault

Want to keep your passwords and private data secure in a local vector database, and query it all with a simple command? RAGVault is the tool for you.

## How to Use

1.  **Install RAGVault globally:**
    ```bash
    npm i -g ragvault
    ```

2.  **Start the ChromaDB Docker container:**
    RAGVault requires a running instance of ChromaDB.
    ```bash
    docker run -d --name chromadb -p 8765:8000 chromadb/chroma
    ```
    **NOTE**: The port must be kept as `8765`.

3.  **Run the application:**
    Once installed, you can run it from anywhere in your terminal.
    ```bash
    ragvault
    ```

## Features

*   **Secure Local Storage:** Saves your data in a local ChromaDB vector database.
*   **Persistent Sessions:** Keeps your user session stored in a local `session.json` file.
*   **Conversation History:** Remembers your past conversations for context.
*   **Flexible LLM Options:**
    *   **Local LLM:** A lightweight option that runs directly on your machine, perfect for lower-end PCs.
    *   **Remote LLMs:** Integrate with powerful models from OpenAI, Anthropic (Claude), and Google (Gemini) using your own API keys for more advanced answers.
*   **File Ingestion:** Add data to your local brain directly from `.pdf`, `.txt`, and `.md` files.

## What's Next?

Here are some features currently under development:

*   Support for more embedding models from various AI providers.
*   Follow-up conversation history for Remote LLMs.
*   Data import and export functionality.
