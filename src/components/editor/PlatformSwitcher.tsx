'use client';

import { useState } from 'react';

type ChatPlatform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack';
type AIPlatform = 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | 'generic';
type SocialPlatform = 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'tiktok';
type EmailPlatform = 'gmail' | 'outlook' | 'applemail';
type AppStorePlatform = 'ios-appstore' | 'google-play';

type Platform = ChatPlatform | AIPlatform | SocialPlatform | EmailPlatform | AppStorePlatform;

type PlatformCategory = 'chat' | 'ai' | 'social' | 'email' | 'appstore';

type PlatformInfo = {
  id: Platform;
  name: string;
  icon: React.ReactNode;
  category: PlatformCategory;
  description?: string;
};

type PlatformSwitcherProps = {
  currentPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  allowedCategories?: PlatformCategory[];
  variant?: 'dropdown' | 'tabs' | 'grid' | 'compact';
  showLabels?: boolean;
  className?: string;
};

const platformIcons: Record<Platform, React.ReactNode> = {
  // Chat platforms
  'whatsapp': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  'imessage': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.444 5.548 3.704 7.283l-.532 3.894a.5.5 0 00.742.503l4.067-2.239A11.7 11.7 0 0012 21c5.523 0 10-4.478 10-10s-4.477-9-10-9z" />
    </svg>
  ),
  'messenger': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.37.27.6l.05 1.88c.02.64.67 1.07 1.27.84l2.1-.83c.17-.07.36-.08.54-.04.89.2 1.82.31 2.76.31 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.89 7.37l-2.88 4.57c-.46.73-1.46.91-2.13.38l-2.29-1.72a.6.6 0 00-.72 0l-3.09 2.35c-.41.31-.95-.18-.67-.63l2.88-4.57c.46-.73 1.46-.91 2.13-.38l2.29 1.72a.6.6 0 00.72 0l3.09-2.35c.41-.31.95.18.67.63z" />
    </svg>
  ),
  'telegram': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  'discord': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  ),
  'slack': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  ),
  // AI platforms
  'chatgpt': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  ),
  'claude': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  'gemini': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 16c-3.31 0-6-2.69-6-6h2c0 2.21 1.79 4 4 4s4-1.79 4-4h2c0 3.31-2.69 6-6 6z" />
    </svg>
  ),
  'perplexity': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  'generic': (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  // Social platforms
  'linkedin': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  'instagram': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  'twitter': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  'facebook': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  'tiktok': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  // Email platforms
  'gmail': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  ),
  'outlook': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.231-.578.231h-8.186V7.082l4.504 3.255 4.259-3.201c.088-.077.168-.078.24-.004.073.073.079.149.019.228l-4.038 3.03 4.018 3.863c.06.055.09.121.09.199zm-10.412 11.693h8.188c.226 0 .42-.077.578-.23a.758.758 0 0 0 .238-.58V7.387L17.488 11.2l-3.9-2.814v10.694zm2.088-17.67c.086-.084.193-.08.32.008l8.012 6.022v-.057c0-.157-.085-.29-.256-.402L16.008.387c-.107-.084-.206-.112-.296-.084zm-3.086 3.2V21.9c0 .192.067.35.2.475a.69.69 0 0 0 .486.189h3.316V8.172l-2.956-2.2a.52.52 0 0 0-.328-.118.506.506 0 0 0-.36.148.496.496 0 0 0-.148.37v.238zM9.408 2.09v19.32c0 .192-.066.35-.199.475a.68.68 0 0 1-.486.19H.687a.68.68 0 0 1-.487-.19.636.636 0 0 1-.2-.475V2.09c0-.191.067-.35.2-.474a.684.684 0 0 1 .487-.19h8.036c.193 0 .356.063.486.19a.634.634 0 0 1 .2.474zm-2.5 8.508c0-.857-.236-1.556-.71-2.098-.473-.542-1.078-.813-1.814-.813-.737 0-1.34.271-1.812.813-.474.542-.71 1.24-.71 2.098 0 .855.236 1.551.71 2.09.472.538 1.075.807 1.812.807.736 0 1.34-.269 1.814-.807.473-.539.71-1.235.71-2.09zm-1.5 0c0 .583-.12 1.036-.358 1.361-.24.325-.561.487-.963.487s-.724-.162-.963-.487c-.24-.325-.359-.778-.359-1.361 0-.586.12-1.042.359-1.367.24-.325.561-.488.963-.488s.724.163.963.488c.239.325.358.781.358 1.367z" />
    </svg>
  ),
  'applemail': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 5.25l10.5 7.5 10.5-7.5v13.5c0 .827-.673 1.5-1.5 1.5H3c-.827 0-1.5-.673-1.5-1.5V5.25zm21 0L12 12.75 1.5 5.25M22.5 3.75H1.5c-.827 0-1.5.673-1.5 1.5v13.5c0 .827.673 1.5 1.5 1.5h21c.827 0 1.5-.673 1.5-1.5V5.25c0-.827-.673-1.5-1.5-1.5z" />
    </svg>
  ),
  // App Store platforms
  'ios-appstore': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.809 14.92l6.11-11.037c.084-.152.168-.303.256-.447.075-.122.167-.255.304-.368.157-.129.354-.195.558-.195.165 0 .335.044.496.128.349.18.59.5.66.872a1.5 1.5 0 0 1-.095.718c-.057.145-.133.29-.206.423-.082.148-.166.294-.254.448l-1.97 3.56h5.053c.598 0 1.086.49 1.086 1.095 0 .601-.488 1.091-1.086 1.091H15.83l-1.467 2.646h6.358c.598 0 1.086.49 1.086 1.095 0 .603-.488 1.091-1.086 1.091h-7.565l-3.126 5.646c-.085.15-.168.301-.257.446-.075.12-.167.254-.302.368-.158.129-.355.196-.56.196-.164 0-.334-.045-.495-.128-.349-.18-.591-.499-.66-.872a1.496 1.496 0 0 1 .095-.718c.057-.147.133-.291.207-.422.082-.149.165-.297.254-.448l2.25-4.063h-8.18c-.6 0-1.088-.489-1.088-1.091 0-.604.488-1.095 1.087-1.095h6.076l.002-.001h1.467L8.81 14.92z" />
    </svg>
  ),
  'google-play': (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.49l-2.302 2.301-8.634-8.634z" />
    </svg>
  ),
};

