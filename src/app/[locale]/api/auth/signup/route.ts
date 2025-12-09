import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createSession, hashPassword } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { userSchema } from '@/models/Schema';
import { SignUpSchema } from '@/validations/AuthValidation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = SignUpSchema.parse(body);

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, validatedData.email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const [newUser] = await db
      .insert(userSchema)
      .values({
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name || null,
      })
      .returning({
        id: userSchema.id,
        email: userSchema.email,
        name: userSchema.name,
      });

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 },
      );
    }

    // Create session
    await createSession(newUser);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 },
    );
  }
}
