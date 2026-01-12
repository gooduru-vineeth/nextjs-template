import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { apiKeySchema, mockupSchema } from '@/models/Schema';

// API Key validation
async function validateApiKey(request: Request): Promise<{ valid: boolean; userId?: number; error?: string }> {
  const authHeader = request.headers.get('Authorization');
  const apiKey = request.headers.get('X-API-Key');

  // Check for Bearer token (for logged-in users)
  if (authHeader?.startsWith('Bearer ')) {
    const user = await getCurrentUser();
    if (user) {
      return { valid: true, userId: user.id };
    }
  }

  // Check for API key
  if (apiKey) {
    const [keyRecord] = await db
      .select()
      .from(apiKeySchema)
      .where(and(
        eq(apiKeySchema.key, apiKey),
        eq(apiKeySchema.isActive, true),
      ))
      .limit(1);

    if (keyRecord) {
      // Update last used timestamp
      await db
        .update(apiKeySchema)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeySchema.id, keyRecord.id));

      return { valid: true, userId: keyRecord.userId };
    }
    return { valid: false, error: 'Invalid API key' };
  }

  return { valid: false, error: 'Authentication required. Provide Bearer token or X-API-Key header.' };
}

// Validation schema for chat mockup generation
const ChatMockupDataSchema = z.object({
  platform: z.enum(['whatsapp', 'imessage', 'discord', 'telegram', 'messenger', 'slack']),
  participants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
    isOnline: z.boolean().optional(),
  })).min(1),
  messages: z.array(z.object({
    senderId: z.string(),
    content: z.string(),
    timestamp: z.string(),
    type: z.enum(['text', 'image', 'voice', 'video', 'document', 'sticker', 'location']).default('text'),
    status: z.enum(['sending', 'sent', 'delivered', 'read', 'failed']).optional(),
  })).min(1),
  chatName: z.string().optional(),
  isGroup: z.boolean().optional(),
});

// Validation schema for AI mockup generation
const AIMockupDataSchema = z.object({
  platform: z.enum(['chatgpt', 'claude', 'gemini', 'perplexity']),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    timestamp: z.string().optional(),
  })).min(1),
  model: z.string().optional(),
  conversationTitle: z.string().optional(),
});

// Validation schema for social mockup generation
const SocialMockupDataSchema = z.object({
  platform: z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok']),
  author: z.object({
    name: z.string(),
    handle: z.string().optional(),
    avatarUrl: z.string().optional(),
    isVerified: z.boolean().optional(),
  }),
  content: z.string(),
  mediaUrls: z.array(z.string()).optional(),
  likes: z.number().default(0),
  comments: z.number().default(0),
  shares: z.number().default(0),
  timestamp: z.string().optional(),
});

// Main generation request schema
const GenerateMockupSchema = z.object({
  type: z.enum(['chat', 'ai', 'social']),
  data: z.unknown(),
  appearance: z.object({
    theme: z.enum(['light', 'dark']).default('light'),
    showTimestamps: z.boolean().default(true),
    showAvatars: z.boolean().default(true),
    showStatus: z.boolean().default(true),
    deviceFrame: z.enum(['iphone', 'android', 'none']).default('none'),
  }).optional(),
  output: z.object({
    format: z.enum(['html', 'json']).default('json'),
    save: z.boolean().default(false),
    name: z.string().optional(),
  }).optional(),
});

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<number, { count: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(userId: number): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(userId, { count: 1, resetTime });
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1, resetTime };
  }

  if (userLimit.count >= RATE_LIMIT_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: userLimit.resetTime };
  }

  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT_REQUESTS - userLimit.count, resetTime: userLimit.resetTime };
}

/**
 * POST /api/v1/generate - Generate a mockup
 *
 * Request body:
 * {
 *   "type": "chat" | "ai" | "social",
 *   "data": { ... platform-specific data ... },
 *   "appearance": { theme, showTimestamps, ... },
 *   "output": { format: "html" | "json", save: boolean }
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "mockup": { ... generated mockup data ... },
 *   "html"?: "..." (if format is html),
 *   "savedId"?: number (if save is true)
 * }
 */
