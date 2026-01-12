import type { IndustryTemplate } from '@/data/industryTemplates';
import { NextResponse } from 'next/server';
import {
  getIndustries,
  getTemplatesByCategory,
  getTemplatesByIndustry,

  industryTemplates,
  searchTemplates,
} from '@/data/industryTemplates';

/**
 * GET /api/v1/templates - List available templates
 *
 * Query parameters:
 * - industry: Filter by industry (saas, ecommerce, healthcare, etc.)
 * - category: Filter by category (customer-support, sales, onboarding, etc.)
 * - platform: Filter by platform (whatsapp, imessage, slack, etc.)
 * - search: Search templates by name, description, or tags
 * - limit: Maximum number of results (default: 50, max: 100)
 * - offset: Pagination offset (default: 0)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const industry = searchParams.get('industry') as IndustryTemplate['industry'] | null;
    const category = searchParams.get('category') as IndustryTemplate['category'] | null;
    const platform = searchParams.get('platform') as IndustryTemplate['platform'] | null;
    const search = searchParams.get('search');
    const limit = Math.min(Number.parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = Number.parseInt(searchParams.get('offset') || '0', 10);
    const includeMessages = searchParams.get('includeMessages') === 'true';

    let templates: IndustryTemplate[] = industryTemplates;

    // Apply filters
    if (search) {
      templates = searchTemplates(search);
    } else if (industry) {
      templates = getTemplatesByIndustry(industry);
    } else if (category) {
      templates = getTemplatesByCategory(category);
    }

    // Additional platform filter
    if (platform) {
      templates = templates.filter(t => t.platform === platform);
    }

    const total = templates.length;

    // Apply pagination
    const paginatedTemplates = templates.slice(offset, offset + limit);

    // Transform response (optionally exclude messages for lighter payload)
    const responseTemplates = paginatedTemplates.map((t) => {
      const { messages, participants, ...rest } = t;
      return {
        ...rest,
        participantCount: participants.length,
        messageCount: messages.length,
        ...(includeMessages && { participants, messages }),
      };
    });

    return NextResponse.json({
      success: true,
      templates: responseTemplates,
      total,
      limit,
      offset,
      filters: {
        industry,
        category,
        platform,
        search,
      },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/v1/templates/industries - List all industries with counts
 */
export async function OPTIONS() {
  const industries = getIndustries();

  const categories = [
    { id: 'customer-support', name: 'Customer Support', count: industryTemplates.filter(t => t.category === 'customer-support').length },
    { id: 'sales', name: 'Sales', count: industryTemplates.filter(t => t.category === 'sales').length },
    { id: 'onboarding', name: 'Onboarding', count: industryTemplates.filter(t => t.category === 'onboarding').length },
    { id: 'notification', name: 'Notification', count: industryTemplates.filter(t => t.category === 'notification').length },
    { id: 'marketing', name: 'Marketing', count: industryTemplates.filter(t => t.category === 'marketing').length },
  ];

  const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', count: industryTemplates.filter(t => t.platform === 'whatsapp').length },
    { id: 'imessage', name: 'iMessage', count: industryTemplates.filter(t => t.platform === 'imessage').length },
    { id: 'slack', name: 'Slack', count: industryTemplates.filter(t => t.platform === 'slack').length },
    { id: 'discord', name: 'Discord', count: industryTemplates.filter(t => t.platform === 'discord').length },
    { id: 'telegram', name: 'Telegram', count: industryTemplates.filter(t => t.platform === 'telegram').length },
    { id: 'messenger', name: 'Messenger', count: industryTemplates.filter(t => t.platform === 'messenger').length },
  ];

  return NextResponse.json({
    success: true,
    industries,
    categories,
    platforms,
    totalTemplates: industryTemplates.length,
  });
}
