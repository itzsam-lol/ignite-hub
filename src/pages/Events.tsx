import { Helmet } from 'react-helmet';
import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

const Logo3DBackground = lazy(() => import('@/components/Logo3DBackground'));

const Events = () => {
  // Replace with your actual Luma calendar URL
  const lumaCalendarUrl = "https://lu.ma/embed/calendar/YOUR_CALENDAR_ID/events";

  return (
    <>
      <Helmet>
        <title>Events - Ignite Room | Workshops, Hackathons & Community Meetups</title>
        <meta 
          name="description" 
          content="Discover upcoming Ignite Room events, workshops, hackathons, and community meetups. Join us to learn, network, and build amazing projects together." 
        />
        <meta name="keywords" content="Ignite Room events, tech workshops, hackathons, community meetups, coding events, technology conferences" />
        
        <meta property="og:title" content="Events - Ignite Room" />
        <meta property="og:description" content="Discover upcoming Ignite Room events, workshops, and community meetups." />
        <meta property="og:type" content="website" />
        <link rel="canonical" content="https://ignite-room.com/events" />
        
        {/* Structured Data for Events */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EventSeries",
            "name": "Ignite Room Events",
            "description": "Regular workshops, hackathons, and community meetups by Ignite Room",
            "organizer": {
              "@type": "Organization",
              "name": "Ignite Room",
              "url": "https://ignite-room.com"
            }
          })}
        </script>
      </Helmet>

      <div className="relative min-h-screen bg-background">
        <Suspense fallback={null}>
          <Logo3DBackground />
        </Suspense>

        <Navbar />

        <main className="relative z-10 pt-24 pb-16" role="main">
          <div className="container mx-auto px-4">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-pink-500 to-primary bg-clip-text text-transparent">
                Ignite Room Events
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Join us for workshops, hackathons, talks, and community meetups. 
                Connect with fellow innovators and build something amazing together.
              </p>
            </motion.div>

            {/* Event Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {[
                { icon: Calendar, title: "Workshops", desc: "Hands-on learning sessions", color: "from-pink-500 to-rose-500" },
                { icon: Clock, title: "Hackathons", desc: "24-hour coding marathons", color: "from-purple-500 to-pink-500" },
                { icon: Users, title: "Meetups", desc: "Community networking events", color: "from-blue-500 to-purple-500" },
                { icon: MapPin, title: "Conferences", desc: "Tech talks & presentations", color: "from-rose-500 to-pink-500" },
              ].map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">{category.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Current & Upcoming Events - Luma Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Current & Upcoming Events
                </h2>
                <a 
                  href="https://lu.ma/YOUR_CALENDAR_ID" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  aria-label="View all events on Luma"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Luma Calendar Embed */}
              <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                <iframe
                  src={lumaCalendarUrl}
                  width="100%"
                  height="800"
                  frameBorder="0"
                  title="Ignite Room Events Calendar"
                  className="w-full"
                  aria-label="Event calendar powered by Luma"
                  loading="lazy"
                />
              </div>

              {/* Alternative: Manual Luma Embed Script */}
              {/* 
              <div 
                data-luma-calendar="YOUR_CALENDAR_ID" 
                data-luma-calendar-view="list"
                className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6"
              />
              */}
            </motion.div>

            {/* Past Events Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Past Event Highlights
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Past Event Cards - You can populate this with actual data */}
                {[
                  {
                    title: "Web3 Workshop",
                    date: "December 15, 2025",
                    attendees: "150+ attendees",
                    image: "/events/web3-workshop.jpg"
                  },
                  {
                    title: "AI/ML Hackathon",
                    date: "November 20, 2025",
                    attendees: "200+ participants",
                    image: "/events/ai-hackathon.jpg"
                  },
                  {
                    title: "Community Meetup",
                    date: "October 5, 2025",
                    attendees: "100+ members",
                    image: "/events/community-meetup.jpg"
                  },
                ].map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 relative overflow-hidden">
                      {/* Placeholder - Replace with actual images */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-primary/30" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
                      <p className="text-sm text-muted-foreground">{event.attendees}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 text-center"
            >
              <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Host Your Own Event
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Have an idea for a workshop or event? We'd love to help you make it happen!
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                >
                  Propose an Event <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Events;