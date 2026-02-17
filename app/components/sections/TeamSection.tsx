'use client';

import Image from 'next/image';
import { teamMembers, type TeamMember } from '@/lib/data/team';

export default function TeamSection() {
  return (
    <section className="section-team mt-16 md:mt-24 py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Talented individuals united by a passion for design, craftsmanship, and exceptional quality.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-member text-center">
              {/* Team Member Image */}
              <div className="relative mb-6 h-80 overflow-hidden rounded-lg group">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Team Member Info */}
              <div className="team-info">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm font-light text-gray-500 mb-3 uppercase tracking-wider">
                  {member.role}
                </p>
                {member.bio && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
