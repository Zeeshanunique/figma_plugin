import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Windows compatibility functions for file operations
 * These functions provide Windows-compatible alternatives to Unix commands
 */

/**
 * Find files matching a pattern in a directory
 * Windows-compatible version using PowerShell commands
 */
export async function findFiles(pattern: string, directory: string = '.', maxResults: number = 20): Promise<string[]> {
  try {
    // Use PowerShell to find files on Windows
    if (process.platform === 'win32') {
      // Escape quotes in the pattern
      const escapedPattern = pattern.replace(/"/g, '`"');
      
      // PowerShell command to find files
      const command = `powershell -Command "Get-ChildItem -Path '${directory}' -Recurse -File | Where-Object { $_.Name -like '*${escapedPattern}*' } | Select-Object -First ${maxResults} | ForEach-Object { $_.FullName }"`;
      
      const { stdout } = await execAsync(command);
      return stdout.trim().split('\n').filter(line => line.trim() !== '');
    } else {
      // Use find on Unix systems
      const command = `find "${directory}" -type f -name "*${pattern}*" | head -n ${maxResults}`;
      const { stdout } = await execAsync(command);
      return stdout.trim().split('\n').filter(line => line.trim() !== '');
    }
  } catch (error) {
    console.error('Error finding files:', error);
    return [];
  }
}

/**
 * Get information about file types in a directory
 * Windows-compatible version
 */
export async function getFileTypeCounts(directory: string = '.'): Promise<string> {
  try {
    // Use PowerShell to count file types on Windows
    if (process.platform === 'win32') {
      const command = `powershell -Command "Get-ChildItem -Path '${directory}' -Recurse -File | Where-Object { $_.FullName -notlike '*\\node_modules\\*' -and $_.FullName -notlike '*\\.git\\*' } | Group-Object Extension | Sort-Object Count -Descending | Select-Object Name, Count | ForEach-Object { $_.Name + ': ' + $_.Count }"`;
      
      const { stdout } = await execAsync(command);
      return stdout.trim();
    } else {
      // Use find and awk on Unix systems
      const command = `find "${directory}" -type f -not -path "*/node_modules/*" -not -path "*/.git/*" | awk -F. '{print $NF}' | sort | uniq -c | sort -nr | awk '{print $2 ": " $1}'`;
      const { stdout } = await execAsync(command);
      return stdout.trim();
    }
  } catch (error) {
    console.error('Error getting file type counts:', error);
    return 'Error getting file type information';
  }
}

/**
 * Get Git repository information
 * Windows-compatible version
 */
export async function getGitInfo(directory: string = '.'): Promise<string> {
  try {
    // Check if .git directory exists
    const gitDir = path.join(directory, '.git');
    if (!fs.existsSync(gitDir)) {
      return '';
    }
    
    // Commands to run
    const commands = [
      'git remote -v',
      'git branch',
      'git log -1 --oneline'
    ];
    
    let result = '';
    
    for (const cmd of commands) {
      try {
        const { stdout } = await execAsync(cmd, { cwd: directory });
        if (stdout.trim()) {
          result += `${cmd}:\n${stdout.trim()}\n\n`;
        }
      } catch (cmdError) {
        // Skip failed commands
      }
    }
    
    return result.trim();
  } catch (error) {
    console.error('Error getting git info:', error);
    return '';
  }
} 