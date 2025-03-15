import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Search for files in Windows-compatible way 
 */
export async function findFiles(pattern: string, directory: string = '.', maxResults: number = 20): Promise<string[]> {
  // Use PowerShell to find files (Windows compatible)
  const command = `powershell -Command "Get-ChildItem -Path '${directory}' -Recurse -File | Where-Object { $_.Name -like '*${pattern}*' } | Select-Object -First ${maxResults} | ForEach-Object { $_.FullName }"`;
  
  try {
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      throw new Error(stderr);
    }
    
    return stdout.trim().split('\n').filter(Boolean);
  } catch (error) {
    throw new Error(`Error searching files: ${error}`);
  }
}

/**
 * Get file type counts in Windows-compatible way
 */
export async function getFileTypeCounts(directory: string = '.'): Promise<string> {
  // Use PowerShell to count file types
  const command = `powershell -Command "Get-ChildItem -Path '${directory}' -Recurse -File | Where-Object { $_.FullName -notlike '*\\node_modules\\*' -and $_.FullName -notlike '*\\.git\\*' } | Group-Object -Property Extension | Sort-Object -Property Count -Descending | ForEach-Object { \\"$($_.Count)\\t$($_.Name)\\" }"`;
  
  try {
    const { stdout } = await execAsync(command);
    return stdout.trim();
  } catch (error) {
    return "Unable to retrieve file type counts";
  }
}

/**
 * Get git repo info in Windows-compatible way
 */
export async function getGitInfo(directory: string = '.'): Promise<string> {
  try {
    const { stdout } = await execAsync('git remote -v', { cwd: directory });
    return stdout.trim();
  } catch (error) {
    return "No git repository detected";
  }
} 