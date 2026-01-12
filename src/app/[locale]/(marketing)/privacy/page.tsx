export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Last updated: January 10, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">1. Introduction</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Welcome to MockFlow. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and use our services, and tell you about your privacy rights and how the law protects you.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              This privacy policy applies to all information collected through our website, mobile applications, and any related services, sales, marketing, or events (collectively, the &quot;Services&quot;).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">2. Information We Collect</h2>
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Personal Information</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>Name and contact information (email address)</li>
              <li>Account credentials (username, password)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Profile information and preferences</li>
              <li>Content you create using our services (mockups)</li>
            </ul>

            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Automatically Collected Information</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              When you use our Services, we automatically collect certain information, including:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>IP address and general location data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">3. How We Use Your Information</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>Providing, maintaining, and improving our Services</li>
              <li>Processing transactions and sending related information</li>
              <li>Sending technical notices, updates, and support messages</li>
              <li>Responding to your comments, questions, and customer service requests</li>
              <li>Personalizing your experience and delivering content relevant to your interests</li>
              <li>Monitoring and analyzing trends, usage, and activities</li>
              <li>Detecting, investigating, and preventing fraudulent transactions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">4. Data Sharing and Disclosure</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <strong>Service Providers:</strong>
                {' '}
                With third-party vendors who assist us in providing our Services (e.g., payment processors, hosting providers, analytics services)
              </li>
              <li>
                <strong>Legal Requirements:</strong>
                {' '}
                When required by law or to respond to legal process
              </li>
              <li>
                <strong>Business Transfers:</strong>
                {' '}
                In connection with a merger, acquisition, or sale of assets
              </li>
              <li>
                <strong>With Your Consent:</strong>
                {' '}
                When you explicitly agree to share your information
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">5. Data Security</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data storage with regular backups</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">6. Your Rights</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <strong>Access:</strong>
                {' '}
                Request access to your personal data
              </li>
              <li>
                <strong>Correction:</strong>
                {' '}
                Request correction of inaccurate data
              </li>
              <li>
                <strong>Deletion:</strong>
                {' '}
                Request deletion of your personal data
              </li>
              <li>
                <strong>Portability:</strong>
                {' '}
                Request a copy of your data in a portable format
              </li>
              <li>
                <strong>Objection:</strong>
                {' '}
                Object to certain processing of your data
              </li>
              <li>
                <strong>Withdrawal:</strong>
                {' '}
                Withdraw consent at any time
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400">
              To exercise any of these rights, please contact us at privacy@mockflow.com.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">7. Cookies and Tracking</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              We use cookies and similar tracking technologies to collect and track information about your use of our Services. You can control cookies through your browser settings, but disabling cookies may limit your ability to use certain features.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Types of cookies we use include:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <strong>Essential cookies:</strong>
                {' '}
                Required for the Services to function
              </li>
              <li>
                <strong>Analytics cookies:</strong>
                {' '}
                Help us understand how users interact with our Services
              </li>
              <li>
                <strong>Preference cookies:</strong>
                {' '}
                Remember your settings and preferences
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">8. International Transfers</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure that appropriate safeguards are in place to protect your data in accordance with applicable laws, including standard contractual clauses approved by relevant authorities.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">9. Children&apos;s Privacy</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our Services are not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">10. Changes to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this privacy policy periodically.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">11. Contact Us</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              If you have any questions about this privacy policy or our privacy practices, please contact us:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>Email: privacy@mockflow.com</li>
              <li>Address: 123 Design Street, San Francisco, CA 94107</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
