Well , want to keep your passwords , data privately in your local vector DB and query it by just opening as simple as a `npx` command. Well RAGVault does it for you

Steps to use it:

1. Download ChromaDB docker container
2. run it in port 8000
   and...

```node
npx ragvault
```

What it does:

1. Saves your data in your chromaDB vector DB
2. Saves your session in session.json file
3. Saves your history
4. Can ask question using LocalLLM (for low-end pc) or for more better asnwer you can go for remote-LLM using their API keys

Currently Building🔨:

1. Supports for different embedding models from different AI providers
2. History for remote LLM (followup history)
3. Removing sdk's of AI providers from codebase and using their urls instead

docker running command:

`docker run -d --name chromadb -p 8000:8000 chromadb/chroma`

**NOTE** : THE PORT SHOULD BE KEPT **_8000_**
