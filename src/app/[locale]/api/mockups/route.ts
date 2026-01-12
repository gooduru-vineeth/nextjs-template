import { and, count, desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { mockupSchema } from '@/models/Schema';

// Validation schemas
const CreateMockupSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(1).max(255),
  type: z.enum(['chat', 'ai', 'social']),
  platform: z.enum([
    'whatsapp',
    'imessage',
    'discord',
    'telegram',
    'messenger',
    'slack',
    'chatgpt',
    'claude',
    'gemini',
    'perplexity',
    'linkedin',
    'instagram',
    'twitter',
    'facebook',
    'tiktok',
  ]),
  data: z.record(z.string(), z.unknown()),
  appearance: z.record(z.string(), z.unknown()).optional(),
  projectId: z.coerce.number().optional(),
  isPublic: z.boolean().optional(),
  thumbnailUrl: z.string().optional(),
});

// GET /api/mockups - List user's mockups
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'chat' | 'ai' | 'social' | null;
    const platform = searchParams.get('platform');
    const limit = Math.min(Number.parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = Number.parseInt(searchParams.get('offset') || '0', 10);

    // Build where conditions
    const conditions = [eq(mockupSchema.userId, user.id)];
    if (type && ['chat', 'ai', 'social'].includes(type)) {
      conditions.push(eq(mockupSchema.type, type));
    }

    // Get total count for pagination
    const [countResult] = await db
      .select({ total: count() })
      .from(mockupSchema)
      .where(and(...conditions));

    // Get paginated mockups
    const mockups = await db
      .select()
      .from(mockupSchema)
      .where(and(...conditions))
      .orderBy(desc(mockupSchema.updatedAt))
      .limit(limit)
      .offset(offset);

    // Filter by platform in application layer (less common filter)
    let filteredMockups = mockups;
    if (platform) {
      filteredMockups = filteredMockups.filter(m => m.platform === platform);
    }

    return NextResponse.json({
      mockups: filteredMockups,
      total: countResult?.total || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching mockups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mockups' },
      { status: 500 },
    );
  }
}

// POST /api/mockups - Create a new mockup
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = CreateMockupSchema.parse(body);

    const [newMockup] = await db
      .insert(mockupSchema)
      .values({
        userId: user.id,
        name: validatedData.name,
        type: validatedData.type,
        platform: validatedData.platform,
        data: validatedData.data,
        appearance: validatedData.appearance || {},
        projectId: validatedData.projectId || null,
        isPublic: validatedData.isPublic || false,
        thumbnailUrl: validatedData.thumbnailUrl || null,
      })
      .returning();

    return NextResponse.json(
      { mockup: newMockup },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Error creating mockup:', error);
    return NextResponse.json(
      { error: 'Failed to create mockup' },
      { status: 500 },
    );
  }
}
