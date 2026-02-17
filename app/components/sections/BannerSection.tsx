'use client';

import Link from 'next/link';
import Image from 'next/image';
import { banners, type BannerItem } from '@/lib/data/banners';
import { AfmondoPalette } from '@/lib/colors/afmondo-palette';
export default function BannerSection() {
  return (
    <section className="mt-12 md:mt-20">
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="banner-item group cursor-pointer relative h-46 overflow-hidden"
            >
              {/* Background Color */}
              <div className={`absolute inset-0 ${item.bgcolor} z-0`}></div>

              {/* Image */}
              <div className="absolute inset-0 z-10 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content Overlay */}
              <div className="content absolute inset-0 z-20 p-6 flex flex-col justify-start">
                <div className= "rounded-sm p-4 w-fit backdrop-blur-sm">
                  <p className="sub-banner text-xs font-semibold mb-1 uppercase tracking-widest text-white">{item.subtitle}</p>
                  <div className="border-b border-white mb-2 w-8"></div>
                  <h3 className="title-banner text-lg md:text-2xl font-light text-white">{item.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
