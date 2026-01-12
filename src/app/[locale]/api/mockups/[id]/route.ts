import { and, eq, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { mockupSchema, mockupShareSchema } from '@/models/Schema';

// Validation schema for updates
const UpdateMockupSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(1).max(255).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  appearance: z.record(z.string(), z.unknown()).optional(),
  projectId: z.coerce.number().nullable().optional(),
  isPublic: z.boolean().optional(),
  thumbnailUrl: z.string({ message: 'Invalid URL' }).max(500).nullable().optional(),
});

type RouteParams = {
  params: Promise<{ id: string }>;
};

// Helper function to check if user has access to mockup
async function checkMockupAccess(
  mockupId: number,
  userId: number | null,
  userEmail: string | null,
): Promise<{ hasAccess: boolean; permission: 'owner' | 'view' | 'edit' | null }> {
  // Check for shared access
  if (userId || userEmail) {
    const conditions = [];
    if (userId) {
      conditions.push(eq(mockupShareSchema.sharedWithUserId, userId));
    }
    if (userEmail) {
      conditions.push(eq(mockupShareSchema.sharedWithEmail, userEmail.toLowerCase()));
    }

    const [share] = await db
      .select()
      .from(mockupShareSchema)
      .where(
        and(
          eq(mockupShareSchema.mockupId, mockupId),
          or(...conditions),
        ),
      )
      .limit(1);

    if (share) {
      // Check if share is expired
      if (share.expiresAt && new Date() > share.expiresAt) {
        return { hasAccess: false, permission: null };
      }
      return { hasAccess: true, permission: share.permission };
    }
  }

  return { hasAccess: false, permission: null };
}

// GET /api/mockups/[id] - Get a single mockup
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const mockupId = Number.parseInt(id, 10);

    if (Number.isNaN(mockupId)) {
      return NextResponse.json(
        { error: 'Invalid mockup ID' },
        { status: 400 },
      );
    }

    const [mockup] = await db
      .select()
      .from(mockupSchema)
      .where(eq(mockupSchema.id, mockupId))
      .limit(1);

    if (!mockup) {
      return NextResponse.json(
        { error: 'Mockup not found' },
        { status: 404 },
      );
    }

    // Check access permissions
    let permission: 'owner' | 'view' | 'edit' | null = null;

    // Owner has full access
    if (user && mockup.userId === user.id) {
      permission = 'owner';
    }
    // Public mockups are viewable by anyone
    else if (mockup.isPublic) {
      permission = 'view';
    }
    // Check for shared access
    else if (user) {
      const accessResult = await checkMockupAccess(mockupId, user.id, user.email);
      if (accessResult.hasAccess) {
        permission = accessResult.permission;
      }
    }

    if (!permission) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    return NextResponse.json({ mockup, permission });
  } catch (error) {
    console.error('Error fetching mockup:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mockup' },
      { status: 500 },
    );
  }
}

// PUT /api/mockups/[id] - Update a mockup
export async function PUT(request: Request, { params }: RouteParams) {
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

    // Check if mockup exists
    const [existingMockup] = await db
      .select()
      .from(mockupSchema)
      .where(eq(mockupSchema.id, mockupId))
      .limit(1);

    if (!existingMockup) {
      return NextResponse.json(
        { error: 'Mockup not found' },
        { status: 404 },
      );
    }

    // Check permissions - owner or shared with edit access
    let hasEditPermission = existingMockup.userId === user.id;

    if (!hasEditPermission) {
      const accessResult = await checkMockupAccess(mockupId, user.id, user.email);
      hasEditPermission = accessResult.hasAccess && accessResult.permission === 'edit';
    }

    if (!hasEditPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update this mockup' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const validatedData = UpdateMockupSchema.parse(body);

    // Build update object - restrict some fields for non-owners
    const updateData: Record<string, unknown> = {};
    const isOwner = existingMockup.userId === user.id;

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }
    if (validatedData.data !== undefined) {
      updateData.data = validatedData.data;
    }
    if (validatedData.appearance !== undefined) {
      updateData.appearance = validatedData.appearance;
    }
    if (validatedData.thumbnailUrl !== undefined) {
      updateData.thumbnailUrl = validatedData.thumbnailUrl;
    }

    // Only owners can change these settings
    if (isOwner) {
      if (validatedData.projectId !== undefined) {
        updateData.projectId = validatedData.projectId;
      }
      if (validatedData.isPublic !== undefined) {
        updateData.isPublic = validatedData.isPublic;
      }
    }

    const [updatedMockup] = await db
      .update(mockupSchema)
      .set(updateData)
      .where(eq(mockupSchema.id, mockupId))
      .returning();

    return NextResponse.json({ mockup: updatedMockup });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Error updating mockup:', error);
    return NextResponse.json(
      { error: 'Failed to update mockup' },
      { status: 500 },
    );
  }
}

// DELETE /api/mockups/[id] - Delete a mockup
export async function DELETE(_request: Request, { params }: RouteParams) {
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

    // Check if mockup exists and belongs to user
    const [existingMockup] = await db
      .select()
      .from(mockupSchema)
      .where(
        and(
          eq(mockupSchema.id, mockupId),
          eq(mockupSchema.userId, user.id),
        ),
      )
      .limit(1);

    if (!existingMockup) {
      return NextResponse.json(
        { error: 'Mockup not found or you do not have permission to delete it' },
        { status: 404 },
      );
    }

    await db
      .delete(mockupSchema)
      .where(eq(mockupSchema.id, mockupId));

    return NextResponse.json(
      { success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting mockup:', error);
    return NextResponse.json(
      { error: 'Failed to delete mockup' },
      { status: 500 },
    );
  }
}
