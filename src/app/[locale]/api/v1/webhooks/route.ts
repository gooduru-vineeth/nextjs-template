import type { WebhookEvent } from '@/lib/webhooks';
import { NextResponse } from 'next/server';
import {
  generateWebhookSecret,
  validateWebhookUrl,

  webhookEventSchemas,
} from '@/lib/webhooks';

// In-memory store for demo (would use database in production)
const webhooks = new Map<string, {
  id: string;
  userId: string;
  url: string;
  secret: string;
  events: WebhookEvent[];
  enabled: boolean;
  createdAt: Date;
  lastTriggeredAt?: Date;
}>();

/**
 * GET /api/v1/webhooks - List all webhooks for the user
 */
export async function GET(request: Request) {
  try {
    // In production, authenticate user and filter by userId
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') || 'demo-user';

    const userWebhooks = Array.from(webhooks.values())
      .filter(w => w.userId === userId)
      .map(w => ({
        id: w.id,
        url: w.url,
        events: w.events,
        enabled: w.enabled,
        createdAt: w.createdAt.toISOString(),
        lastTriggeredAt: w.lastTriggeredAt?.toISOString(),
        // Don't expose the secret
      }));

    return NextResponse.json({
      success: true,
      webhooks: userWebhooks,
      availableEvents: Object.entries(webhookEventSchemas).map(([event, schema]) => ({
        event,
        description: schema.description,
      })),
    });
  } catch (error) {
    console.error('Error listing webhooks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list webhooks' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/v1/webhooks - Create a new webhook
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, events, userId = 'demo-user' } = body;

    // Validate URL
    const urlValidation = validateWebhookUrl(url);
    if (!urlValidation.valid) {
      return NextResponse.json(
        { success: false, error: urlValidation.error },
        { status: 400 },
      );
    }

    // Validate events
    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one event must be specified' },
        { status: 400 },
      );
    }

    const validEvents = Object.keys(webhookEventSchemas);
    const invalidEvents = events.filter(e => !validEvents.includes(e));
    if (invalidEvents.length > 0) {
      return NextResponse.json(
        { success: false, error: `Invalid events: ${invalidEvents.join(', ')}` },
        { status: 400 },
      );
    }

    // Check webhook limit (5 per user for free tier)
    const userWebhookCount = Array.from(webhooks.values())
      .filter(w => w.userId === userId)
      .length;

    if (userWebhookCount >= 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum webhook limit reached (5)' },
        { status: 400 },
      );
    }

    // Create webhook
    const id = `wh_${Date.now().toString(36)}`;
    const secret = generateWebhookSecret();

    const webhook = {
      id,
      userId,
      url,
      secret,
      events: events as WebhookEvent[],
      enabled: true,
      createdAt: new Date(),
    };

    webhooks.set(id, webhook);

    return NextResponse.json({
      success: true,
      webhook: {
        id: webhook.id,
        url: webhook.url,
        secret: webhook.secret, // Only returned on creation!
        events: webhook.events,
        enabled: webhook.enabled,
        createdAt: webhook.createdAt.toISOString(),
      },
      message: 'Webhook created. Store the secret securely - it will not be shown again.',
    });
  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create webhook' },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/v1/webhooks - Update a webhook
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, url, events, enabled } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Webhook ID is required' },
        { status: 400 },
      );
    }

    const webhook = webhooks.get(id);
    if (!webhook) {
      return NextResponse.json(
        { success: false, error: 'Webhook not found' },
        { status: 404 },
      );
    }

    // Update URL if provided
    if (url !== undefined) {
      const urlValidation = validateWebhookUrl(url);
      if (!urlValidation.valid) {
        return NextResponse.json(
          { success: false, error: urlValidation.error },
          { status: 400 },
        );
      }
      webhook.url = url;
    }

    // Update events if provided
    if (events !== undefined) {
      const validEvents = Object.keys(webhookEventSchemas);
      const invalidEvents = events.filter((e: string) => !validEvents.includes(e));
      if (invalidEvents.length > 0) {
        return NextResponse.json(
          { success: false, error: `Invalid events: ${invalidEvents.join(', ')}` },
          { status: 400 },
        );
      }
      webhook.events = events;
    }

    // Update enabled status if provided
    if (enabled !== undefined) {
      webhook.enabled = enabled;
    }

    webhooks.set(id, webhook);

    return NextResponse.json({
      success: true,
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        enabled: webhook.enabled,
        createdAt: webhook.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update webhook' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/v1/webhooks - Delete a webhook
 */
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Webhook ID is required' },
        { status: 400 },
      );
    }

    const webhook = webhooks.get(id);
    if (!webhook) {
      return NextResponse.json(
        { success: false, error: 'Webhook not found' },
        { status: 404 },
      );
    }

    webhooks.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Webhook deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete webhook' },
      { status: 500 },
    );
  }
}
