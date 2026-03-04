import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Flame, LogOut, Users, FileCheck, Trophy, Download,
    Plus, X, RefreshCw, Shield
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import SubmissionsTable from '@/pages/dashboard/components/SubmissionsTable';
import type { Submission, LeaderboardEntry } from '@/lib/mock-api';
import type { User } from '@/lib/auth-context';

// Screenshot Preview Modal
function ScreenshotModal({ url, onClose }: { url: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm">
                    <X className="w-4 h-4" /> Close
                </button>
                <img src={url} alt="Screenshot" className="w-full rounded-xl border border-border/50 shadow-2xl" />
            </div>
        </div>
    );
}

// External Referrals Modal
function ExternalReferralModal({
    ambassadors,
    onClose,
    onSave,
}: {
    ambassadors: User[];
    onClose: () => void;
    onSave: (ambassadorId: string, count: number) => Promise<void>;
}) {
    const [selectedId, setSelectedId] = useState('');
    const [count, setCount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        const n = parseInt(count);
        if (!selectedId) { setError('Select an ambassador'); return; }
        if (isNaN(n) || n <= 0) { setError('Enter a positive number'); return; }
        setLoading(true);
        try {
            await onSave(selectedId, n);
            onClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="glass-card rounded-2xl p-6 border border-border/50 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-foreground text-lg mb-1">Add External Referrals</h3>
                <p className="text-sm text-muted-foreground mb-5">Add Unstop registrations to an ambassador's score</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-muted-foreground block mb-1.5">Select Ambassador</label>
                        <select
                            className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 h-11 text-foreground text-sm focus:border-primary/50 focus:outline-none"
                            value={selectedId}
                            onChange={e => setSelectedId(e.target.value)}
                        >
                            <option value="">-- Choose ambassador --</option>
                            {ambassadors.map(a => (
                                <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground block mb-1.5">Referral Count to Add</label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="e.g. 25"
                            value={count}
                            onChange={e => setCount(e.target.value)}
                            className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11"
                        />
                    </div>
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <div className="flex gap-3 pt-1">
                        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button onClick={handleSave} disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-white">
                            {loading ? 'Saving...' : 'Add Referrals'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [ambassadors, setAmbassadors] = useState<User[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showExtModal, setShowExtModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        const [subs, ambs, lb] = await Promise.all([
            api.getAllSubmissions(),
            api.getAllAmbassadors(),
            api.getLeaderboard(),
        ]);
        setSubmissions(subs);
        setAmbassadors(ambs);
        setLeaderboard(lb);
        setRefreshing(false);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleApprove = async (id: string) => {
        if (!user) return;
        await api.updateSubmissionStatus(id, 'verified', user.id);
        await loadData();
    };

    const handleReject = async (id: string) => {
        if (!user) return;
        await api.updateSubmissionStatus(id, 'rejected', user.id);
        await loadData();
    };

    const handleAddExternal = async (ambassadorId: string, count: number) => {
        if (!user) return;
        await api.addExternalReferrals(ambassadorId, count, user.id);
        await loadData();
    };

    const exportCSV = () => {
        const csv = api.exportSubmissionsCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ignite-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    const pendingCount = submissions.filter(s => s.status === 'pending').length;

    return (
        <div className="min-h-screen bg-background">
            {/* Modals */}
            {previewUrl && <ScreenshotModal url={previewUrl} onClose={() => setPreviewUrl(null)} />}
            {showExtModal && (
                <ExternalReferralModal
                    ambassadors={ambassadors}
                    onClose={() => setShowExtModal(false)}
                    onSave={handleAddExternal}
                />
            )}

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-primary" />
                        <span className="font-bold text-gradient">Ignite Room</span>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Admin
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={loadData} disabled={refreshing} className="gap-1.5 text-muted-foreground">
                            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>
                        <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
                        <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                            <p className="text-muted-foreground text-sm mt-0.5">Manage ambassadors, submissions, and leaderboard</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5 border-border/50">
                                <Download className="w-4 h-4" /> Export CSV
                            </Button>
                            <Button size="sm" onClick={() => setShowExtModal(true)} className="gap-1.5 bg-primary hover:bg-primary/90 text-white">
                                <Plus className="w-4 h-4" /> Add Ext. Referrals
                            </Button>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {[
                            { label: 'Ambassadors', value: ambassadors.length, color: 'text-primary' },
                            { label: 'Total Submissions', value: submissions.length, color: 'text-blue-400' },
                            { label: 'Pending Review', value: pendingCount, color: 'text-amber-400' },
                            { label: 'Verified', value: submissions.filter(s => s.status === 'verified').length, color: 'text-green-400' },
                        ].map(s => (
                            <div key={s.label} className="glass-card rounded-xl p-4 border border-border/50">
                                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <Tabs defaultValue="submissions">
                        <TabsList className="bg-secondary/50 border border-border/50 mb-6">
                            <TabsTrigger value="submissions" className="gap-2">
                                <FileCheck className="w-4 h-4" />
                                Submissions
                                {pendingCount > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                                        {pendingCount}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="ambassadors" className="gap-2">
                                <Users className="w-4 h-4" />
                                Ambassadors
                            </TabsTrigger>
                            <TabsTrigger value="leaderboard" className="gap-2">
                                <Trophy className="w-4 h-4" />
                                Leaderboard
                            </TabsTrigger>
                        </TabsList>

                        {/* Submissions Tab */}
                        <TabsContent value="submissions" className="mt-0">
                            <SubmissionsTable
                                submissions={submissions}
                                title={`All Submissions (${submissions.length})`}
                                showActions
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onPreview={(url) => setPreviewUrl(url)}
                            />
                        </TabsContent>

                        {/* Ambassadors Tab */}
                        <TabsContent value="ambassadors" className="mt-0">
                            <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
                                <div className="px-5 py-4 border-b border-border/50">
                                    <h3 className="font-semibold text-foreground">All Ambassadors ({ambassadors.length})</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border/30">
                                                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                                                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</th>
                                                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</th>
                                                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Referral Code</th>
                                                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ambassadors.map((a, i) => (
                                                <tr key={a.id} className={`border-b border-border/20 hover:bg-white/[0.02] transition-colors ${i === ambassadors.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-5 py-3.5 font-medium text-foreground">{a.name}</td>
                                                    <td className="px-5 py-3.5 text-muted-foreground">{a.email}</td>
                                                    <td className="px-5 py-3.5 text-muted-foreground">{a.phone}</td>
                                                    <td className="px-5 py-3.5">
                                                        <code className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">{a.referralCode}</code>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                                                        {new Date(a.createdAt).toLocaleDateString('en-IN')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Leaderboard Tab */}
                        <TabsContent value="leaderboard" className="mt-0">
                            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Click <strong className="text-foreground">Add Ext. Referrals</strong> above to manually update scores from Unstop.
                                </p>
                                <Link to="/ambassador/leaderboard" className="text-sm text-primary hover:text-primary/80 transition-colors">View public leaderboard →</Link>
                            </div>
                            <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border/30">
                                                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Rank</th>
                                                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Ambassador</th>
                                                <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">Verified Tasks</th>
                                                <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">Ext. Referrals</th>
                                                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaderboard.map((entry, i) => (
                                                <tr key={entry.ambassadorId} className={`border-b border-border/20 hover:bg-white/[0.02] ${i === leaderboard.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-5 py-3.5 font-bold text-muted-foreground">#{entry.rank}</td>
                                                    <td className="px-5 py-3.5 font-medium text-foreground">{entry.ambassadorName}</td>
                                                    <td className="px-5 py-3.5 text-center text-green-400 font-semibold">{entry.verifiedTasks}</td>
                                                    <td className="px-5 py-3.5 text-center text-blue-400 font-semibold">{entry.externalReferrals}</td>
                                                    <td className="px-5 py-3.5 text-right font-bold text-foreground">{entry.totalScore}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </main>
        </div>
    );
}
