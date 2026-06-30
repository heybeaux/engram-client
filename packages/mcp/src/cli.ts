import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createEngramMcpServer } from './server.js';

const baseUrl = process.env.ENGRAM_BASE_URL;
const apiKey = process.env.ENGRAM_API_KEY;
const userId = process.env.ENGRAM_USER_ID;

if (!baseUrl || !apiKey || !userId) {
  process.stderr.write(
    'engram-mcp: missing required env vars ENGRAM_BASE_URL, ENGRAM_API_KEY, ENGRAM_USER_ID\n'
  );
  process.exit(1);
}

const server = createEngramMcpServer({ baseUrl, apiKey, userId });
const transport = new StdioServerTransport();

server.connect(transport).catch((err: Error) => {
  process.stderr.write(`engram-mcp: fatal: ${err.message}\n`);
  process.exit(1);
});
