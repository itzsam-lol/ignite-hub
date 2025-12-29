import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />

      <main className="relative z-10 w-full">
        <section className="w-full px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Contact</h1>
              <p className="text-muted-foreground mb-8">Have a question or want to collaborate? Send us a message.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full p-3 rounded border border-border/50 bg-secondary/10"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="w-full p-3 rounded border border-border/50 bg-secondary/10"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <textarea
                  className="w-full p-3 rounded border border-border/50 bg-secondary/10"
                  placeholder="Your message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button className="px-6 py-3 bg-primary text-white rounded">Send Message</button>
                {sent && <p className="text-sm text-primary">Message sent (demo).</p>}
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
