import crypto from 'node:crypto';

export type WebhookPayload = {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
};

export type WebhookEvent
  = | 'mockup.created'
    | 'mockup.updated'
    | 'mockup.deleted'
    | 'mockup.exported'
    | 'template.applied'
    | 'api_key.created'
    | 'api_key.deleted';

export type WebhookConfig = {
  id: string;
  url: string;
  secret: string;
  events: WebhookEvent[];
  enabled: boolean;
  retryCount: number;
  createdAt: Date;
  lastTriggeredAt?: Date;
  lastStatus?: number;
};

export type WebhookDelivery = {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: WebhookPayload;
  response?: {
    status: number;
    body: string;
    headers: Record<string, string>;
  };
  attempts: number;
  success: boolean;
  createdAt: Date;
  completedAt?: Date;
};

/**
 * Generates a signature for webhook payload verification
 */
export function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Verifies a webhook signature
 */
export function verifySignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expected = generateSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}

/**
 * Generates a secure webhook secret
 */
export function generateWebhookSecret(): string {
  return `whsec_${crypto.randomBytes(32).toString('hex')}`;
}

/**
 * Creates a webhook payload
 */
export function createPayload(
  event: WebhookEvent,
  data: Record<string, unknown>,
): WebhookPayload {
  return {
    event,
    timestamp: new Date().toISOString(),
    data,
  };
}

/**
 * Sends a webhook request with retries
 */
export async function sendWebhook(
  config: WebhookConfig,
  payload: WebhookPayload,
  maxRetries: number = 3,
): Promise<{ success: boolean; status?: number; error?: string }> {
  const payloadString = JSON.stringify(payload);
  const signature = generateSignature(payloadString, config.secret);

  let lastError: string | undefined;
  let lastStatus: number | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': payload.event,
          'X-Webhook-Timestamp': payload.timestamp,
          'X-Webhook-Id': crypto.randomUUID(),
          'User-Agent': 'MockFlow-Webhook/1.0',
        },
        body: payloadString,
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      lastStatus = response.status;

      if (response.ok) {
        return { success: true, status: response.status };
      }

      lastError = `HTTP ${response.status}: ${await response.text()}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Exponential backoff
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 1000));
    }
  }

  return { success: false, status: lastStatus, error: lastError };
}

/**
 * Validates a webhook URL
 */
export function validateWebhookUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url);

    // Must be HTTPS in production
    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'Webhook URL must use HTTPS' };
    }

    // Block localhost in production
    if (process.env.NODE_ENV === 'production'
      && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
      return { valid: false, error: 'Cannot use localhost URLs in production' };
    }

    // Block internal IPs
    const internalPatterns = [
      /^10\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
      /^192\.168\./,
      /^169\.254\./,
    ];

    for (const pattern of internalPatterns) {
      if (pattern.test(parsed.hostname)) {
        return { valid: false, error: 'Internal IP addresses are not allowed' };
      }
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

// Event payload type definitions for Zapier integration
export const webhookEventSchemas: Record<WebhookEvent, {
  description: string;
  sampleData: Record<string, unknown>;
}> = {
  'mockup.created': {
    description: 'Triggered when a new mockup is created',
    sampleData: {
      mockupId: 'mock_abc123',
      platform: 'whatsapp',
      messageCount: 5,
      createdAt: new Date().toISOString(),
    },
  },
  'mockup.updated': {
    description: 'Triggered when a mockup is modified',
    sampleData: {
      mockupId: 'mock_abc123',
      changes: ['messages', 'settings'],
      updatedAt: new Date().toISOString(),
    },
  },
  'mockup.deleted': {
    description: 'Triggered when a mockup is deleted',
    sampleData: {
      mockupId: 'mock_abc123',
      deletedAt: new Date().toISOString(),
    },
  },
  'mockup.exported': {
    description: 'Triggered when a mockup is exported',
    sampleData: {
      mockupId: 'mock_abc123',
      format: 'png',
      width: 800,
      exportedAt: new Date().toISOString(),
    },
  },
  'template.applied': {
    description: 'Triggered when a template is applied to a mockup',
    sampleData: {
      mockupId: 'mock_abc123',
      templateId: 'tmpl_xyz789',
      templateName: 'E-commerce Support',
      appliedAt: new Date().toISOString(),
    },
  },
  'api_key.created': {
    description: 'Triggered when a new API key is created',
    sampleData: {
      apiKeyId: 'key_abc123',
      name: 'Production Key',
      permissions: ['read', 'write'],
      createdAt: new Date().toISOString(),
    },
  },
  'api_key.deleted': {
    description: 'Triggered when an API key is deleted',
    sampleData: {
      apiKeyId: 'key_abc123',
      deletedAt: new Date().toISOString(),
    },
  },
};
