'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { instagramPosts, type InstagramPost } from '@/lib/data/instagram';

export default function InstagramSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;
  const maxIndex = Math.max(0, instagramPosts.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const visiblePosts = instagramPosts.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="section-instagram-v3 mt-16 md:mt-24 py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Follow Our Journey</h2>
          <p className="text-gray-600 mb-6">
            Join our community and stay inspired with our latest designs and stories
          </p>
          <Link
            href="https://instagram.com/ afmondo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:text-gray-600 transition"
          >
            @ afmondo
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
            </svg>
          </Link>
        </div>

        {/* Instagram Feed Carousel */}
        <div className="relative">
          {/* Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {visiblePosts.map((post) => (
              <Link
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-post group relative overflow-hidden rounded-lg cursor-pointer"
              >
                {/* Post Image */}
                <div className="relative w-full aspect-square">
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white">
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span className="text-sm font-semibold">{post.likes}</span>
                      </div>
                    </div>
                    <p className="text-sm font-light px-4 line-clamp-2">{post.caption}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Buttons */}
          {instagramPosts.length > itemsPerView && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20 bg-gray-900 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center transition"
                aria-label="Previous posts"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20 bg-gray-900 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center transition"
                aria-label="Next posts"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-12">
          <Link
            href="https://instagram.com/ afmondo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded font-semibold hover:bg-black transition"
          >
            Follow on Instagram
          </Link>
        </div>
      </div>
    </section>
  );
}
