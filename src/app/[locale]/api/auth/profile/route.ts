import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { userSchema } from '@/models/Schema';
import { UpdateProfileSchema } from '@/validations/AuthValidation';

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = UpdateProfileSchema.parse(body);

    // Check if email is being changed and if it's already in use
    if (validatedData.email !== user.email) {
      const [existingUser] = await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, validatedData.email))
        .limit(1);

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 },
        );
      }
    }

    // Update user
    await db
      .update(userSchema)
      .set({
        email: validatedData.email,
        name: validatedData.name || null,
      })
      .where(eq(userSchema.id, user.id));

    return NextResponse.json(
      { success: true },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while updating profile' },
      { status: 500 },
    );
  }
}
