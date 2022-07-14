# Adapter

```mermaid
flowchart LR
  A[Client] -- "get(a)" --> B[Adapter]
  B -- "getLibMethod(a)" --> C[Library]
```
