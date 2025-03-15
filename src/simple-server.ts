/**
 * Simple MCP server example
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

async function main() {
  // Create a simple MCP server
  const server = new McpServer({
    name: "Simple MCP Server",
    version: "1.0.0",
    description: "A simple MCP server example"
  });

  // Add a simple echo tool
  server.tool(
    "echo",
    {
      message: z.string().describe("Message to echo back")
    },
    async ({ message }) => {
      return {
        content: [{ type: "text", text: `Echo: ${message}` }]
      };
    }
  );

  // Start the server with stdio transport
  console.log("Starting Simple MCP Server...");
  const transport = new StdioServerTransport();
  server.listen(transport);
}

main().catch(error => {
  console.error("Error running MCP server:", error);
  process.exit(1);
}); 