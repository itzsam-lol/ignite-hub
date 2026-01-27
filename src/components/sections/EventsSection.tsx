import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Event = {
  title: string
  subtitle: string
  description: string
  date: string
  location: string
  participants: string
  status: 'past'
  externalUrl?: string
  externalLabel?: string
}

const events: Event[] = [
  {
    title: 'Hack the Flame',
    subtitle: 'National Level Hackathon',
    description:
      'Hack the Flame was a national-level offline hackathon conducted in Mumbai, bringing together developers and innovators to solve real-world challenges.',
    date: '21 December 2025',
    location: 'Mumbai (Offline)',
    participants: '200+',
    status: 'past',
    externalUrl:
      'https://unstop.com/hackathons/hack-the-flame-2025-vasantdada-patil-pratishthans-college-of-engineering-and-visual-arts-mumbai-maharashtra-1584308',
    externalLabel: 'View on Unstop',
  },
  {
    title: 'Ignite & Initiate',
    subtitle: 'First-Year Onboarding Event',
    description:
      'An onboarding and innovation-focused event designed to introduce first-year students to the tech ecosystem, community culture, and opportunities.',
    date: '24 August 2025',
    location: 'Campus',
    participants: '200+',
    status: 'past',
    externalUrl: 'https://luma.com/waqp78jd',
    externalLabel: 'View on Luma',
  },
  {
    title: 'Hackarena',
    subtitle: '36-Hour National Hackathon',
    description:
      'A 36-hour national-level hackathon featuring mentorship, competitive problem statements, and strong industry exposure.',
    date: 'June 2025',
    location: 'Hybrid',
    participants: '300+',
    status: 'past',
  },
]

function EventCard({ event, index }: { event: Event; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl bg-gradient-card border border-border/60 overflow-hidden hover:border-primary/40 transition-all"
    >
      {/* Accent Bar */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary to-purple-500 opacity-70" />

      <div className="p-6 space-y-4">
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
          Past Event
        </span>

        <div>
          <h3 className="text-2xl font-bold group-hover:text-gradient transition-all">
            {event.title}
          </h3>
          <p className="text-primary font-medium mt-1">
            {event.subtitle}
          </p>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {event.description}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {event.date}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {event.participants}
          </div>
        </div>

        {event.externalUrl && (
          <div className="pt-4">
            <Button asChild variant="outline" size="sm" className="group/btn">
              <a
                href={event.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.externalLabel ?? 'View Event'}
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </Button>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  )
}

function UpcomingEventsTeaser() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl border border-dashed border-primary/40 bg-gradient-to-br from-primary/5 to-transparent p-8 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
      />

      <div className="relative z-10 text-center space-y-4">
        <span className="inline-flex px-4 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
          Upcoming Events
        </span>

        <h3 className="text-2xl md:text-3xl font-bold">
          Something exciting is brewing 
        </h3>

        <p className="text-muted-foreground max-w-xl mx-auto">
          New hackathons, meetups, and community-driven experiences are on the
          way. Stay tuned.
        </p>

        <div className="max-w-md mx-auto space-y-3 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary/40"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  delay: i * 0.2,
                  ease: 'linear',
                }}
              />
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          Announcing soon 
        </p>
      </div>
    </motion.div>
  )
}

export default function EventsSection() {
  const headerRef = useRef<HTMLDivElement | null>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  return (
    <section
      id="events"
      className="relative section-padding bg-background overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider block mb-4">
            Our Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Events & Experiences
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A glimpse into the hackathons and community events that shaped
            IgniteRoom — and what’s coming next.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={event.title} event={event} index={index} />
          ))}
        </div>

        <div className="mt-20">
          <UpcomingEventsTeaser />
        </div>
      </div>
    </section>
  )
}