const platforms: PlatformInfo[] = [
  // Chat platforms
  { id: 'whatsapp', name: 'WhatsApp', icon: platformIcons.whatsapp, category: 'chat', description: 'Messaging app' },
  { id: 'imessage', name: 'iMessage', icon: platformIcons.imessage, category: 'chat', description: 'Apple messaging' },
  { id: 'messenger', name: 'Messenger', icon: platformIcons.messenger, category: 'chat', description: 'Facebook chat' },
  { id: 'telegram', name: 'Telegram', icon: platformIcons.telegram, category: 'chat', description: 'Cloud messaging' },
  { id: 'discord', name: 'Discord', icon: platformIcons.discord, category: 'chat', description: 'Community chat' },
  { id: 'slack', name: 'Slack', icon: platformIcons.slack, category: 'chat', description: 'Work messaging' },
  // AI platforms
  { id: 'chatgpt', name: 'ChatGPT', icon: platformIcons.chatgpt, category: 'ai', description: 'OpenAI assistant' },
  { id: 'claude', name: 'Claude', icon: platformIcons.claude, category: 'ai', description: 'Anthropic AI' },
  { id: 'gemini', name: 'Gemini', icon: platformIcons.gemini, category: 'ai', description: 'Google AI' },
  { id: 'perplexity', name: 'Perplexity', icon: platformIcons.perplexity, category: 'ai', description: 'Search AI' },
  { id: 'generic', name: 'Custom AI', icon: platformIcons.generic, category: 'ai', description: 'Custom interface' },
  // Social platforms
  { id: 'linkedin', name: 'LinkedIn', icon: platformIcons.linkedin, category: 'social', description: 'Professional network' },
  { id: 'instagram', name: 'Instagram', icon: platformIcons.instagram, category: 'social', description: 'Photo sharing' },
  { id: 'twitter', name: 'X / Twitter', icon: platformIcons.twitter, category: 'social', description: 'Microblogging' },
  { id: 'facebook', name: 'Facebook', icon: platformIcons.facebook, category: 'social', description: 'Social network' },
  { id: 'tiktok', name: 'TikTok', icon: platformIcons.tiktok, category: 'social', description: 'Short videos' },
  // Email platforms
  { id: 'gmail', name: 'Gmail', icon: platformIcons.gmail, category: 'email', description: 'Google Mail' },
  { id: 'outlook', name: 'Outlook', icon: platformIcons.outlook, category: 'email', description: 'Microsoft Mail' },
  { id: 'applemail', name: 'Apple Mail', icon: platformIcons.applemail, category: 'email', description: 'macOS/iOS Mail' },
  // App Store platforms
  { id: 'ios-appstore', name: 'iOS App Store', icon: platformIcons['ios-appstore'], category: 'appstore', description: 'Apple App Store' },
  { id: 'google-play', name: 'Google Play', icon: platformIcons['google-play'], category: 'appstore', description: 'Android Store' },
];

