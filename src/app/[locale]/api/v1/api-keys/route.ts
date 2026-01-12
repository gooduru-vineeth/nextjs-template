import { randomBytes } from 'node:crypto';
import { and, desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { apiKeySchema } from '@/models/Schema';

// Generate a secure API key
function generateApiKey(): string {
  return `mk_${randomBytes(32).toString('hex')}`;
}

// Validation schema for creating an API key
const CreateApiKeySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  expiresIn: z.number().optional(), // Days until expiration
  permissions: z.object({
    canGenerateMockups: z.boolean().default(true),
    canSaveMockups: z.boolean().default(true),
    canAccessTemplates: z.boolean().default(true),
  }).optional(),
});

/**
 * GET /api/v1/api-keys - List user's API keys
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const keys = await db
      .select({
        id: apiKeySchema.id,
        name: apiKeySchema.name,
        description: apiKeySchema.description,
        // Only show last 8 characters of key for security
        keyPreview: apiKeySchema.key,
        isActive: apiKeySchema.isActive,
        canGenerateMockups: apiKeySchema.canGenerateMockups,
        canSaveMockups: apiKeySchema.canSaveMockups,
        canAccessTemplates: apiKeySchema.canAccessTemplates,
        rateLimit: apiKeySchema.rateLimit,
        lastUsedAt: apiKeySchema.lastUsedAt,
        expiresAt: apiKeySchema.expiresAt,
        createdAt: apiKeySchema.createdAt,
      })
      .from(apiKeySchema)
      .where(eq(apiKeySchema.userId, user.id))
      .orderBy(desc(apiKeySchema.createdAt));

    // Mask the keys - only show last 8 characters
    const maskedKeys = keys.map(k => ({
      ...k,
      keyPreview: `mk_${'*'.repeat(56)}${k.keyPreview.slice(-8)}`,
    }));

    return NextResponse.json({
      success: true,
      apiKeys: maskedKeys,
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API keys' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/v1/api-keys - Create a new API key
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = CreateApiKeySchema.parse(body);

    // Generate a new API key
    const apiKey = generateApiKey();

    // Calculate expiration date if specified
    let expiresAt: Date | null = null;
    if (validatedData.expiresIn) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validatedData.expiresIn);
    }

    const results = await db
      .insert(apiKeySchema)
      .values({
        userId: user.id,
        name: validatedData.name,
        key: apiKey,
        description: validatedData.description,
        canGenerateMockups: validatedData.permissions?.canGenerateMockups ?? true,
        canSaveMockups: validatedData.permissions?.canSaveMockups ?? true,
        canAccessTemplates: validatedData.permissions?.canAccessTemplates ?? true,
        expiresAt,
      })
      .returning();

    const newKey = results[0];
    if (!newKey) {
      return NextResponse.json(
        { success: false, error: 'Failed to create API key' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        apiKey: {
          id: newKey.id,
          name: newKey.name,
          // Return the full key ONLY on creation
          key: apiKey,
          description: newKey.description,
          expiresAt: newKey.expiresAt,
          createdAt: newKey.createdAt,
        },
        message: 'API key created successfully. Save this key - it will not be shown again.',
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Error creating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create API key' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/v1/api-keys - Delete an API key (by ID in body)
 */
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { id } = z.object({ id: z.number() }).parse(body);

    // Verify ownership and delete
    const [deletedKey] = await db
      .delete(apiKeySchema)
      .where(and(
        eq(apiKeySchema.id, id),
        eq(apiKeySchema.userId, user.id),
      ))
      .returning({ id: apiKeySchema.id });

    if (!deletedKey) {
      return NextResponse.json(
        { success: false, error: 'API key not found or not authorized' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete API key' },
      { status: 500 },
    );
  }
}
