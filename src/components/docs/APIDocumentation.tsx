'use client';

import { useState } from 'react';

type APIEndpoint = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  authentication: boolean;
  requestBody?: {
    type: string;
    properties: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
  };
  responseExample: string;
  statusCodes: { code: number; description: string }[];
};

const apiEndpoints: APIEndpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/mockups',
    title: 'Create Mockup',
    description: 'Create a new mockup from provided data. Supports chat, AI, and social media mockup types.',
    authentication: true,
    requestBody: {
      type: 'object',
      properties: [
        { name: 'type', type: 'string', required: true, description: 'Mockup type: "chat", "ai", or "social"' },
        { name: 'platform', type: 'string', required: true, description: 'Platform name (e.g., "whatsapp", "chatgpt", "twitter")' },
        { name: 'data', type: 'object', required: true, description: 'Mockup-specific data (messages, posts, etc.)' },
        { name: 'appearance', type: 'object', required: false, description: 'Visual customization options' },
        { name: 'name', type: 'string', required: false, description: 'Optional name for the mockup' },
      ],
    },
    responseExample: `{
  "id": "mock_abc123",
  "type": "chat",
  "platform": "whatsapp",
  "data": { ... },
  "appearance": { ... },
  "createdAt": "2026-01-12T10:30:00Z",
  "exportUrl": "/api/v1/mockups/mock_abc123/export"
}`,
    statusCodes: [
      { code: 201, description: 'Mockup created successfully' },
      { code: 400, description: 'Invalid request body' },
      { code: 401, description: 'Unauthorized - Invalid or missing API key' },
      { code: 429, description: 'Rate limit exceeded' },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/mockups/:id',
    title: 'Get Mockup',
    description: 'Retrieve a specific mockup by its ID.',
    authentication: true,
    responseExample: `{
  "id": "mock_abc123",
  "type": "chat",
  "platform": "whatsapp",
  "data": {
    "participants": [...],
    "messages": [...]
  },
  "appearance": {
    "theme": "light",
    "showTimestamps": true
  },
  "createdAt": "2026-01-12T10:30:00Z",
  "updatedAt": "2026-01-12T10:35:00Z"
}`,
    statusCodes: [
      { code: 200, description: 'Success' },
      { code: 401, description: 'Unauthorized' },
      { code: 404, description: 'Mockup not found' },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/mockups/:id/export',
    title: 'Export Mockup',
    description: 'Export a mockup as an image file. Supports PNG, JPG, SVG, and PDF formats.',
    authentication: true,
    responseExample: `// Returns image binary with appropriate Content-Type header
// Content-Type: image/png (or image/jpeg, image/svg+xml, application/pdf)`,
    statusCodes: [
      { code: 200, description: 'Returns image file' },
      { code: 400, description: 'Invalid export format' },
      { code: 401, description: 'Unauthorized' },
      { code: 404, description: 'Mockup not found' },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/mockups',
    title: 'List Mockups',
    description: 'List all mockups for the authenticated user. Supports pagination and filtering.',
    authentication: true,
    responseExample: `{
  "data": [
    {
      "id": "mock_abc123",
      "type": "chat",
      "platform": "whatsapp",
      "name": "Customer Support Demo",
      "createdAt": "2026-01-12T10:30:00Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "hasMore": true
  }
}`,
    statusCodes: [
      { code: 200, description: 'Success' },
      { code: 401, description: 'Unauthorized' },
    ],
  },
  {
    method: 'PUT',
    path: '/api/v1/mockups/:id',
    title: 'Update Mockup',
    description: 'Update an existing mockup with new data or appearance settings.',
    authentication: true,
    requestBody: {
      type: 'object',
      properties: [
        { name: 'data', type: 'object', required: false, description: 'Updated mockup data' },
        { name: 'appearance', type: 'object', required: false, description: 'Updated appearance settings' },
        { name: 'name', type: 'string', required: false, description: 'Updated mockup name' },
      ],
    },
    responseExample: `{
  "id": "mock_abc123",
  "type": "chat",
  "platform": "whatsapp",
  "data": { ... },
  "appearance": { ... },
  "updatedAt": "2026-01-12T11:00:00Z"
}`,
    statusCodes: [
      { code: 200, description: 'Mockup updated successfully' },
      { code: 400, description: 'Invalid request body' },
      { code: 401, description: 'Unauthorized' },
      { code: 404, description: 'Mockup not found' },
    ],
  },
  {
    method: 'DELETE',
    path: '/api/v1/mockups/:id',
    title: 'Delete Mockup',
    description: 'Permanently delete a mockup. This action cannot be undone.',
    authentication: true,
    responseExample: `{
  "success": true,
  "message": "Mockup deleted successfully"
}`,
    statusCodes: [
      { code: 200, description: 'Mockup deleted successfully' },
      { code: 401, description: 'Unauthorized' },
      { code: 404, description: 'Mockup not found' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/templates',
    title: 'Create from Template',
    description: 'Create a new mockup from a predefined template.',
    authentication: true,
    requestBody: {
      type: 'object',
      properties: [
        { name: 'templateId', type: 'string', required: true, description: 'ID of the template to use' },
        { name: 'customizations', type: 'object', required: false, description: 'Custom values to override template defaults' },
      ],
    },
    responseExample: `{
  "id": "mock_xyz789",
  "type": "chat",
  "platform": "imessage",
  "templateId": "tpl_customer_support",
  "data": { ... },
  "createdAt": "2026-01-12T10:30:00Z"
}`,
    statusCodes: [
      { code: 201, description: 'Mockup created from template' },
      { code: 400, description: 'Invalid template ID or customizations' },
      { code: 401, description: 'Unauthorized' },
      { code: 404, description: 'Template not found' },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/templates',
    title: 'List Templates',
    description: 'List all available mockup templates.',
    authentication: true,
    responseExample: `{
  "data": [
    {
      "id": "tpl_customer_support",
      "name": "Customer Support Chat",
      "type": "chat",
      "platform": "whatsapp",
      "thumbnail": "https://..."
    },
    ...
  ],
  "categories": ["chat", "ai", "social"]
}`,
    statusCodes: [
      { code: 200, description: 'Success' },
      { code: 401, description: 'Unauthorized' },
    ],
  },
];

const codeExamples = {
  curl: `curl -X POST https://api.mockflow.com/v1/mockups \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "chat",
    "platform": "whatsapp",
    "data": {
      "participants": [
        { "id": "user", "name": "You" },
        { "id": "contact", "name": "John" }
      ],
      "messages": [
        {
          "id": "1",
          "senderId": "contact",
          "content": "Hey! How are you?",
          "timestamp": "10:30 AM"
        },
        {
          "id": "2",
          "senderId": "user",
          "content": "Im doing great, thanks!",
          "timestamp": "10:31 AM"
        }
      ]
    }
  }'`,
  javascript: `import { MockFlowClient } from '@mockflow/sdk';

const client = new MockFlowClient('YOUR_API_KEY');

// Create a WhatsApp mockup
const mockup = await client.mockups.create({
  type: 'chat',
  platform: 'whatsapp',
  data: {
    participants: [
      { id: 'user', name: 'You' },
      { id: 'contact', name: 'John' }
    ],
    messages: [
      {
        id: '1',
        senderId: 'contact',
        content: 'Hey! How are you?',
        timestamp: '10:30 AM'
      },
      {
        id: '2',
        senderId: 'user',
        content: 'Im doing great, thanks!',
        timestamp: '10:31 AM'
      }
    ]
  }
});

// Export as PNG
const imageBuffer = await client.mockups.export(mockup.id, {
  format: 'png',
  scale: 2
});`,
  python: `from mockflow import MockFlowClient

client = MockFlowClient("YOUR_API_KEY")

# Create a WhatsApp mockup
mockup = client.mockups.create(
    type="chat",
    platform="whatsapp",
    data={
        "participants": [
            {"id": "user", "name": "You"},
            {"id": "contact", "name": "John"}
        ],
        "messages": [
            {
                "id": "1",
                "senderId": "contact",
                "content": "Hey! How are you?",
                "timestamp": "10:30 AM"
            },
            {
                "id": "2",
                "senderId": "user",
                "content": "I'm doing great, thanks!",
                "timestamp": "10:31 AM"
            }
        ]
    }
)

# Export as PNG
image_bytes = client.mockups.export(
    mockup.id,
    format="png",
    scale=2
)`,
};

export function APIDocumentation() {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'javascript' | 'python'>('javascript');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'POST':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'PUT':
      case 'PATCH':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'DELETE':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'authentication', label: 'Authentication' },
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'endpoints', label: 'API Endpoints' },
    { id: 'rate-limits', label: 'Rate Limits' },
    { id: 'errors', label: 'Error Handling' },
    { id: 'sdks', label: 'SDKs & Libraries' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Navigation */}
      <nav className="fixed top-0 left-0 h-full w-64 overflow-y-auto border-r border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">API Reference</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">v1.0</p>
        </div>

        <ul className="space-y-1">
          {sections.map(section => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Need Help?</h3>
          <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
            Check out our GitHub for examples and community support.
          </p>
          <a
            href="https://github.com/mockflow/api-examples"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400"
          >
            View Examples
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-4xl">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">API Overview</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                The MockFlow API allows you to programmatically create, manage, and export mockups.
                Build integrations, automate workflows, and generate mockups at scale.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: 'RESTful',
                    description: 'Simple REST API with JSON responses',
                    icon: (
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Secure',
                    description: 'API key authentication over HTTPS',
                    icon: (
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Fast',
                    description: 'Generate mockups in milliseconds',
                    icon: (
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      {feature.icon}
                    </div>
                    <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-gray-200 bg-gray-900 p-6 dark:border-gray-700">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">Base URL</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode('https://api.mockflow.com/v1')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    {copiedCode ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code className="text-lg text-green-400">https://api.mockflow.com/v1</code>
              </div>
            </section>
          )}

          {/* Authentication Section */}
          {activeSection === 'authentication' && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Authentication</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                All API requests require authentication using an API key. Include your API key
                in the Authorization header of every request.
              </p>

              <div className="mt-8 rounded-xl border border-gray-200 bg-gray-900 p-6 dark:border-gray-700">
                <div className="mb-2 text-sm text-gray-400">HTTP Header</div>
                <code className="text-green-400">Authorization: Bearer YOUR_API_KEY</code>
              </div>

              <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 size-5 shrink-0 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Keep your API key secure</h4>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                      Never expose your API key in client-side code. Always make API requests from your server.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">Getting an API Key</h3>
              <ol className="mt-4 list-inside list-decimal space-y-2 text-gray-600 dark:text-gray-400">
                <li>Log in to your MockFlow account</li>
                <li>Go to Settings &gt; API Keys</li>
                <li>Click &quot;Generate New Key&quot;</li>
                <li>Copy and securely store your API key</li>
              </ol>
            </section>
          )}

          {/* Quick Start Section */}
          {activeSection === 'quick-start' && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Quick Start</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Get started with the MockFlow API in just a few lines of code.
              </p>

              {/* Code Tabs */}
              <div className="mt-8">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  {(['javascript', 'python', 'curl'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveCodeTab(tab)}
                      className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                        activeCodeTab === tab
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {tab === 'javascript' ? 'JavaScript' : tab === 'python' ? 'Python' : 'cURL'}
                    </button>
                  ))}
                </div>

                <div className="relative mt-4 rounded-xl bg-gray-900 p-6">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(codeExamples[activeCodeTab])}
                    className="absolute top-4 right-4 rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-600"
                  >
                    {copiedCode ? 'Copied!' : 'Copy'}
                  </button>
                  <pre className="overflow-x-auto text-sm">
                    <code className="text-gray-300">{codeExamples[activeCodeTab]}</code>
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* Endpoints Section */}
          {activeSection === 'endpoints' && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">API Endpoints</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Complete reference of all available API endpoints.
              </p>

              <div className="mt-8 space-y-6">
                {apiEndpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    {/* Endpoint Header */}
                    <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700/50">
                      <span className={`rounded px-2 py-1 text-xs font-bold ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-sm text-gray-900 dark:text-white">{endpoint.path}</code>
                      {endpoint.authentication && (
                        <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Auth Required
                        </span>
                      )}
                    </div>

                    {/* Endpoint Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{endpoint.title}</h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{endpoint.description}</p>

                      {/* Request Body */}
                      {endpoint.requestBody && (
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Request Body</h4>
                          <div className="mt-3 overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                  <th className="pb-2 text-left font-medium text-gray-500">Parameter</th>
                                  <th className="pb-2 text-left font-medium text-gray-500">Type</th>
                                  <th className="pb-2 text-left font-medium text-gray-500">Required</th>
                                  <th className="pb-2 text-left font-medium text-gray-500">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {endpoint.requestBody.properties.map((prop, propIndex) => (
                                  <tr key={propIndex}>
                                    <td className="py-2 font-mono text-blue-600 dark:text-blue-400">{prop.name}</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{prop.type}</td>
                                    <td className="py-2">
                                      {prop.required
                                        ? (
                                            <span className="text-red-500">Yes</span>
                                          )
                                        : (
                                            <span className="text-gray-400">No</span>
                                          )}
                                    </td>
                                    <td className="py-2 text-gray-600 dark:text-gray-400">{prop.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Response Example */}
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Response Example</h4>
                        <div className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-4">
                          <pre className="text-sm text-gray-300">{endpoint.responseExample}</pre>
                        </div>
                      </div>

                      {/* Status Codes */}
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status Codes</h4>
                        <div className="mt-3 space-y-2">
                          {endpoint.statusCodes.map((status, statusIndex) => (
                            <div key={statusIndex} className="flex items-center gap-3 text-sm">
                              <span className={`rounded px-2 py-0.5 font-mono ${
                                status.code < 300
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : status.code < 500
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}
                              >
                                {status.code}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">{status.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rate Limits Section */}
          {activeSection === 'rate-limits' && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Rate Limits</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                API rate limits help ensure fair usage and platform stability.
              </p>

              <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Plan</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Requests/min</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Requests/day</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Exports/day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Free</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">10</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">100</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">10</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Pro</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">60</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">5,000</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">500</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Team</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">120</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">20,000</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">2,000</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Enterprise</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Custom</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Custom</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Custom</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white">Rate Limit Headers</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Each response includes headers to help you track your usage:
                </p>
                <ul className="mt-3 space-y-1 font-mono text-sm text-gray-600 dark:text-gray-400">
                  <li>
                    <code className="text-blue-600 dark:text-blue-400">X-RateLimit-Limit</code>
                    : Maximum requests per minute
                  </li>
                  <li>
                    <code className="text-blue-600 dark:text-blue-400">X-RateLimit-Remaining</code>
                    : Remaining requests
                  </li>
                  <li>
                    <code className="text-blue-600 dark:text-blue-400">X-RateLimit-Reset</code>
                    : Unix timestamp when limit resets
                  </li>
                </ul>
              </div>
            </section>
          )}

          {/* Errors Section */}
          {activeSection === 'errors' && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Error Handling</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                The API uses standard HTTP status codes and returns detailed error messages in JSON format.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { code: 400, name: 'Bad Request', description: 'Invalid request body or parameters' },
                  { code: 401, name: 'Unauthorized', description: 'Invalid or missing API key' },
                  { code: 403, name: 'Forbidden', description: 'Insufficient permissions' },
                  { code: 404, name: 'Not Found', description: 'Resource does not exist' },
                  { code: 429, name: 'Too Many Requests', description: 'Rate limit exceeded' },
                  { code: 500, name: 'Internal Server Error', description: 'Unexpected server error' },
                ].map(error => (
                  <div
                    key={error.code}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <span className={`rounded px-3 py-1 font-mono text-sm font-bold ${
                      error.code < 500
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                    >
                      {error.code}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{error.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{error.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Error Response Format</h3>
                <div className="mt-4 rounded-xl bg-gray-900 p-6">
                  <pre className="text-sm text-gray-300">
                    {`{
  "error": {
    "code": "invalid_request",
    "message": "The 'platform' field is required",
    "details": {
      "field": "platform",
      "expected": "string"
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* SDKs Section */}
          {activeSection === 'sdks' && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">SDKs & Libraries</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Official client libraries to help you integrate MockFlow into your applications.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {[
                  {
                    name: 'JavaScript / TypeScript',
                    icon: '🟨',
                    package: '@mockflow/sdk',
                    install: 'npm install @mockflow/sdk',
                  },
                  {
                    name: 'Python',
                    icon: '🐍',
                    package: 'mockflow',
                    install: 'pip install mockflow',
                  },
                  {
                    name: 'Ruby',
                    icon: '💎',
                    package: 'mockflow',
                    install: 'gem install mockflow',
                  },
                  {
                    name: 'Go',
                    icon: '🐹',
                    package: 'github.com/mockflow/go-sdk',
                    install: 'go get github.com/mockflow/go-sdk',
                  },
                ].map((sdk, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sdk.icon}</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{sdk.name}</h3>
                    </div>
                    <div className="mt-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                      <code className="text-sm text-gray-700 dark:text-gray-300">{sdk.install}</code>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      Package:
                      {' '}
                      <code className="text-blue-600 dark:text-blue-400">{sdk.package}</code>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default APIDocumentation;
