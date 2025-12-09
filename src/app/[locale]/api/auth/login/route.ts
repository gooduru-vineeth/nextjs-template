import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createSession, verifyPassword } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { userSchema } from '@/models/Schema';
import { SignInSchema } from '@/validations/AuthValidation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = SignInSchema.parse(body);

    // Find user
    const [user] = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, validatedData.email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
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
      { error: 'An error occurred during login' },
      { status: 500 },
    );
  }
}
