import { and, desc, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { mockupSchema, mockupVersionSchema } from '@/models/Schema';

// Validation schema for creating a version
const CreateVersionSchema = z.object({
  changeDescription: z.string().max(500).optional(),
});

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/mockups/[id]/versions - Get all versions for a mockup
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const mockupId = Number.parseInt(id, 10);

    if (Number.isNaN(mockupId)) {
      return NextResponse.json(
        { error: 'Invalid mockup ID' },
        { status: 400 },
      );
    }

    // Check if user owns the mockup
    const [mockup] = await db
      .select()
      .from(mockupSchema)
      .where(
        and(
          eq(mockupSchema.id, mockupId),
          eq(mockupSchema.userId, user.id),
        ),
      )
      .limit(1);

    if (!mockup) {
      return NextResponse.json(
        { error: 'Mockup not found or you do not have permission to view its versions' },
        { status: 404 },
      );
    }

    // Get all versions for this mockup, ordered by version number descending
    const versions = await db
      .select({
        id: mockupVersionSchema.id,
        versionNumber: mockupVersionSchema.versionNumber,
        name: mockupVersionSchema.name,
        thumbnailUrl: mockupVersionSchema.thumbnailUrl,
        changeDescription: mockupVersionSchema.changeDescription,
        createdAt: mockupVersionSchema.createdAt,
      })
      .from(mockupVersionSchema)
      .where(eq(mockupVersionSchema.mockupId, mockupId))
      .orderBy(desc(mockupVersionSchema.versionNumber))
      .limit(50);

    return NextResponse.json({ versions });
  } catch (error) {
    console.error('Error fetching mockup versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 },
    );
  }
}

// POST /api/mockups/[id]/versions - Create a new version (save current state)
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const mockupId = Number.parseInt(id, 10);

    if (Number.isNaN(mockupId)) {
      return NextResponse.json(
        { error: 'Invalid mockup ID' },
        { status: 400 },
      );
    }

    // Check if user owns the mockup
    const [mockup] = await db
      .select()
      .from(mockupSchema)
      .where(
        and(
          eq(mockupSchema.id, mockupId),
          eq(mockupSchema.userId, user.id),
        ),
      )
      .limit(1);

    if (!mockup) {
      return NextResponse.json(
        { error: 'Mockup not found or you do not have permission to create versions' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const validatedData = CreateVersionSchema.parse(body);

    // Get the current highest version number
    const [latestVersion] = await db
      .select({ maxVersion: sql<number>`COALESCE(MAX(${mockupVersionSchema.versionNumber}), 0)` })
      .from(mockupVersionSchema)
      .where(eq(mockupVersionSchema.mockupId, mockupId));

    const newVersionNumber = (latestVersion?.maxVersion || 0) + 1;

    // Create the version with current mockup state
    const [newVersion] = await db
      .insert(mockupVersionSchema)
      .values({
        mockupId,
        userId: user.id,
        versionNumber: newVersionNumber,
        name: mockup.name,
        data: mockup.data,
        appearance: mockup.appearance,
        thumbnailUrl: mockup.thumbnailUrl,
        changeDescription: validatedData.changeDescription,
      })
      .returning();

    return NextResponse.json(
      { version: newVersion },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Error creating version:', error);
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 },
    );
  }
}
