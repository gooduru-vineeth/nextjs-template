// App Store mockups
export * from './AppStoreMockupEditor';
export { default as AppStoreMockupEditor } from './AppStoreMockupEditor';
export { DiscordMockup } from './chat/DiscordMockup';

export { IMessageMockup, iMessageMockup } from './chat/iMessageMockup';
// Chat mockups
export { WhatsAppMockup } from './chat/WhatsAppMockup';

export { MessageBubble } from './common/MessageBubble';
// Common components
export { StatusBar } from './common/StatusBar';

// Email mockups
export * from './EmailMockupEditor';
export { default as EmailMockupEditor } from './EmailMockupEditor';

// Video platform mockups
export * from './VideoMockupEditor';
export { default as VideoMockupEditor } from './VideoMockupEditor';

// Website mockups (full page)
export * from './website';
// Re-export from website subdirectory
export { EcommerceMockup, WebsiteMockup as FullWebsiteMockup } from './website';

// Website mockups
export { Canvas, ElementPalette, LayerPanel, PropertiesPanel, Toolbar, WebsiteMockup } from './WebsiteMockup';

export type { ElementStyles, MockupElement, ViewportSize, WebsiteMockupProps } from './WebsiteMockup';
