import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const events = [
  {
    title: 'Hackarena',
    subtitle: '36-Hour National Hackathon',
    description: 'A high-energy national-level hackathon with mentorship, prizes, and industry exposure. Build, innovate, and compete.',
    date: 'March 2024',
    location: 'Hybrid',
    participants: '300+',
    status: 'past',
    featured: true,
  },
  {
    title: 'Hackarena Pre-Meetup',
    subtitle: 'Community Networking',
    description: 'Speaker sessions and networking event to prepare participants for the main hackathon.',
    date: 'February 2024',
    location: 'In-Person',
    participants: '150+',
    status: 'past',
    featured: false,
  },
  {
    title: 'Ignite & Initiate',
    subtitle: 'First-Year Onboarding',
    description: 'Onboarding and innovation events designed specifically for first-year students entering the tech world.',
    date: 'September 2024',
    location: 'Campus',
    participants: '200+',
    status: 'upcoming',
    featured: false,
  },
];

function EventCard({ event, index }: { event: typeof events[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`group relative rounded-2xl overflow-hidden ${
        event.featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className="relative p-8 bg-gradient-card border border-border/50 hover:border-primary/40 transition-all duration-500 h-full">
        {/* Status badge */}
        <div className="absolute top-6 right-6">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              event.status === 'upcoming'
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground group-hover:text-gradient transition-all">
              {event.title}
            </h3>
            <p className="text-primary font-medium mt-1">{event.subtitle}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed max-w-xl">
            {event.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {event.date}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {event.participants}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Button variant="outline" size="sm" className="group/btn">
              Learn More
              <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
}

export default function EventsSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="events" className="section-padding bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Events & Experiences
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From hackathons to workshops, we create experiences that challenge, 
            inspire, and connect students with real-world opportunities.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <EventCard key={event.title} event={event} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button variant="default" size="lg">
            View All Events
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
