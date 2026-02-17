'use client';

import Link from 'next/link';
import Image from 'next/image';

interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

const footerColumns: FooterColumn[] = [

  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/story' },
      { label: 'Contact Us', href: '/contact' },

    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Track Order', href: '/track' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ]
  }
];

const socialLinks: SocialLink[] = [
  {
    icon: 'facebook',
    href: 'https://facebook.com/ afmondo',
    label: 'Facebook'
  },
  {
    icon: 'instagram',
    href: 'https://instagram.com/ afmondo',
    label: 'Instagram'
  },
  {
    icon: 'twitter',
    href: 'https://twitter.com/ afmondo',
    label: 'Twitter'
  },
  {
    icon: 'pinterest',
    href: 'https://pinterest.com/ afmondo',
    label: 'Pinterest'
  },
  {
    icon: 'linkedin',
    href: 'https://linkedin.com/company/ afmondo',
    label: 'LinkedIn'
  }
];

interface NewsletterFormProps {
  onSubmit: (email: string) => void;
}

function NewsletterForm({ onSubmit }: NewsletterFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    if (email) {
      onSubmit(email);
      e.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <label htmlFor="newsletter-email" className="block text-sm font-semibold text-gray-900 mb-3">
        Subscribe to our newsletter
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:border-gray-900 transition"
        />
        <button
          type="submit"
          className="bg-gray-900 text-white px-6 py-2.5 rounded font-semibold hover:bg-black transition"
        >
          Subscribe
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (email: string) => {
    console.log('Newsletter subscription:', email);
    // TODO: Integrate with email service (Mailchimp, etc.)
  };

  return (
    <footer className="footer_v1 bg-gray-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-gray-900 mb-2"> Afmondo</h2>
              <p className="text-sm text-gray-600">
                Elegant furniture and decor for the modern home.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mb-6">
              {socialLinks.map((link) => (
                <Link
                  key={link.icon}
                  href={link.icon === 'instagram' ? link.href : link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  {link.icon === 'facebook' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  {link.icon === 'instagram' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
                    </svg>
                  )}
                  {link.icon === 'twitter' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  )}
                  {link.icon === 'pinterest' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.383 0 0 5.383 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.223-.937 1.58-6.694 1.58-6.694s-.389-.779-.389-1.927c0-1.804.945-3.15 2.119-3.15 1.002 0 1.487.752 1.487 1.652 0 1.007-.641 2.513-.969 3.907-.274 1.16.581 2.105 1.722 2.105 2.065 0 3.654-2.19 3.654-5.352 0-2.798-1.935-4.769-4.702-4.769-3.324 0-5.28 2.467-5.28 5.037 0 .985.329 2.041 .755 2.614.083.102.095.19.07.291-.077.324-.248 1.044-.268 1.129-.024.102-.102.124-.211.075-1.186-.556-1.806-2.301-1.806-3.71 0-3.622 2.771-6.948 7.994-6.948 4.201 0 7.453 2.988 7.453 6.986 0 4.181-2.574 7.555-6.15 7.555-1.203 0-2.335-.625-2.722-1.363 0 0-.597 2.283-.74 2.84-.276 1.041-.901 2.083-1.345 2.788 1.014.312 2.084.481 3.21.481 6.617 0 12-5.383 12-12S18.617 0 12 0z" />
                    </svg>
                  )}
                  {link.icon === 'linkedin' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links Columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup Section */}
        <div className="border-t border-b border-gray-200 py-8 mb-8">
          <div className="max-w-md">
            <NewsletterForm onSubmit={handleNewsletterSubmit} />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              &copy; {currentYear}  afmondo. All rights reserved.
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}
