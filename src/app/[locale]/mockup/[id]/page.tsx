import type { Metadata } from 'next';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { PublicMockupView } from '@/components/mockup/PublicMockupView';
import { db } from '@/libs/DB';
import { mockupSchema } from '@/models/Schema';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const mockupId = Number.parseInt(id, 10);

  if (Number.isNaN(mockupId)) {
    return { title: 'Mockup Not Found' };
  }

  const [mockup] = await db
    .select()
    .from(mockupSchema)
    .where(eq(mockupSchema.id, mockupId))
    .limit(1);

  if (!mockup || !mockup.isPublic) {
    return { title: 'Mockup Not Found' };
  }

  return {
    title: `${mockup.name} - MockFlow`,
    description: `View ${mockup.platform} mockup created with MockFlow`,
    openGraph: {
      title: mockup.name,
      description: `View this ${mockup.platform} mockup`,
      type: 'website',
    },
  };
}

export default async function MockupPage({ params }: PageProps) {
  const { id } = await params;
  const mockupId = Number.parseInt(id, 10);

  if (Number.isNaN(mockupId)) {
    notFound();
  }

  const [mockup] = await db
    .select()
    .from(mockupSchema)
    .where(eq(mockupSchema.id, mockupId))
    .limit(1);

  if (!mockup || !mockup.isPublic) {
    notFound();
  }

  return (
    <PublicMockupView
      mockup={{
        id: mockup.id,
        name: mockup.name,
        type: mockup.type as 'chat' | 'ai' | 'social',
        platform: mockup.platform,
        data: mockup.data as Record<string, unknown>,
        appearance: mockup.appearance as Record<string, unknown>,
        createdAt: mockup.createdAt.toISOString(),
      }}
    />
  );
}
