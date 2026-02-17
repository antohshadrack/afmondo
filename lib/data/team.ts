export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Creative Director',
    image: '/files/people1.jpg',
    bio: 'Visionary leader with 15+ years of design expertise'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Head of Craftsmanship',
    image: '/files/people2.jpg',
    bio: 'Master artisan passionate about quality & tradition'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Sustainability Officer',
    image: '/files/people3.jpg',
    bio: 'Committed to eco-friendly practices and innovation'
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Customer Experience',
    image: '/files/people4.jpg',
    bio: 'Dedicated to building meaningful customer relationships'
  }
];
