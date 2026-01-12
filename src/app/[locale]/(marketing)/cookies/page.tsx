import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Cookie Policy</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Last updated: January 10, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">1. What Are Cookies?</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Cookies allow websites to recognize your device and remember information about your visit, such as your preferred language and other settings. This can make your next visit easier and the site more useful to you.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">2. How We Use Cookies</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              MockFlow uses cookies for various purposes, including:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>Keeping you signed in to your account</li>
              <li>Remembering your preferences and settings</li>
              <li>Understanding how you use our website</li>
              <li>Improving our services based on usage data</li>
              <li>Providing personalized content and features</li>
              <li>Analyzing website traffic and performance</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">3. Types of Cookies We Use</h2>

            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Essential Cookies</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation, secure access to your account, and remembering your login status. The website cannot function properly without these cookies.
            </p>
            <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Cookie Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">session_token</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">User authentication</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">7 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">csrf_token</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Security protection</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Preference Cookies</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              These cookies allow the website to remember choices you make (such as your language preference or theme) and provide enhanced, personalized features.
            </p>
            <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Cookie Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">theme</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Dark/light mode preference</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">locale</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Language preference</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">editor_settings</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Editor preferences</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Analytics Cookies</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.
            </p>
            <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Cookie Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">_ph_*</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">PostHog analytics</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">4. Third-Party Cookies</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Some cookies are placed by third-party services that appear on our pages. We use the following third-party services:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <strong>PostHog:</strong>
                {' '}
                For product analytics and user behavior tracking
              </li>
              <li>
                <strong>Stripe:</strong>
                {' '}
                For secure payment processing
              </li>
              <li>
                <strong>Sentry:</strong>
                {' '}
                For error monitoring and reporting
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400">
              These third parties may use cookies to collect information about your online activities across different websites. We encourage you to review their privacy policies for more information about how they use cookies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">5. Managing Cookies</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              You have the right to decide whether to accept or reject cookies. You can manage your cookie preferences in the following ways:
            </p>

            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Browser Settings</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Most web browsers allow you to control cookies through their settings. You can typically:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>View what cookies are stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific sites</li>
              <li>Clear all cookies when you close the browser</li>
            </ul>

            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Browser-Specific Instructions</h3>
            <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <strong>Chrome:</strong>
                {' '}
                Settings &gt; Privacy and security &gt; Cookies and other site data
              </li>
              <li>
                <strong>Firefox:</strong>
                {' '}
                Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data
              </li>
              <li>
                <strong>Safari:</strong>
                {' '}
                Preferences &gt; Privacy &gt; Manage Website Data
              </li>
              <li>
                <strong>Edge:</strong>
                {' '}
                Settings &gt; Cookies and site permissions &gt; Cookies and site data
              </li>
            </ul>

            <p className="text-gray-600 dark:text-gray-400">
              Please note that blocking or deleting cookies may impact your experience on our website, as some features may not work properly without cookies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">6. Do Not Track</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Some browsers have a &quot;Do Not Track&quot; feature that lets you tell websites that you do not want your online activities tracked. Currently, MockFlow does not respond to Do Not Track signals, but we respect your privacy choices through our cookie management options.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">7. Updates to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page with a new &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">8. Contact Us</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>Email: privacy@mockflow.com</li>
              <li>Address: 123 Design Street, San Francisco, CA 94107</li>
            </ul>
          </section>

          {/* Related Links */}
          <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Related Policies</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/privacy"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
