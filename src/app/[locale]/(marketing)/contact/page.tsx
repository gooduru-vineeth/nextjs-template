'use client';

import Link from 'next/link';
import { useState } from 'react';

type ContactReason = 'general' | 'support' | 'sales' | 'partnership' | 'press';

type ContactFormData = {
  name: string;
  email: string;
  company: string;
  reason: ContactReason;
  subject: string;
  message: string;
};

const contactReasons: { value: ContactReason; label: string; description: string }[] = [
  { value: 'general', label: 'General Inquiry', description: 'Questions about MockFlow' },
  { value: 'support', label: 'Technical Support', description: 'Help with using the platform' },
  { value: 'sales', label: 'Sales & Pricing', description: 'Questions about plans and pricing' },
  { value: 'partnership', label: 'Partnership', description: 'Business collaboration opportunities' },
  { value: 'press', label: 'Press & Media', description: 'Media inquiries and interviews' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    reason: 'general',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg className="size-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Message Sent!</h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Back to Home
            </Link>
            <Link
              href="/help"
              className="rounded-lg border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Browse Help Center
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="border-b border-gray-200 bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Email */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg className="size-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Email Us</h3>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                Our team typically responds within 24 hours.
              </p>
              <a
                href="mailto:support@mockflow.com"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                support@mockflow.com
              </a>
            </div>

            {/* Social */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <svg className="size-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Social Media</h3>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                Follow us for updates and tips.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Office */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg className="size-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Office</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                123 Design Street
                <br />
                San Francisco, CA 94107
                <br />
                United States
              </p>
            </div>

            {/* Help Center Link */}
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
              <h3 className="mb-2 font-semibold">Need Quick Help?</h3>
              <p className="mb-4 text-sm text-blue-100">
                Check our Help Center for instant answers to common questions.
              </p>
              <Link
                href="/help"
                className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                Browse Help Center
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Acme Inc."
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label htmlFor="reason" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reason for Contact *
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      required
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      {contactReasons.map(reason => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us more about your question or feedback..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSubmitting
                    ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      )
                    : (
                        'Send Message'
                      )}
                </button>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By submitting this form, you agree to our
                  {' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-gray-200 bg-gray-100 px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Find quick answers to common questions.
          </p>
          <div className="space-y-4 text-left">
            {[
              {
                question: 'How long does it take to receive a response?',
                answer: 'We typically respond to all inquiries within 24-48 hours during business days.',
              },
              {
                question: 'Is there a phone support option?',
                answer: 'Phone support is available for Enterprise customers. Contact us for more information.',
              },
              {
                question: 'Can I schedule a demo?',
                answer: 'Yes! Select "Sales & Pricing" as your reason for contact and mention you\'d like a demo.',
              },
            ].map((faq, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
