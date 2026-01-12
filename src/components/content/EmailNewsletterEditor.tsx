'use client';

import {
  AlignCenter,
  AlignLeft,
  Edit2,
  Eye,
  Globe,
  GripVertical,
  Image,
  Layers,
  Mail,
  Monitor,
  Plus,
  Redo,
  Send,
  Smartphone,
  Square,
  Trash2,
  Type,
  Undo,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type BlockType = 'header' | 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'columns' | 'social' | 'footer';
type EmailStatus = 'draft' | 'scheduled' | 'sent' | 'archived';
type PreviewMode = 'desktop' | 'mobile';

type ContentBlock = {
  id: string;
  type: BlockType;
  content: Record<string, unknown>;
  styles: Record<string, string>;
};

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  blocks: ContentBlock[];
  status: EmailStatus;
  createdAt: Date;
  scheduledFor?: Date;
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
};

type NewsletterConfig = {
  templates: EmailTemplate[];
  brandColor: string;
  brandName: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  footerText: string;
  unsubscribeLink: string;
  socialLinks: { platform: string; url: string }[];
};

type Variant = 'full' | 'compact' | 'widget' | 'dashboard';

type EmailNewsletterEditorProps = {
  variant?: Variant;
  config?: Partial<NewsletterConfig>;
  onConfigChange?: (config: NewsletterConfig) => void;
  className?: string;
};

// Default blocks
const defaultBlocks: ContentBlock[] = [
  {
    id: '1',
    type: 'header',
    content: { logoUrl: '', companyName: 'TechCorp', tagline: 'Your weekly tech digest' },
    styles: { backgroundColor: '#3B82F6', padding: '32px', textAlign: 'center' },
  },
  {
    id: '2',
    type: 'text',
    content: { text: 'Hello {firstName},\n\nWelcome to our weekly newsletter! Here are the top stories you might have missed.' },
    styles: { fontSize: '16px', lineHeight: '1.6', padding: '24px', color: '#374151' },
  },
  {
    id: '3',
    type: 'image',
    content: { src: '', alt: 'Featured Image', caption: 'Our latest product launch' },
    styles: { width: '100%', borderRadius: '8px', padding: '0 24px' },
  },
  {
    id: '4',
    type: 'text',
    content: { text: 'This week, we launched our most ambitious feature yet. Read on to learn more about how it can transform your workflow.' },
    styles: { fontSize: '16px', lineHeight: '1.6', padding: '24px', color: '#374151' },
  },
  {
    id: '5',
    type: 'button',
    content: { text: 'Read More', url: '#' },
    styles: { backgroundColor: '#3B82F6', color: '#FFFFFF', padding: '12px 32px', borderRadius: '6px', textAlign: 'center' },
  },
  {
    id: '6',
    type: 'divider',
    content: {},
    styles: { borderColor: '#E5E7EB', margin: '24px' },
  },
  {
    id: '7',
    type: 'footer',
    content: { address: '123 Tech Street, San Francisco, CA 94105', unsubscribeText: 'Unsubscribe from this list' },
    styles: { backgroundColor: '#F3F4F6', padding: '24px', fontSize: '12px', color: '#6B7280', textAlign: 'center' },
  },
];

const defaultTemplate: EmailTemplate = {
  id: '1',
  name: 'Weekly Newsletter',
  subject: 'Your Weekly Tech Digest - {date}',
  preheader: 'The top stories from this week in tech',
  blocks: defaultBlocks,
  status: 'draft',
  createdAt: new Date(),
};

const defaultConfig: NewsletterConfig = {
  templates: [defaultTemplate],
  brandColor: '#3B82F6',
  brandName: 'TechCorp',
  fromName: 'TechCorp Team',
  fromEmail: 'hello@techcorp.com',
  replyTo: 'support@techcorp.com',
  footerText: 'You received this email because you subscribed to our newsletter.',
  unsubscribeLink: '#',
  socialLinks: [
    { platform: 'twitter', url: '#' },
    { platform: 'linkedin', url: '#' },
    { platform: 'facebook', url: '#' },
  ],
};

// Block type configs
const blockTypes: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: 'header', label: 'Header', icon: <Type className="h-5 w-5" /> },
  { type: 'text', label: 'Text', icon: <AlignLeft className="h-5 w-5" /> },
  { type: 'image', label: 'Image', icon: <Image className="h-5 w-5" /> },
  { type: 'button', label: 'Button', icon: <Square className="h-5 w-5" /> },
  { type: 'divider', label: 'Divider', icon: <Layers className="h-5 w-5" /> },
  { type: 'spacer', label: 'Spacer', icon: <Square className="h-5 w-5" /> },
  { type: 'columns', label: 'Columns', icon: <Layers className="h-5 w-5" /> },
  { type: 'social', label: 'Social', icon: <Globe className="h-5 w-5" /> },
  { type: 'footer', label: 'Footer', icon: <AlignCenter className="h-5 w-5" /> },
];

