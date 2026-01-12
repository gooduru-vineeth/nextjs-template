// Simple token estimation utility
// This is an approximation - real tokenization would need a proper tokenizer

/**
 * Estimates the number of tokens in a text string
 * Uses a rough approximation: ~4 characters per token for English text
 * More accurate for display purposes in mockups
 */
export function estimateTokens(text: string): number {
  if (!text) {
    return 0;
  }

  // Rough estimation: ~4 characters per token for English
  // This is a common approximation used by many tools
  const charCount = text.length;

  // Adjust for whitespace and punctuation
  const words = text.split(/\s+/).filter(Boolean).length;

  // Average: combine character-based and word-based estimates
  const charBasedEstimate = Math.ceil(charCount / 4);
  const wordBasedEstimate = Math.ceil(words * 1.3);

  // Return the average of both methods, rounded up
  return Math.ceil((charBasedEstimate + wordBasedEstimate) / 2);
}

/**
 * Formats a token count for display
 */
export function formatTokenCount(tokens: number): string {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  }
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}K`;
  }
  return tokens.toString();
}

/**
 * Estimates total tokens for an AI conversation
 */
export function estimateConversationTokens(
  messages: { content: string }[],
  systemPrompt?: string,
): { input: number; output: number; total: number } {
  let inputTokens = 0;
  let outputTokens = 0;

  // System prompt tokens
  if (systemPrompt) {
    inputTokens += estimateTokens(systemPrompt);
  }

  // Message tokens
  for (const message of messages) {
    const messageTokens = estimateTokens(message.content);

    // Assuming user messages are input, assistant messages are output
    // This is a simplification for display purposes
    if ('role' in message && (message as { role: string }).role === 'assistant') {
      outputTokens += messageTokens;
    } else {
      inputTokens += messageTokens;
    }
  }

  return {
    input: inputTokens,
    output: outputTokens,
    total: inputTokens + outputTokens,
  };
}
