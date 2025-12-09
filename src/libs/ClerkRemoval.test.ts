import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

/**
 * Feature: remove-clerk-dependency, Property 2: Clerk references are removed from source files
 * Validates: Requirements 2.1, 2.4, 2.5, 4.5
 */
describe('Clerk Reference Removal - Property Tests', () => {
  // Helper function to recursively get all files in a directory
  function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = join(dirPath, file);
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        // Skip node_modules, .git, .next, and other build artifacts
        if (!file.startsWith('.') && file !== 'node_modules' && file !== 'coverage' && file !== 'out') {
          arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        }
      } else {
        // Only check source files (ts, tsx, js, jsx, css, json)
        if (file.match(/\.(ts|tsx|js|jsx|css|json)$/)) {
          arrayOfFiles.push(filePath);
        }
      }
    });

    return arrayOfFiles;
  }

  it('should not contain Clerk references in source files', () => {
    const srcDir = join(process.cwd(), 'src');
    const allFiles = getAllFiles(srcDir);

    // Filter out test files since they may reference Clerk in test descriptions
    const sourceFiles = allFiles.filter(file => !file.includes('.test.') && !file.includes('.spec.'));

    fc.assert(
      fc.property(
        fc.constantFrom(...sourceFiles),
        (filePath) => {
          const content = readFileSync(filePath, 'utf-8');

          // Check for various forms of "Clerk"
          const clerkPatterns = [
            /\bclerk\b/i, // Word boundary to avoid false positives
            /CLERK_/, // Environment variable pattern
            /clerk\.com/i, // URL pattern
          ];

          const matches = clerkPatterns.some(pattern => pattern.test(content));

          if (matches) {
            // Provide helpful error message
            const matchedPattern = clerkPatterns.find(pattern => pattern.test(content));
            throw new Error(
              `Found Clerk reference in ${filePath}. Pattern: ${matchedPattern}`,
            );
          }

          return true;
        },
      ),
      { numRuns: Math.max(sourceFiles.length, 100) }, // Run at least 100 times or once per file
    );
  });

  it('should not contain Clerk references in marketing content', () => {
    // Specifically test marketing files
    const marketingFiles = [
      join(process.cwd(), 'src/components/Sponsors.tsx'),
      join(process.cwd(), 'src/app/[locale]/(marketing)/page.tsx'),
    ];

    marketingFiles.forEach((filePath) => {
      try {
        const content = readFileSync(filePath, 'utf-8');

        // Check for Clerk references
        expect(content).not.toMatch(/\bclerk\b/i);
        expect(content).not.toMatch(/clerk\.com/i);
        expect(content).not.toContain('Clerk');
      } catch (error) {
        // File might not exist, which is fine
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error;
        }
      }
    });
  });

  it('should not contain Clerk CSS layer references', () => {
    const cssFiles = [
      join(process.cwd(), 'src/styles/global.css'),
    ];

    cssFiles.forEach((filePath) => {
      try {
        const content = readFileSync(filePath, 'utf-8');

        // Check for Clerk in CSS layers
        expect(content).not.toMatch(/clerk/i);
      } catch (error) {
        // File might not exist, which is fine
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error;
        }
      }
    });
  });
});
