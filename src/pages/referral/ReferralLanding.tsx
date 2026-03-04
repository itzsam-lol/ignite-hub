import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, GitFork, Eye, CheckCircle2, AlertCircle, Upload, X, Loader2, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import type { User } from '@/lib/auth-context';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

/** Loads the reCAPTCHA v3 script once and resolves when ready */
function loadRecaptcha(siteKey: string): Promise<void> {
    return new Promise((resolve) => {
        if ((window as Window & { grecaptcha?: unknown }).grecaptcha) return resolve();
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.onload = () => resolve();
        document.head.appendChild(script);
    });
}

async function getRecaptchaToken(siteKey: string): Promise<string | undefined> {
    try {
        await loadRecaptcha(siteKey);
        return await new Promise<string>((resolve, reject) => {
            const gr = (window as Window & { grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> } }).grecaptcha;
            if (!gr) return reject(new Error('reCAPTCHA not available'));
            gr.ready(async () => {
                try {
                    const token = await gr.execute(siteKey, { action: 'submit' });
                    resolve(token);
                } catch (e) { reject(e); }
            });
        });
    } catch {
        return undefined; // non-blocking — backend will still validate
    }
}

const schema = z.object({
    name: z.string().min(2, 'Full name is required'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    githubUsername: z.string().min(1, 'GitHub username is required').regex(/^[a-zA-Z0-9-]+$/, 'Invalid GitHub username'),
});

type FormData = z.infer<typeof schema>;

export default function ReferralLanding() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [ambassador, setAmbassador] = useState<User | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const recaptchaReady = useRef(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    // Pre-load reCAPTCHA script (only in real API mode)
    useEffect(() => {
        if (!USE_MOCK && RECAPTCHA_SITE_KEY) {
            loadRecaptcha(RECAPTCHA_SITE_KEY).then(() => { recaptchaReady.current = true; });
        }
    }, []);

    useEffect(() => {
        if (!code) { setNotFound(true); return; }
        api.getAmbassadorByCode(code).then(amb => {
            if (!amb) { setNotFound(true); return; }
            setAmbassador(amb);
            api.logReferralVisit(amb.id);
        });
    }, [code]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
            setError('Only PNG, JPG, and JPEG files are accepted.');
            return;
        }
        setScreenshot(file);
        setScreenshotPreview(URL.createObjectURL(file));
        setError('');
    };

    const onSubmit = async (data: FormData) => {
        if (!screenshot) { setError('Please upload a screenshot of your completed task.'); return; }
        if (!code) return;
        setError('');
        setLoading(true);
        try {
            // Obtain reCAPTCHA token (only in real API mode)
            let recaptchaToken: string | undefined;
            if (!USE_MOCK && RECAPTCHA_SITE_KEY) {
                recaptchaToken = await getRecaptchaToken(RECAPTCHA_SITE_KEY);
            }

            await api.submitTask({
                ambassadorCode: code,
                name: data.name,
                phone: data.phone,
                githubUsername: data.githubUsername,
                screenshotFile: screenshot,
                recaptchaToken,
            });
            setSuccess(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (notFound) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Referral Link</h1>
                    <p className="text-muted-foreground mb-6">This referral link doesn't exist or has expired.</p>
                    <Button onClick={() => navigate('/')} variant="outline">Go to Home</Button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-3">Task Submitted! 🎉</h1>
                    <p className="text-muted-foreground mb-2">
                        Your submission has been received and is pending review.
                    </p>
                    <p className="text-muted-foreground text-sm mb-8">
                        Referred by <span className="text-primary font-medium">{ambassador?.name}</span>
                    </p>
                    <div className="glass-card rounded-2xl p-4 border border-green-500/20 text-sm text-muted-foreground mb-6">
                        You'll be notified once your submission is verified by the Ignite Room team.
                    </div>
                    <a href="https://github.com/daytonaio/daytona" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2">
                            <Star className="w-4 h-4" /> View Daytona on GitHub
                        </Button>
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent/6 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-primary" />
                        <span className="font-bold text-gradient">Ignite Room</span>
                    </div>
                    {ambassador && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Referred by</span>
                            <span className="text-primary font-medium">{ambassador.name}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Left: Task Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20 mb-4">
                            <Star className="w-3 h-3" /> Active Task
                        </span>
                        <h1 className="text-3xl font-bold text-foreground mb-3">
                            Star the <span className="text-gradient">Daytona</span> Repository
                        </h1>
                        <p className="text-muted-foreground leading-relaxed">
                            Daytona is an open-source platform that makes it easy to set up development environments.
                            Support the project by giving it a star on GitHub!
                        </p>
                    </div>

                    {/* Repo Card */}
                    <div className="glass-card rounded-2xl p-5 border border-border/50">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">daytonaio/daytona</p>
                                <p className="text-xs text-muted-foreground mt-0.5">The Open Source Dev Environment Manager</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> 12k+ Stars</span>
                            <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> 400+ Forks</span>
                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> TypeScript</span>
                        </div>
                        <a href="https://github.com/daytonaio/daytona" target="_blank" rel="noopener noreferrer">
                            <Button className="w-full gap-2 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30">
                                <Star className="w-4 h-4" /> Star the Repository
                            </Button>
                        </a>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                        {[
                            { n: '1', text: 'Click the button above to open the Daytona GitHub repository' },
                            { n: '2', text: 'Click the ⭐ Star button in the top right of the repository page' },
                            { n: '3', text: 'Take a screenshot showing the star is active' },
                            { n: '4', text: 'Fill the form and upload your screenshot as proof' },
                        ].map(s => (
                            <div key={s.n} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{s.n}</span>
                                <p>{s.text}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right: Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="glass-card rounded-2xl p-6 border border-border/50">
                        <h2 className="text-xl font-bold text-foreground mb-1">Submit Your Proof</h2>
                        <p className="text-sm text-muted-foreground mb-6">Fill in your details and upload a screenshot</p>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2 text-sm text-destructive"
                                >
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-sm text-muted-foreground mb-1.5 block">Full Name</Label>
                                <Input id="name" placeholder="Your full name" className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11" {...register('name')} />
                                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-sm text-muted-foreground mb-1.5 block">Phone Number</Label>
                                <Input id="phone" type="tel" placeholder="10-digit mobile number" className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11" {...register('phone')} />
                                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="github" className="text-sm text-muted-foreground mb-1.5 block">GitHub Username</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                                    <Input id="github" placeholder="your-username" className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11 pl-7" {...register('githubUsername')} />
                                </div>
                                {errors.githubUsername && <p className="mt-1 text-xs text-destructive">{errors.githubUsername.message}</p>}
                            </div>

                            {/* Screenshot Upload */}
                            <div>
                                <Label className="text-sm text-muted-foreground mb-1.5 block">Screenshot Upload <span className="text-destructive">*</span></Label>
                                {screenshotPreview ? (
                                    <div className="relative rounded-xl overflow-hidden border border-primary/30">
                                        <img src={screenshotPreview} alt="Screenshot preview" className="w-full h-40 object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                                            <p className="text-xs text-white/80 truncate">{screenshot?.name}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors cursor-pointer bg-secondary/20 hover:bg-primary/5">
                                        <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">Click to upload screenshot</p>
                                        <p className="text-xs text-muted-foreground/60 mt-0.5">PNG, JPG, JPEG accepted</p>
                                        <input type="file" accept=".png,.jpg,.jpeg,image/png,image/jpg,image/jpeg" onChange={handleFileChange} className="hidden" />
                                    </label>
                                )}
                            </div>

                            <div className="p-3 rounded-lg bg-secondary/30 text-xs text-muted-foreground">
                                🛡️ Anti-cheat: Each phone number and GitHub username can only be used once. Self-referrals are blocked. Maximum 3 submissions per hour from the same IP.
                            </div>

                            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold gap-2" disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                {loading ? 'Submitting...' : 'Submit Task'}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