export function EmailNewsletterEditor({
  variant = 'full',
  config: initialConfig,
  onConfigChange,
  className = '',
}: EmailNewsletterEditorProps) {
  const [config, setConfig] = useState<NewsletterConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>(config.templates[0]?.id ?? '');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');

  const updateConfig = useCallback((updates: Partial<NewsletterConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  }, [config, onConfigChange]);

  const currentTemplate = config.templates.find(t => t.id === selectedTemplate);

  const updateTemplate = (templateId: string, updates: Partial<EmailTemplate>) => {
    updateConfig({
      templates: config.templates.map(t =>
        t.id === templateId ? { ...t, ...updates } : t,
      ),
    });
  };

  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    if (!currentTemplate) {
      return;
    }
    updateTemplate(currentTemplate.id, {
      blocks: currentTemplate.blocks.map(b =>
        b.id === blockId ? { ...b, ...updates } : b,
      ),
    });
  };

  const addBlock = (type: BlockType, afterId?: string) => {
    if (!currentTemplate) {
      return;
    }
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
    };
    const blocks = [...currentTemplate.blocks];
    if (afterId) {
      const index = blocks.findIndex(b => b.id === afterId);
      blocks.splice(index + 1, 0, newBlock);
    } else {
      blocks.push(newBlock);
    }
    updateTemplate(currentTemplate.id, { blocks });
    setSelectedBlock(newBlock.id);
  };

  const deleteBlock = (blockId: string) => {
    if (!currentTemplate) {
      return;
    }
    updateTemplate(currentTemplate.id, {
      blocks: currentTemplate.blocks.filter(b => b.id !== blockId),
    });
    if (selectedBlock === blockId) {
      setSelectedBlock(null);
    }
  };

  const getDefaultContent = (type: BlockType): Record<string, unknown> => {
    const defaults: Record<BlockType, Record<string, unknown>> = {
      header: { logoUrl: '', companyName: config.brandName, tagline: '' },
      text: { text: 'Enter your text here...' },
      image: { src: '', alt: 'Image', caption: '' },
      button: { text: 'Click Here', url: '#' },
      divider: {},
      spacer: { height: 32 },
      columns: { count: 2, content: [] },
      social: { platforms: config.socialLinks },
      footer: { address: '', unsubscribeText: 'Unsubscribe' },
    };
    return defaults[type];
  };

  const getDefaultStyles = (type: BlockType): Record<string, string> => {
    const defaults: Record<BlockType, Record<string, string>> = {
      header: { backgroundColor: config.brandColor, padding: '32px', textAlign: 'center' },
      text: { fontSize: '16px', lineHeight: '1.6', padding: '24px', color: '#374151' },
      image: { width: '100%', padding: '0 24px' },
      button: { backgroundColor: config.brandColor, color: '#FFFFFF', padding: '12px 32px', borderRadius: '6px', textAlign: 'center' },
      divider: { borderColor: '#E5E7EB', margin: '24px' },
      spacer: { height: '32px' },
      columns: { padding: '24px', gap: '16px' },
      social: { padding: '24px', textAlign: 'center' },
      footer: { backgroundColor: '#F3F4F6', padding: '24px', fontSize: '12px', color: '#6B7280', textAlign: 'center' },
    };
    return defaults[type];
  };

  // Render Block
  const renderBlock = (block: ContentBlock, isPreview: boolean = false) => {
    const isSelected = selectedBlock === block.id && !isPreview;
    const content = block.content;

    const wrapperClasses = `relative ${isSelected ? 'ring-2 ring-blue-500' : ''} ${!isPreview ? 'cursor-pointer hover:ring-1 hover:ring-blue-300' : ''}`;

    const handleClick = () => {
      if (!isPreview) {
        setSelectedBlock(block.id);
      }
    };

    switch (block.type) {
      case 'header':
        return (
          <div
            key={block.id}
            className={wrapperClasses}
            style={{
              backgroundColor: block.styles.backgroundColor,
              padding: block.styles.padding,
              textAlign: block.styles.textAlign as 'left' | 'center' | 'right',
            }}
            onClick={handleClick}
          >
            <h1 className="mb-1 text-2xl font-bold text-white">
              {String(content.companyName ?? '')}
            </h1>
            {content.tagline
              ? (
                  <p className="text-sm text-white/80">{String(content.tagline)}</p>
                )
              : null}
          </div>
        );

      case 'text':
        return (
          <div
            key={block.id}
            className={wrapperClasses}
            style={{ padding: block.styles.padding }}
            onClick={handleClick}
          >
            <p
              style={{
                fontSize: block.styles.fontSize,
                lineHeight: block.styles.lineHeight,
                color: block.styles.color,
              }}
              className="whitespace-pre-wrap"
            >
              {String(content.text ?? '')}
            </p>
          </div>
        );

      case 'image':
        return (
          <div
            key={block.id}
            className={wrapperClasses}
            style={{ padding: block.styles.padding }}
            onClick={handleClick}
          >
            <div
              className="flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700"
              style={{ height: '200px', borderRadius: block.styles.borderRadius }}
            >
              <Image className="h-12 w-12 text-gray-400" />
            </div>
            {content.caption
              ? (
                  <p className="mt-2 text-center text-sm text-gray-500">{String(content.caption)}</p>
                )
              : null}
          </div>
        );

      case 'button':
        return (
          <div
            key={block.id}
            className={wrapperClasses}
            style={{ padding: '24px', textAlign: block.styles.textAlign as 'left' | 'center' | 'right' }}
            onClick={handleClick}
          >
            <button
              style={{
                backgroundColor: block.styles.backgroundColor,
                color: block.styles.color,
                padding: block.styles.padding,
                borderRadius: block.styles.borderRadius,
              }}
              className="font-medium"
            >
              {String(content.text ?? '')}
            </button>
          </div>
        );

      case 'divider':
        return (
          <div
            key={block.id}
            className={wrapperClasses}
            style={{ margin: block.styles.margin }}
            onClick={handleClick}
          >
            <hr style={{ borderColor: block.styles.borderColor }} />
          </div>
        );

      case 'spacer':
        return (
          <div
            key={block.id}
            className={wrapperClasses}
            style={{ height: block.styles.height }}
            onClick={handleClick}
          >
            {!isPreview && (
              <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-300 text-sm text-gray-400">
                Spacer
              </div>
            )}
          </div>
        );

      case 'footer':
        return (
          <div
            key={block.id}
            className={wrapperClasses}
            style={{
              backgroundColor: block.styles.backgroundColor,
              padding: block.styles.padding,
              textAlign: block.styles.textAlign as 'left' | 'center' | 'right',
            }}
            onClick={handleClick}
          >
            <p style={{ fontSize: block.styles.fontSize, color: block.styles.color }}>
              {content.address as string}
            </p>
            <p className="mt-2">
              <a href="#" style={{ color: config.brandColor, fontSize: block.styles.fontSize }}>
                {content.unsubscribeText as string}
              </a>
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // Render Block Editor
  const renderBlockEditor = () => {
    const block = currentTemplate?.blocks.find(b => b.id === selectedBlock);
    if (!block) {
      return (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <Layers className="mx-auto mb-2 h-8 w-8 opacity-50" />
          <p>Select a block to edit</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 capitalize dark:text-white">
            {block.type}
            {' '}
            Settings
          </h3>
          <button
            onClick={() => deleteBlock(block.id)}
            className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Content editors based on block type */}
        {block.type === 'header' && (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                value={block.content.companyName as string}
                onChange={e => updateBlock(block.id, { content: { ...block.content, companyName: e.target.value } })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tagline
              </label>
              <input
                type="text"
                value={block.content.tagline as string}
                onChange={e => updateBlock(block.id, { content: { ...block.content, tagline: e.target.value } })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        )}

        {block.type === 'text' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Text Content
            </label>
            <textarea
              value={block.content.text as string}
              onChange={e => updateBlock(block.id, { content: { ...block.content, text: e.target.value } })}
              rows={6}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        )}

        {block.type === 'button' && (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Button Text
              </label>
              <input
                type="text"
                value={block.content.text as string}
                onChange={e => updateBlock(block.id, { content: { ...block.content, text: e.target.value } })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                URL
              </label>
              <input
                type="url"
                value={block.content.url as string}
                onChange={e => updateBlock(block.id, { content: { ...block.content, url: e.target.value } })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Style editors */}
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <h4 className="mb-3 font-medium text-gray-900 dark:text-white">Styles</h4>
          <div className="space-y-3">
            {block.styles.backgroundColor !== undefined && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={block.styles.backgroundColor}
                    onChange={e => updateBlock(block.id, { styles: { ...block.styles, backgroundColor: e.target.value } })}
                    className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={block.styles.backgroundColor}
                    onChange={e => updateBlock(block.id, { styles: { ...block.styles, backgroundColor: e.target.value } })}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            )}
            {block.styles.padding !== undefined && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Padding
                </label>
                <input
                  type="text"
                  value={block.styles.padding}
                  onChange={e => updateBlock(block.id, { styles: { ...block.styles, padding: e.target.value } })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render based on variant
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="p-4">
          <div className="mb-4 flex items-center space-x-2">
            <Mail className="h-5 w-5" style={{ color: config.brandColor }} />
            <span className="font-medium text-gray-900 dark:text-white">Newsletter Editor</span>
          </div>
          <div className="space-y-2">
            {config.templates.slice(0, 3).map(template => (
              <div key={template.id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {template.subject}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    template.status === 'sent'
                      ? 'bg-green-100 text-green-600'
                      : template.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                  >
                    {template.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="mb-3 flex items-center space-x-3">
          <Mail className="h-5 w-5" style={{ color: config.brandColor }} />
          <span className="font-medium text-gray-900 dark:text-white">Email Newsletter</span>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
          <div className="text-center text-white">
            <Send className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm font-medium">{config.brandName}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5" style={{ color: config.brandColor }} />
            <span className="font-medium text-gray-900 dark:text-white">Newsletter Editor</span>
          </div>
          <button
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
            style={{ backgroundColor: config.brandColor }}
          >
            <Plus className="mr-1 inline h-4 w-4" />
            New Email
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4 grid grid-cols-2 gap-4">
            {[
              { label: 'Drafts', value: config.templates.filter(t => t.status === 'draft').length, icon: Edit2 },
              { label: 'Sent', value: config.templates.filter(t => t.status === 'sent').length, icon: Send },
            ].map((stat, i) => (
              <div key={i} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <stat.icon className="mb-1 h-4 w-4 text-gray-400" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="max-h-[250px] space-y-2 overflow-auto">
            {config.templates.map(template => (
              <div
                key={template.id}
                className="cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {template.name}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {template.subject}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex h-screen flex-col bg-gray-100 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6" style={{ color: config.brandColor }} />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {config.brandName}
              </span>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <select
              value={selectedTemplate}
              onChange={e => setSelectedTemplate(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {config.templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Undo className="h-5 w-5 text-gray-500" />
            </button>
            <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Redo className="h-5 w-5 text-gray-500" />
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 ${previewMode === 'desktop' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                <Monitor className="h-5 w-5 text-gray-500" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 ${previewMode === 'mobile' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                <Smartphone className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <button className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              <Eye className="mr-2 inline h-5 w-5" />
              Preview
            </button>
            <button
              className="rounded-lg px-4 py-2 font-medium text-white"
              style={{ backgroundColor: config.brandColor }}
            >
              <Send className="mr-2 inline h-5 w-5" />
              Send
            </button>
          </div>
        </div>

        {/* Subject Line */}
        {currentTemplate && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Subject</label>
                <input
                  type="text"
                  value={currentTemplate.subject}
                  onChange={e => updateTemplate(currentTemplate.id, { subject: e.target.value })}
                  className="w-full bg-transparent font-medium text-gray-900 focus:outline-none dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Preheader</label>
                <input
                  type="text"
                  value={currentTemplate.preheader}
                  onChange={e => updateTemplate(currentTemplate.id, { preheader: e.target.value })}
                  className="w-full bg-transparent text-gray-900 focus:outline-none dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Block Palette */}
        <div className="w-64 overflow-auto border-r border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Content Blocks</h3>
          <div className="grid grid-cols-2 gap-2">
            {blockTypes.map(blockType => (
              <button
                key={blockType.type}
                onClick={() => addBlock(blockType.type)}
                className="rounded-lg border border-gray-200 p-3 text-center transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-900/20"
              >
                <div className="mb-1 flex justify-center text-gray-500">{blockType.icon}</div>
                <span className="text-xs text-gray-700 dark:text-gray-300">{blockType.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex flex-1 justify-center overflow-auto p-8">
          <div
            className={`bg-white shadow-lg transition-all dark:bg-gray-800 ${
              previewMode === 'mobile' ? 'w-[375px]' : 'w-[600px]'
            }`}
          >
            {currentTemplate?.blocks.map(block => (
              <div key={block.id} className="group relative">
                {renderBlock(block)}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded bg-white p-1 shadow-sm hover:bg-gray-100">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="rounded bg-white p-1 shadow-sm hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => addBlock('text')}
              className="w-full border-2 border-dashed border-gray-300 py-4 text-gray-400 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-gray-600"
            >
              <Plus className="mx-auto h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 overflow-auto border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          {renderBlockEditor()}
        </div>
      </div>
    </div>
  );
}

export default EmailNewsletterEditor;
