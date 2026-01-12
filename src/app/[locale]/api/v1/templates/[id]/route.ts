import { NextResponse } from 'next/server';
import { industryTemplates } from '@/data/industryTemplates';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/v1/templates/[id] - Get a specific template by ID
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const template = industryTemplates.find(t => t.id === id);

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch template' },
      { status: 500 },
    );
  }
}
