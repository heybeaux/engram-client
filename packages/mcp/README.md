# @openengram/mcp

MCP server for [Engram](https://openengram.ai) — gives AI assistants `remember`, `recall`, `forget`, `get_memory`, and `memory_stats` tools over the Engram API.

## Install

```bash
npm install -g @openengram/mcp
```

## Usage

```bash
ENGRAM_BASE_URL=https://your-engram-instance.com \
ENGRAM_API_KEY=your-api-key \
ENGRAM_USER_ID=your-user-id \
engram-mcp
```

### Claude Desktop config example

```json
{
  "mcpServers": {
    "engram": {
      "command": "engram-mcp",
      "env": {
        "ENGRAM_BASE_URL": "https://your-engram-instance.com",
        "ENGRAM_API_KEY": "your-api-key",
        "ENGRAM_USER_ID": "your-user-id"
      }
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `remember` | Store a new memory |
| `recall` | Semantic search across memories |
| `forget` | Delete a memory by ID |
| `get_memory` | Retrieve a single memory by ID |
| `memory_stats` | Return store statistics |

## Programmatic use

```typescript
import { createEngramMcpServer } from '@openengram/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = createEngramMcpServer({
  baseUrl: 'https://your-engram-instance.com',
  apiKey: 'your-api-key',
  userId: 'your-user-id',
});

await server.connect(new StdioServerTransport());
```
