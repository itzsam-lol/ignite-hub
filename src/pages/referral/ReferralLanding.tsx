import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, GitFork, Eye, CheckCircle2, AlertCircle, Upload, X, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
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
                    <h1 className="text-3xl font-bold text-foreground mb-3 flex items-center justify-center gap-2">Task Submitted! <Sparkles className="w-8 h-8 text-amber-400" /></h1>
                    <p className="text-muted-foreground mb-2">
                        Your submission has been received and is pending review.
                    </p>
                    <p className="text-muted-foreground text-sm mb-8">
                        Referred by <span className="text-primary font-medium">{ambassador?.name}</span>
                    </p>
                    <div className="glass-card rounded-2xl p-4 border border-green-500/20 text-sm text-muted-foreground mb-6">
                        You'll be notified once your submission is verified by the Ignite Room team.
                    </div>
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

            <div className="max-w-5xl mx-auto px-4 py-20 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md glass-card rounded-3xl p-12 border border-border/50"
                >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Flame className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-3">No Active Tasks</h1>
                    <p className="text-muted-foreground mb-8">
                        There are currently no active tasks available for submission. We'll be back soon with new challenges and rewards!
                    </p>
                    <Button onClick={() => navigate('/')} className="px-8">
                        Visit Ignite Room
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
