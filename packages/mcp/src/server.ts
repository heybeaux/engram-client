import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { EngramClient } from '@openengram/client';

export interface EngramMcpConfig {
  baseUrl: string;
  apiKey: string;
  userId: string;
  /** Server name shown to MCP clients. Defaults to "engram". */
  serverName?: string;
}

const LAYER_ENUM = ['SESSION', 'SEMANTIC', 'CORE', 'META'] as const;

export function createEngramMcpServer(config: EngramMcpConfig): McpServer {
  const client = new EngramClient({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
    userId: config.userId,
  });

  const server = new McpServer({
    name: config.serverName ?? 'engram',
    version: '0.1.0',
  });

  server.tool(
    'remember',
    'Store a new memory in Engram.',
    {
      text: z.string().describe('The content to remember'),
      layer: z.enum(LAYER_ENUM).optional().describe('Memory layer (SESSION, SEMANTIC, CORE, META)'),
      tags: z.array(z.string()).optional().describe('Optional tags for the memory'),
      importance: z.number().min(0).max(1).optional().describe('Importance score 0–1'),
    },
    async ({ text, layer, tags, importance }) => {
      const memory = await client.remember(text, { layer, tags, importance });
      return {
        content: [{ type: 'text', text: `Stored memory ${memory.id}` }],
      };
    }
  );

  server.tool(
    'recall',
    'Search Engram for memories matching a semantic query.',
    {
      query: z.string().describe('Natural language query to search memories'),
      limit: z.number().int().min(1).max(100).optional().default(10).describe('Max results to return'),
      layers: z.array(z.enum(LAYER_ENUM)).optional().describe('Restrict recall to specific layers'),
      minImportance: z.number().min(0).max(1).optional().describe('Minimum importance threshold'),
    },
    async ({ query, limit, layers, minImportance }) => {
      const memories = await client.recall(query, { limit, layers, minImportance });
      if (memories.length === 0) {
        return { content: [{ type: 'text', text: 'No memories found.' }] };
      }
      const text = memories
        .map((m, i) => `[${i + 1}] (${m.layer}) ${m.raw}`)
        .join('\n');
      return { content: [{ type: 'text', text }] };
    }
  );

  server.tool(
    'forget',
    'Delete a memory from Engram by ID.',
    {
      id: z.string().describe('Memory ID to delete'),
    },
    async ({ id }) => {
      await client.forget(id);
      return { content: [{ type: 'text', text: `Deleted memory ${id}` }] };
    }
  );

  server.tool(
    'get_memory',
    'Retrieve a single memory by ID.',
    {
      id: z.string().describe('Memory ID'),
    },
    async ({ id }) => {
      const m = await client.get(id);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(m, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'memory_stats',
    'Return statistics about the current Engram memory store.',
    {},
    async () => {
      const stats = await client.stats();
      return {
        content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }],
      };
    }
  );

  return server;
}
