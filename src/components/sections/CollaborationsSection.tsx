import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const partners = [
  { name: 'Physics Wallah', logo: 'PW' },
  { name: 'Google Developer Groups', logo: 'GDG' },
  { name: 'GeeksforGeeks', logo: 'GFG' },
  { name: 'GitHub', logo: 'GH' },
  { name: 'MLH', logo: 'MLH' },
  { name: 'DevFolio', logo: 'DF' },
];

export default function CollaborationsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Our Partners
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Trusted Collaborations
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="aspect-square rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center hover:bg-secondary hover:border-primary/30 transition-all duration-300">
                <div className="text-center">
                  <span className="font-heading text-2xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    {partner.logo}
                  </span>
                  <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {partner.name}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
