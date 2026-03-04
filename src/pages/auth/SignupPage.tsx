import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Flame, UserPlus, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

function generatePreviewCode(name: string) {
    if (!name || name.trim().length < 2) return '';
    const base = name.toLowerCase().replace(/\s+/g, '').slice(0, 8);
    return `${base}XXX`;
}

export default function SignupPage() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const watchedName = watch('name', '');
    const previewCode = generatePreviewCode(watchedName);

    const onSubmit = async (data: FormData) => {
        setError('');
        setLoading(true);
        try {
            await signup({ name: data.name, email: data.email, phone: data.phone, password: data.password });
            navigate('/ambassador/dashboard', { replace: true });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const copyPreview = () => {
        if (!previewCode) return;
        navigator.clipboard.writeText(`https://igniteroom.in/ref/${previewCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent/6 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md relative"
            >
                <div className="glass-card rounded-2xl p-8 border border-border/50 shadow-2xl">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
                            <Flame className="w-5 h-5 text-primary" />
                        </div>
                        <Link to="/" className="text-xl font-bold text-gradient">Ignite Room</Link>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-foreground mb-1">Become an Ambassador</h1>
                        <p className="text-muted-foreground text-sm">Join the Ignite Room campus ambassador program</p>
                    </div>

                    {/* Referral Link Preview */}
                    {previewCode && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20"
                        >
                            <p className="text-xs text-muted-foreground mb-1">Your referral link preview</p>
                            <div className="flex items-center gap-2">
                                <code className="text-xs text-primary flex-1 truncate">
                                    igniteroom.in/ref/{previewCode}
                                </code>
                                <button onClick={copyPreview} className="text-muted-foreground hover:text-primary transition-colors">
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-sm text-destructive"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-sm text-muted-foreground mb-1.5 block">Full Name</Label>
                            <Input id="name" placeholder="Satyam Sharma" className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11" {...register('name')} />
                            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-sm text-muted-foreground mb-1.5 block">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11" {...register('email')} />
                            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="phone" className="text-sm text-muted-foreground mb-1.5 block">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="9876543210" className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11" {...register('phone')} />
                            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-sm text-muted-foreground mb-1.5 block">Password</Label>
                            <div className="relative">
                                <Input id="password" type={showPass ? 'text' : 'password'} placeholder="Min 8 characters" className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11 pr-10" {...register('password')} />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground mb-1.5 block">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" placeholder="Re-enter password" className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11" {...register('confirmPassword')} />
                            {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>}
                        </div>

                        <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold gap-2 mt-2" disabled={loading}>
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Create Ambassador Account
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/ambassador/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link>
                    </p>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                        <Link to="/ambassador" className="hover:text-foreground transition-colors">← Back to Ambassador Program</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
