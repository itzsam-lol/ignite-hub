export type TeamMember = {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  github: string;
  funFact?: string;
};

export const team: TeamMember[] = [
  {
    name: 'Alex Chen',
    role: 'President',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    linkedin: '#',
    github: '#',
    funFact: "Can't start the day without a strong playlist.",
  },
  {
    name: 'Priya Sharma',
    role: 'Vice President',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    linkedin: '#',
    github: '#',
    funFact: 'Collects vintage cameras.',
  },
  {
    name: 'Rahul Verma',
    role: 'Tech Lead',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    linkedin: '#',
    github: '#',
    funFact: 'Loves competitive programming and coffee.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Events Head',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    linkedin: '#',
    github: '#',
    funFact: 'Plans themed events for fun.',
  },
  {
    name: 'Arjun Patel',
    role: 'Design Lead',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    linkedin: '#',
    github: '#',
    funFact: 'Sketches UI ideas on napkins.',
  },
  {
    name: 'Maya Singh',
    role: 'Outreach Head',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
    linkedin: '#',
    github: '#',
    funFact: 'Speaks three languages fluently.',
  },
];

export default team;
