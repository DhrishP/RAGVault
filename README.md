Well , want to keep your passwords , data privately in your local vector DB and query it by just opening as simple as a `npx` command. Well RAGVault does it for you

Steps to use it:
1. Download ChromaDB docker container 
2. run it in port 8000
and...
```node
npx ragvault
```

Currently Building🔨:
1. Supports for PDF/DOCX Documents
2. Supports for different embedding models from different AI providers
3. Proper querying of data

docker running command:

```docker run -d --name chromadb -p 8000:8000 chromadb/chroma```

**NOTE** : THE PORT SHOULD BE KEPT ***8000***
