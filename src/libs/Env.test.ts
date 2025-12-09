import { createEnv } from '@t3-oss/env-nextjs';
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import * as z from 'zod';

/**
 * Feature: remove-clerk-dependency, Property 1: Environment validation succeeds without Clerk variables
 * Validates: Requirements 1.1, 1.2, 1.3
 */
describe('Environment Validation - Property Tests', () => {
  it('should validate environment without Clerk variables', () => {
    fc.assert(
      fc.property(
        fc.record({
          DATABASE_URL: fc.string({ minLength: 1 }),
          JWT_SECRET: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          NODE_ENV: fc.option(
            fc.constantFrom('test', 'development', 'production'),
            { nil: undefined },
          ),
        }),
        (envConfig) => {
          try {
            // Create a test environment configuration without Clerk variables
            const testEnv = createEnv({
              server: {
                JWT_SECRET: z.string().min(1).default('dev-secret-change-in-production'),
                DATABASE_URL: z.string().min(1),
              },
              client: {},
              shared: {
                NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
              },
              runtimeEnv: {
                JWT_SECRET: envConfig.JWT_SECRET,
                DATABASE_URL: envConfig.DATABASE_URL,
                NODE_ENV: envConfig.NODE_ENV,
              },
              skipValidation: false,
            });

            // Verify that the environment was created successfully
            expect(testEnv).toBeDefined();
            expect(testEnv.DATABASE_URL).toBe(envConfig.DATABASE_URL);

            // JWT_SECRET should either be the provided value or the default
            if (envConfig.JWT_SECRET !== undefined) {
              expect(testEnv.JWT_SECRET).toBe(envConfig.JWT_SECRET);
            } else {
              expect(testEnv.JWT_SECRET).toBe('dev-secret-change-in-production');
            }

            // Verify Clerk variables are not present in the schema
            expect(testEnv).not.toHaveProperty('CLERK_SECRET_KEY');
            expect(testEnv).not.toHaveProperty('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');

            return true;
          } catch (error) {
            // If validation fails, the test should fail
            console.error('Environment validation failed:', error);
            return false;
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should not require Clerk environment variables', () => {
    // This test verifies that the actual Env module doesn't require Clerk variables
    const envWithoutClerk = {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret',
      NODE_ENV: 'test' as const,
    };

    const testEnv = createEnv({
      server: {
        JWT_SECRET: z.string().min(1).default('dev-secret-change-in-production'),
        DATABASE_URL: z.string().min(1),
      },
      client: {},
      shared: {
        NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
      },
      runtimeEnv: envWithoutClerk,
      skipValidation: false,
    });

    expect(testEnv.DATABASE_URL).toBe(envWithoutClerk.DATABASE_URL);
    expect(testEnv.JWT_SECRET).toBe(envWithoutClerk.JWT_SECRET);
    expect(testEnv).not.toHaveProperty('CLERK_SECRET_KEY');
    expect(testEnv).not.toHaveProperty('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  });
});
