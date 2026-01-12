import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { mockupSchema, mockupVersionSchema } from '@/models/Schema';

type RouteParams = {
  params: Promise<{ id: string; versionId: string }>;
};

// GET /api/mockups/[id]/versions/[versionId] - Get a specific version
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id, versionId } = await params;
    const mockupId = Number.parseInt(id, 10);
    const versionIdNum = Number.parseInt(versionId, 10);

    if (Number.isNaN(mockupId) || Number.isNaN(versionIdNum)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
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

    // Get the specific version
    const [version] = await db
      .select()
      .from(mockupVersionSchema)
      .where(
        and(
          eq(mockupVersionSchema.id, versionIdNum),
          eq(mockupVersionSchema.mockupId, mockupId),
        ),
      )
      .limit(1);

    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ version });
  } catch (error) {
    console.error('Error fetching version:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version' },
      { status: 500 },
    );
  }
}

// POST /api/mockups/[id]/versions/[versionId] - Restore this version
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id, versionId } = await params;
    const mockupId = Number.parseInt(id, 10);
    const versionIdNum = Number.parseInt(versionId, 10);

    if (Number.isNaN(mockupId) || Number.isNaN(versionIdNum)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
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
        { error: 'Mockup not found or you do not have permission to restore versions' },
        { status: 404 },
      );
    }

    // Get the version to restore
    const [version] = await db
      .select()
      .from(mockupVersionSchema)
      .where(
        and(
          eq(mockupVersionSchema.id, versionIdNum),
          eq(mockupVersionSchema.mockupId, mockupId),
        ),
      )
      .limit(1);

    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 },
      );
    }

    // Update the mockup with the version data
    const [updatedMockup] = await db
      .update(mockupSchema)
      .set({
        name: version.name,
        data: version.data,
        appearance: version.appearance,
        thumbnailUrl: version.thumbnailUrl,
      })
      .where(eq(mockupSchema.id, mockupId))
      .returning();

    return NextResponse.json({
      mockup: updatedMockup,
      message: `Restored to version ${version.versionNumber}`,
    });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 },
    );
  }
}

// DELETE /api/mockups/[id]/versions/[versionId] - Delete a specific version
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id, versionId } = await params;
    const mockupId = Number.parseInt(id, 10);
    const versionIdNum = Number.parseInt(versionId, 10);

    if (Number.isNaN(mockupId) || Number.isNaN(versionIdNum)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
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
        { error: 'Mockup not found or you do not have permission to delete versions' },
        { status: 404 },
      );
    }

    // Delete the version
    const [deletedVersion] = await db
      .delete(mockupVersionSchema)
      .where(
        and(
          eq(mockupVersionSchema.id, versionIdNum),
          eq(mockupVersionSchema.mockupId, mockupId),
        ),
      )
      .returning();

    if (!deletedVersion) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting version:', error);
    return NextResponse.json(
      { error: 'Failed to delete version' },
      { status: 500 },
    );
  }
}
