"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../../contexts/TranslationContext';

export default function AboutSection() {
  const { t } = useTranslation();
  
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Afmondo
          </h2>

          {/* About Content */}
          <div className="space-y-6 text-gray-700 leading-relaxed">
            {/* Shopping On Afmondo */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('about.title')}
              </h3>
              <p className="text-base">
                {t('about.description')}
              </p>
            </div>

            {/* Why Trade with Afmondo */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('about.whyTradeTitle')}
              </h3>
              <p className="text-base">
                The real question is why not Afmondo? We offer quality and genuine products at very competitive prices. Our client support services are inordinate so why worry when shopping on Afmondo. A company that gives you value for money. We have doorstep delivery services within major cities in Senegal and valid warranties on all our products. We have great consumer policies geared toward protecting our customers interest. Afmondo offers a 7-Day return policy on all our products. We have correspondent scattered across all regions in Senegal. You are free to return any of our products within 7 days from day of delivery. All our products comes with manufacturer's warranty and Limited warranty from Afmondo. We also offer free nationwide delivery when you order online. Our delivery services are supersonic as we can get your item delivered within 24 hours at any location within Senegal. We also have payment on delivery option at few selected locations in Senegal due to our limited number of correspondents in the country. At Afmondo we say{' '}
                <span className="font-bold text-afmondo-green">{t('about.tagline')}</span>
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 flex flex-wrap gap-4">
            {/* <Link
              href="/about"
              className="inline-block bg-afmondo-green hover:bg-afmondo-green/80 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Learn More About Us
            </Link> */}
            <Link
              href="/contact"
              className="inline-block bg-afmondo-orange hover:bg-afmondo-orange/80 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {t('about.contactUs')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