export async function POST(request: Request) {
  try {
    // Validate authentication
    const authResult = await validateApiKey(request);
    if (!authResult.valid || !authResult.userId) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication failed' },
        { status: 401 },
      );
    }

    // Check rate limit
    const rateLimit = checkRateLimit(authResult.userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          resetAt: new Date(rateLimit.resetTime).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT_REQUESTS),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetTime),
          },
        },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = GenerateMockupSchema.parse(body);

    // Validate type-specific data
    let validatedData;
    let platform: string;

    switch (validatedRequest.type) {
      case 'chat': {
        validatedData = ChatMockupDataSchema.parse(validatedRequest.data);
        platform = validatedData.platform;
        break;
      }
      case 'ai': {
        validatedData = AIMockupDataSchema.parse(validatedRequest.data);
        platform = validatedData.platform;
        break;
      }
      case 'social': {
        validatedData = SocialMockupDataSchema.parse(validatedRequest.data);
        platform = validatedData.platform;
        break;
      }
    }

    const appearance = validatedRequest.appearance || { theme: 'light' };
    const output = validatedRequest.output || { format: 'json', save: false };

    // Build mockup response data
    const mockupData = {
      type: validatedRequest.type,
      platform,
      data: validatedData,
      appearance,
      generatedAt: new Date().toISOString(),
    };

    // Save to database if requested
    let savedId: number | undefined;
    if (output.save) {
      const results = await db
        .insert(mockupSchema)
        .values({
          userId: authResult.userId,
          name: output.name || `API Generated - ${platform}`,
          type: validatedRequest.type,
          platform: platform as never,
          data: validatedData,
          appearance,
          isPublic: false,
        })
        .returning();
      const newMockup = results[0];
      if (newMockup) {
        savedId = newMockup.id;
      }
    }

    // Generate HTML if requested
    let html: string | undefined;
    if (output.format === 'html') {
      html = generateMockupHtml(validatedRequest.type, platform, validatedData, appearance);
    }

    const response = {
      success: true,
      mockup: mockupData,
      ...(html && { html }),
      ...(savedId && { savedId }),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(RATE_LIMIT_REQUESTS),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(rateLimit.resetTime),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    console.error('Error generating mockup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate mockup' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/v1/generate - Get API documentation
 */
export async function GET() {
  return NextResponse.json({
    name: 'MockFlow Generation API',
    version: '1.0.0',
    description: 'Generate chat, AI, and social media mockups programmatically',
    endpoints: {
      'POST /api/v1/generate': {
        description: 'Generate a mockup',
        authentication: 'Bearer token or X-API-Key header',
        rateLimit: `${RATE_LIMIT_REQUESTS} requests per hour`,
        requestBody: {
          type: {
            type: 'string',
            enum: ['chat', 'ai', 'social'],
            required: true,
          },
          data: {
            type: 'object',
            description: 'Platform-specific mockup data',
            required: true,
          },
          appearance: {
            type: 'object',
            properties: {
              theme: { type: 'string', enum: ['light', 'dark'], default: 'light' },
              showTimestamps: { type: 'boolean', default: true },
              showAvatars: { type: 'boolean', default: true },
              showStatus: { type: 'boolean', default: true },
              deviceFrame: { type: 'string', enum: ['iphone', 'android', 'none'], default: 'none' },
            },
          },
          output: {
            type: 'object',
            properties: {
              format: { type: 'string', enum: ['html', 'json'], default: 'json' },
              save: { type: 'boolean', default: false },
              name: { type: 'string', description: 'Name for saved mockup' },
            },
          },
        },
        examples: {
          chat: {
            type: 'chat',
            data: {
              platform: 'whatsapp',
              participants: [
                { id: 'user', name: 'John' },
                { id: 'support', name: 'Support Team' },
              ],
              messages: [
                { senderId: 'user', content: 'Hello!', timestamp: '10:30 AM', type: 'text' },
                { senderId: 'support', content: 'Hi! How can I help?', timestamp: '10:31 AM', type: 'text' },
              ],
            },
          },
          ai: {
            type: 'ai',
            data: {
              platform: 'chatgpt',
              messages: [
                { role: 'user', content: 'What is TypeScript?' },
                { role: 'assistant', content: 'TypeScript is a strongly typed programming language...' },
              ],
              model: 'GPT-4',
            },
          },
          social: {
            type: 'social',
            data: {
              platform: 'twitter',
              author: { name: 'John Doe', handle: '@johndoe', isVerified: true },
              content: 'Just shipped a new feature!',
              likes: 150,
              comments: 23,
              shares: 45,
            },
          },
        },
      },
      'GET /api/v1/templates': {
        description: 'Get available industry templates',
      },
    },
    supportedPlatforms: {
      chat: ['whatsapp', 'imessage', 'discord', 'telegram', 'messenger', 'slack'],
      ai: ['chatgpt', 'claude', 'gemini', 'perplexity'],
      social: ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'],
    },
  });
}

// Helper function to generate HTML for a mockup
function generateMockupHtml(
  type: string,
  platform: string,
  data: unknown,
  appearance: Record<string, unknown>,
): string {
  const isDark = appearance.theme === 'dark';
  const bgColor = isDark ? '#1f2937' : '#f3f4f6';
  const textColor = isDark ? '#f9fafb' : '#111827';

  // Generate platform-specific HTML
  let content = '';

  if (type === 'chat') {
    const chatData = data as {
      participants: { id: string; name: string }[];
      messages: { senderId: string; content: string; timestamp: string }[];
      chatName?: string;
    };

    const participantMap = new Map(chatData.participants.map(p => [p.id, p.name]));

    content = `
      <div style="max-width: 400px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="background: ${isDark ? '#374151' : '#ffffff'}; border-radius: 12px; padding: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; padding-bottom: 12px; border-bottom: 1px solid ${isDark ? '#4b5563' : '#e5e7eb'}; margin-bottom: 12px;">
            <div style="font-weight: 600; color: ${textColor};">${chatData.chatName || (chatData.messages[0]?.senderId ? participantMap.get(chatData.messages[0].senderId) : undefined) || platform}</div>
            <div style="font-size: 12px; color: ${isDark ? '#9ca3af' : '#6b7280'};">${platform.charAt(0).toUpperCase() + platform.slice(1)}</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${chatData.messages.map((msg) => {
              const isUser = msg.senderId === chatData.participants[0]?.id;
              return `
                <div style="display: flex; justify-content: ${isUser ? 'flex-end' : 'flex-start'};">
                  <div style="max-width: 75%; padding: 8px 12px; border-radius: 12px; background: ${isUser ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb')}; color: ${isUser ? '#ffffff' : textColor};">
                    <div style="font-size: 14px;">${msg.content}</div>
                    <div style="font-size: 10px; margin-top: 4px; opacity: 0.7; text-align: right;">${msg.timestamp}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (type === 'ai') {
    const aiData = data as {
      messages: { role: string; content: string }[];
      model?: string;
      conversationTitle?: string;
    };

    content = `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="background: ${isDark ? '#374151' : '#ffffff'}; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; padding-bottom: 12px; border-bottom: 1px solid ${isDark ? '#4b5563' : '#e5e7eb'}; margin-bottom: 16px;">
            <div style="font-weight: 600; color: ${textColor};">${aiData.conversationTitle || 'New Chat'}</div>
            <div style="font-size: 12px; color: ${isDark ? '#9ca3af' : '#6b7280'};">${aiData.model || platform}</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${aiData.messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return `
                <div style="padding: 12px; border-radius: 8px; background: ${isAssistant ? (isDark ? '#1f2937' : '#f9fafb') : 'transparent'};">
                  <div style="font-weight: 600; margin-bottom: 4px; color: ${isDark ? '#9ca3af' : '#6b7280'}; font-size: 12px; text-transform: uppercase;">
                    ${isAssistant ? 'Assistant' : 'You'}
                  </div>
                  <div style="color: ${textColor}; line-height: 1.6; white-space: pre-wrap;">${msg.content}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (type === 'social') {
    const socialData = data as {
      author: { name: string; handle?: string; isVerified?: boolean };
      content: string;
      likes: number;
      comments: number;
      shares: number;
      timestamp?: string;
    };

    content = `
      <div style="max-width: 500px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="background: ${isDark ? '#374151' : '#ffffff'}; border-radius: 12px; padding: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: ${isDark ? '#4b5563' : '#e5e7eb'};"></div>
            <div>
              <div style="font-weight: 600; color: ${textColor};">
                ${socialData.author.name}
                ${socialData.author.isVerified ? '<span style="color: #3b82f6;">✓</span>' : ''}
              </div>
              ${socialData.author.handle ? `<div style="font-size: 14px; color: ${isDark ? '#9ca3af' : '#6b7280'};">${socialData.author.handle}</div>` : ''}
            </div>
          </div>
          <div style="color: ${textColor}; line-height: 1.6; margin-bottom: 12px;">${socialData.content}</div>
          <div style="display: flex; gap: 24px; padding-top: 12px; border-top: 1px solid ${isDark ? '#4b5563' : '#e5e7eb'}; color: ${isDark ? '#9ca3af' : '#6b7280'}; font-size: 14px;">
            <span>❤️ ${socialData.likes.toLocaleString()}</span>
            <span>💬 ${socialData.comments.toLocaleString()}</span>
            <span>🔄 ${socialData.shares.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MockFlow Generated Mockup</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${bgColor}; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
  </style>
</head>
<body>
  ${content}
  <!-- Generated by MockFlow API -->
</body>
</html>`;
}
