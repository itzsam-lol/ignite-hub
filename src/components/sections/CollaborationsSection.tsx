import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const partners = [
  { name: 'Physics Wallah', logo: 'pw' },
  { name: 'Google Developer Groups', logo: 'gdg' },
  { name: 'GeeksforGeeks', logo: 'gfg' },
  { name: 'GitHub', logo: 'github' },
  { name: 'MLH', logo: 'mlh' },
  { name: 'DevFolio', logo: 'dev' },
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
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <img
                    src={`/partners/${partner.logo}.svg`}
                    alt={partner.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.dataset.fallbackTried) {
                        target.dataset.fallbackTried = 'true';
                        target.src = `/partners/${partner.logo}.png`;
                      }
                    }}
                    style={{ imageOrientation: 'from-image' }}
                    className="block mx-auto max-h-[66%] max-w-[66%] object-contain object-center transform-none transition-all"
                  />
                  <p className="text-xs mt-2 opacity-0 group-hover:opacity-100 text-white transition-opacity">
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
