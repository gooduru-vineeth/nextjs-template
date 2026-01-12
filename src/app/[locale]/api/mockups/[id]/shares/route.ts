import crypto from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { mockupSchema, mockupShareSchema, userSchema } from '@/models/Schema';

// Validation schema for creating a share
const CreateShareSchema = z.object({
  email: z.string().email().optional(),
  permission: z.enum(['view', 'edit']).default('view'),
  generateLink: z.boolean().optional(),
  expiresInDays: z.number().min(1).max(365).optional(),
});

// Validation schema for updating a share
const UpdateShareSchema = z.object({
  permission: z.enum(['view', 'edit']),
});

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/mockups/[id]/shares - Get all shares for a mockup
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
        { error: 'Mockup not found or you do not have permission to view its shares' },
        { status: 404 },
      );
    }

    // Get all shares for this mockup
    const shares = await db
      .select({
        id: mockupShareSchema.id,
        permission: mockupShareSchema.permission,
        shareToken: mockupShareSchema.shareToken,
        expiresAt: mockupShareSchema.expiresAt,
        sharedWithEmail: mockupShareSchema.sharedWithEmail,
        sharedWithUserId: mockupShareSchema.sharedWithUserId,
        sharedWithUserName: userSchema.name,
        sharedWithUserEmail: userSchema.email,
        createdAt: mockupShareSchema.createdAt,
      })
      .from(mockupShareSchema)
      .leftJoin(userSchema, eq(mockupShareSchema.sharedWithUserId, userSchema.id))
      .where(eq(mockupShareSchema.mockupId, mockupId));

    return NextResponse.json({ shares });
  } catch (error) {
    console.error('Error fetching mockup shares:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shares' },
      { status: 500 },
    );
  }
}

// POST /api/mockups/[id]/shares - Create a new share
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
        { error: 'Mockup not found or you do not have permission to share it' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const validatedData = CreateShareSchema.parse(body);

    // Generate a share link token if requested
    let shareToken: string | null = null;
    let expiresAt: Date | null = null;

    if (validatedData.generateLink) {
      shareToken = crypto.randomBytes(32).toString('hex');
      if (validatedData.expiresInDays) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + validatedData.expiresInDays);
      }
    }

    // If sharing with email, check if user exists
    let sharedWithUserId: number | null = null;
    if (validatedData.email) {
      // Don't allow sharing with yourself
      if (validatedData.email.toLowerCase() === user.email.toLowerCase()) {
        return NextResponse.json(
          { error: 'You cannot share with yourself' },
          { status: 400 },
        );
      }

      // Check if a share already exists for this email
      const [existingShare] = await db
        .select()
        .from(mockupShareSchema)
        .where(
          and(
            eq(mockupShareSchema.mockupId, mockupId),
            eq(mockupShareSchema.sharedWithEmail, validatedData.email.toLowerCase()),
          ),
        )
        .limit(1);

      if (existingShare) {
        return NextResponse.json(
          { error: 'This mockup is already shared with this email' },
          { status: 400 },
        );
      }

      // Look up user by email
      const [existingUser] = await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, validatedData.email.toLowerCase()))
        .limit(1);

      if (existingUser) {
        sharedWithUserId = existingUser.id;

        // Check if already shared with this user
        const [existingUserShare] = await db
          .select()
          .from(mockupShareSchema)
          .where(
            and(
              eq(mockupShareSchema.mockupId, mockupId),
              eq(mockupShareSchema.sharedWithUserId, existingUser.id),
            ),
          )
          .limit(1);

        if (existingUserShare) {
          return NextResponse.json(
            { error: 'This mockup is already shared with this user' },
            { status: 400 },
          );
        }
      }
    }

    // Create the share
    const [newShare] = await db
      .insert(mockupShareSchema)
      .values({
        mockupId,
        ownerId: user.id,
        sharedWithUserId,
        sharedWithEmail: validatedData.email?.toLowerCase() || null,
        permission: validatedData.permission,
        shareToken,
        expiresAt,
      })
      .returning();

    return NextResponse.json(
      { share: newShare },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Error creating share:', error);
    return NextResponse.json(
      { error: 'Failed to create share' },
      { status: 500 },
    );
  }
}

// DELETE /api/mockups/[id]/shares?shareId=123 - Remove a share
export async function DELETE(request: Request, { params }: RouteParams) {
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
    const url = new URL(request.url);
    const shareId = url.searchParams.get('shareId');

    if (Number.isNaN(mockupId)) {
      return NextResponse.json(
        { error: 'Invalid mockup ID' },
        { status: 400 },
      );
    }

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 },
      );
    }

    const shareIdNum = Number.parseInt(shareId, 10);
    if (Number.isNaN(shareIdNum)) {
      return NextResponse.json(
        { error: 'Invalid share ID' },
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
        { error: 'Mockup not found or you do not have permission to manage its shares' },
        { status: 404 },
      );
    }

    // Delete the share
    const [deletedShare] = await db
      .delete(mockupShareSchema)
      .where(
        and(
          eq(mockupShareSchema.id, shareIdNum),
          eq(mockupShareSchema.mockupId, mockupId),
        ),
      )
      .returning();

    if (!deletedShare) {
      return NextResponse.json(
        { error: 'Share not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting share:', error);
    return NextResponse.json(
      { error: 'Failed to delete share' },
      { status: 500 },
    );
  }
}

// PATCH /api/mockups/[id]/shares?shareId=123 - Update share permission
export async function PATCH(request: Request, { params }: RouteParams) {
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
    const url = new URL(request.url);
    const shareId = url.searchParams.get('shareId');

    if (Number.isNaN(mockupId)) {
      return NextResponse.json(
        { error: 'Invalid mockup ID' },
        { status: 400 },
      );
    }

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 },
      );
    }

    const shareIdNum = Number.parseInt(shareId, 10);
    if (Number.isNaN(shareIdNum)) {
      return NextResponse.json(
        { error: 'Invalid share ID' },
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
        { error: 'Mockup not found or you do not have permission to manage its shares' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const validatedData = UpdateShareSchema.parse(body);

    // Update the share
    const [updatedShare] = await db
      .update(mockupShareSchema)
      .set({ permission: validatedData.permission })
      .where(
        and(
          eq(mockupShareSchema.id, shareIdNum),
          eq(mockupShareSchema.mockupId, mockupId),
        ),
      )
      .returning();

    if (!updatedShare) {
      return NextResponse.json(
        { error: 'Share not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ share: updatedShare });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Error updating share:', error);
    return NextResponse.json(
      { error: 'Failed to update share' },
      { status: 500 },
    );
  }
}
