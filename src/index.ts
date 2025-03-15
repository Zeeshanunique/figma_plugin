import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { findFiles, getFileTypeCounts, getGitInfo } from './windows-compat.js';
import { VERSION } from './version.js';

const execAsync = promisify(exec);

/**
 * Cursor IDE MCP Server
 * 
 * This server provides tools that can be used from within Cursor IDE via chat interface
 */
async function main() {
  // Create an MCP server with version information
  const server = new McpServer({
    name: VERSION.name,
    version: VERSION.version,
    description: VERSION.description
  });

  console.log(`Starting ${VERSION.name} v${VERSION.version}...`);

  // Add a file search tool
  server.tool(
    "search-files",
    {
      pattern: z.string().describe("The search pattern (glob, regex, or string)"),
      directory: z.string().optional().describe("The directory to search in (defaults to current directory)"),
      maxResults: z.number().optional().describe("Maximum number of results to return")
    },
    async ({ pattern, directory = ".", maxResults = 20 }) => {
      try {
        // Use our Windows-compatible file search
        const files = await findFiles(pattern, directory, maxResults);
        
        return {
          content: [{ 
            type: "text", 
            text: files.length > 0 
              ? `Found ${files.length} files:\n${files.join('\n')}` 
              : "No files found matching that pattern."
          }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error executing search: ${error}` }],
          isError: true
        };
      }
    }
  );

  // Add a code completion suggestion tool
  server.tool(
    "suggest-code",
    {
      context: z.string().describe("Current code context where the suggestion is needed"),
      language: z.string().describe("Programming language of the code")
    },
    async ({ context, language }) => {
      // In a real implementation, this might call an actual code completion API
      // For this example, we'll return a placeholder message
      return {
        content: [{ 
          type: "text", 
          text: `This is where code suggestions for ${language} would appear based on the provided context.` 
        }]
      };
    }
  );

  // Add file reading tool
  server.tool(
    "read-file",
    {
      path: z.string().describe("Path to the file to read"),
      lines: z.string().optional().describe("Line range to read, e.g., '1-10' (optional, reads entire file if omitted)")
    },
    async ({ path: filePath, lines }) => {
      try {
        if (!fs.existsSync(filePath)) {
          return {
            content: [{ type: "text", text: `File not found: ${filePath}` }],
            isError: true
          };
        }

        let content = fs.readFileSync(filePath, 'utf8');
        
        // If line range is specified, extract only those lines
        if (lines) {
          const allLines = content.split('\n');
          const [start, end] = lines.split('-').map(num => parseInt(num.trim(), 10));
          
          if (!isNaN(start) && !isNaN(end) && start > 0 && start <= end) {
            // Convert from 1-indexed to 0-indexed
            content = allLines.slice(start - 1, end).join('\n');
          }
        }

        return {
          content: [{ 
            type: "text", 
            text: `Content of ${filePath}:\n\n\`\`\`\n${content}\n\`\`\`` 
          }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error reading file: ${error}` }],
          isError: true
        };
      }
    }
  );

  // Add run command tool
  server.tool(
    "run-command",
    {
      command: z.string().describe("Command to run"),
      cwd: z.string().optional().describe("Working directory (optional, uses current directory if omitted)")
    },
    async ({ command, cwd = "." }) => {
      try {
        const { stdout, stderr } = await execAsync(command, { cwd });
        
        const outputText = stdout || "Command executed successfully with no output.";
        const errorText = stderr ? `\n\nErrors/Warnings:\n${stderr}` : "";
        
        return {
          content: [{ 
            type: "text", 
            text: `Command: ${command}\n\nOutput:\n${outputText}${errorText}` 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Error executing command: ${error}` 
          }],
          isError: true
        };
      }
    }
  );

  // Add get project info tool
  server.tool(
    "project-info",
    {
      directory: z.string().optional().describe("Project directory (optional, uses current directory if omitted)")
    },
    async ({ directory = "." }) => {
      try {
        let info = "";
        
        // Check for package.json
        const packageJsonPath = path.join(directory, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          info += `Project: ${packageJson.name || "Unknown"}\n`;
          info += `Version: ${packageJson.version || "Unknown"}\n`;
          info += `Description: ${packageJson.description || "None"}\n\n`;
          
          if (packageJson.dependencies || packageJson.devDependencies) {
            info += "Dependencies:\n";
            
            if (packageJson.dependencies) {
              Object.entries(packageJson.dependencies).forEach(([name, version]) => {
                info += `- ${name}: ${version}\n`;
              });
            }
            
            if (packageJson.devDependencies) {
              info += "\nDev Dependencies:\n";
              Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
                info += `- ${name}: ${version}\n`;
              });
            }
          }
        } else {
          info += "No package.json found.\n";
        }
        
        // Get git info using Windows-compatible function
        const gitInfo = await getGitInfo(directory);
        if (gitInfo) {
          info += "\nGit Repositories:\n" + gitInfo;
        } else {
          info += "\nNo git repository detected.\n";
        }
        
        // Get file type counts using Windows-compatible function
        const fileTypeCounts = await getFileTypeCounts(directory);
        if (fileTypeCounts) {
          info += "\nFile types (excluding node_modules and .git):\n" + fileTypeCounts;
        }
        
        return {
          content: [{ type: "text", text: info }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error getting project info: ${error}` }],
          isError: true
        };
      }
    }
  );

  // Add a file editing tool
  server.tool(
    "edit-file",
    {
      path: z.string().describe("Path to the file to edit"),
      content: z.string().describe("New content for the file"),
      createIfNotExists: z.boolean().optional().describe("Create the file if it doesn't exist (defaults to false)")
    },
    async ({ path: filePath, content, createIfNotExists = false }) => {
      try {
        const fileExists = fs.existsSync(filePath);
        
        if (!fileExists && !createIfNotExists) {
          return {
            content: [{ type: "text", text: `File not found: ${filePath}` }],
            isError: true
          };
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        
        return {
          content: [{ 
            type: "text", 
            text: fileExists 
              ? `File ${filePath} has been updated.`
              : `File ${filePath} has been created.`
          }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error editing file: ${error}` }],
          isError: true
        };
      }
    }
  );

  // Add a semantic search resource
  server.resource(
    "code-search",
    new ResourceTemplate("search://{query}", { list: undefined }),
    async (uri, { query }) => {
      try {
        // In a real implementation, this would perform semantic search over the codebase
        // For this example, we'll just return a mock response
        return {
          contents: [{
            uri: uri.href,
            text: `Results for semantic search "${query}":\n\n` +
                  `1. example.ts:42 - function matches(${query}): boolean\n` +
                  `2. utils/helpers.ts:128 - // This helper handles ${query} processing\n` +
                  `3. src/components/Widget.tsx:215 - const ${query}Results = useMemo(...)`
          }]
        };
      } catch (error) {
        return {
          contents: [{
            uri: uri.href,
            text: `Error performing semantic search: ${error}`
          }]
        };
      }
    }
  );

  // Add a documentation search resource
  server.resource(
    "api-docs",
    new ResourceTemplate("docs://{topic}", { list: undefined }),
    async (uri, { topic }) => {
      // In a real implementation, this would fetch documentation for the topic
      return {
        contents: [{
          uri: uri.href,
          text: `Documentation for ${topic}:\n\n` +
                `This is a placeholder for actual documentation content about ${topic}.`
        }]
      };
    }
  );

  // Add a prompt template for code refactoring
  server.prompt(
    "refactor-code",
    `You are an expert software engineer specializing in code refactoring.
Your task is to refactor the following code to improve its:
- Readability
- Maintainability
- Performance (where applicable)
- Adherence to best practices

Here's the code to refactor:
{codeToRefactor}

Consider the following aspects when refactoring:
1. Variable and function naming
2. Code structure and organization
3. Removing redundancy and duplication
4. Optimizing logic and algorithms
5. Error handling
6. Documentation and comments
7. Design patterns (if applicable)

Language: {language}
Additional context: {context}

Provide the refactored code along with a brief explanation of the changes made and the benefits they bring.`,
    // Define the parameters for this prompt template
    {
      codeToRefactor: z.string().describe("The code that needs to be refactored"),
      language: z.string().describe("The programming language of the code"),
      context: z.string().optional().describe("Additional context about the code or requirements")
    }
  );

  // Start the server with stdio transport
  console.log("Server ready. Waiting for connections...");
  const transport = new StdioServerTransport();
  server.listen(transport);
}

main().catch(error => {
  console.error("Error running MCP server:", error);
  process.exit(1);
}); 