const categoryLabels: Record<PlatformCategory, string> = {
  chat: 'Chat Apps',
  ai: 'AI Assistants',
  social: 'Social Media',
  email: 'Email',
  appstore: 'App Stores',
};

const categoryColors: Record<PlatformCategory, string> = {
  chat: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  ai: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  social: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  email: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  appstore: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

export function PlatformSwitcher({
  currentPlatform,
  onPlatformChange,
  allowedCategories,
  variant = 'dropdown',
  showLabels = true,
  className = '',
}: PlatformSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PlatformCategory | 'all'>('all');

  const filteredPlatforms = platforms.filter(p =>
    !allowedCategories || allowedCategories.includes(p.category),
  );

  const currentPlatformInfo = platforms.find(p => p.id === currentPlatform);

  const displayPlatforms = activeCategory === 'all'
    ? filteredPlatforms
    : filteredPlatforms.filter(p => p.category === activeCategory);

  const categories = allowedCategories || (['chat', 'ai', 'social', 'email', 'appstore'] as PlatformCategory[]);

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {currentPlatformInfo?.icon}
          {showLabels && <span>{currentPlatformInfo?.name}</span>}
          <svg className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800">
              {/* Category tabs */}
              <div className="mb-2 flex gap-1 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`shrink-0 rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? categoryColors[cat]
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>

              {/* Platform grid */}
              <div className="grid max-h-64 grid-cols-2 gap-1 overflow-y-auto">
                {displayPlatforms.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => {
                      onPlatformChange(platform.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
                      currentPlatform === platform.id
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {platform.icon}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{platform.name}</div>
                      <div className="truncate text-xs text-gray-500 dark:text-gray-400">{platform.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Tabs variant
  if (variant === 'tabs') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {filteredPlatforms.map(platform => (
          <button
            key={platform.id}
            onClick={() => onPlatformChange(platform.id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              currentPlatform === platform.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {platform.icon}
            {showLabels && <span>{platform.name}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Grid variant
  if (variant === 'grid') {
    return (
      <div className={className}>
        {/* Category tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            All Platforms
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? categoryColors[cat]
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Platform grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {displayPlatforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => onPlatformChange(platform.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                currentPlatform === platform.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
              }`}
            >
              <div className={`flex size-12 items-center justify-center rounded-full ${
                currentPlatform === platform.id
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
              >
                {platform.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{platform.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${categoryColors[platform.category]}`}>
                {categoryLabels[platform.category]}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {filteredPlatforms.map(platform => (
        <button
          key={platform.id}
          onClick={() => onPlatformChange(platform.id)}
          className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
            currentPlatform === platform.id
              ? 'bg-blue-500 text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
          }`}
          title={platform.name}
        >
          {platform.icon}
        </button>
      ))}
    </div>
  );
}

// Grouped platform selector
type GroupedPlatformSelectorProps = {
  currentPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  className?: string;
};

export function GroupedPlatformSelector({
  currentPlatform,
  onPlatformChange,
  className = '',
}: GroupedPlatformSelectorProps) {
  const groupedPlatforms = platforms.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {} as Record<PlatformCategory, PlatformInfo[]>);

  return (
    <div className={`space-y-6 ${className}`}>
      {(Object.entries(groupedPlatforms) as [PlatformCategory, PlatformInfo[]][]).map(([category, categoryPlatforms]) => (
        <div key={category}>
          <h3 className={`mb-3 text-sm font-semibold ${
            category === 'chat'
              ? 'text-green-600 dark:text-green-400'
              : category === 'ai'
                ? 'text-purple-600 dark:text-purple-400'
                : category === 'social'
                  ? 'text-blue-600 dark:text-blue-400'
                  : category === 'email'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-orange-600 dark:text-orange-400'
          }`}
          >
            {categoryLabels[category]}
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {categoryPlatforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => onPlatformChange(platform.id)}
                className={`flex flex-col items-center gap-1 rounded-lg p-3 transition-all ${
                  currentPlatform === platform.id
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {platform.icon}
                <span className="text-xs font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export type { Platform, PlatformCategory, PlatformInfo };
