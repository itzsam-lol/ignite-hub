import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, UploadCloud, Download, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function ExternalVerificationPage() {
    const { logout } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [headers, setHeaders] = useState<string[]>([]);
    const [dataRows, setDataRows] = useState<string[][]>([]);
    const [results, setResults] = useState<Record<string, boolean>>({});
    const [githubColIndex, setGithubColIndex] = useState<number>(-1);

    const parseCSV = (text: string) => {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        return lines.map(line => {
            const result = [];
            let cur = '';
            let inQuote = false;
            for (let i = 0; i < line.length; i++) {
                if (line[i] === '"') {
                    inQuote = !inQuote;
                } else if (line[i] === ',' && !inQuote) {
                    result.push(cur);
                    cur = '';
                } else {
                    cur += line[i];
                }
            }
            result.push(cur);
            return result.map(c => c.trim().replace(/^"|"$/g, ''));
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setError('');
        setResults({});
        
        try {
            const text = await uploadedFile.text();
            const parsed = parseCSV(text);
            
            if (parsed.length < 2) {
                setError('CSV file needs at least a header row and one data row.');
                return;
            }

            const headerRow = parsed[0];
            setHeaders(headerRow);
            
            const githubIndex = headerRow.findIndex(h => h.toLowerCase().includes('github'));
            if (githubIndex === -1) {
                setError('Could not find a column containing "github" or "GitHub" in the headers.');
                return;
            }
            
            setGithubColIndex(githubIndex);
            
            const rows = parsed.slice(1);
            setDataRows(rows);
            
            // Extract usernames
            const usernames = rows.map(r => r[githubIndex]).filter(u => u && u.trim() !== '');
            const cleanUsernames = usernames.map(u => {
                let clean = u.trim();
                // Remove URL prefix
                if (clean.includes('github.com/')) {
                    clean = clean.split('github.com/')[1];
                }
                // Remove @
                clean = clean.replace('@', '');
                // Clean up any path separators, query params, etc.
                clean = clean.split('/')[0].split('?')[0].split('#')[0];
                return clean;
            }).filter(u => u !== '');
            
            if (cleanUsernames.length === 0) {
                setError('No valid GitHub usernames found in the data rows.');
                return;
            }
            
            setLoading(true);
            const batchResults = await api.verifyGithubStarBatch(cleanUsernames);
            
            // Re-map results to the original input strings from the CSV, 
            // since batchResults keys might be the cleaned usernames.
            const finalResults: Record<string, boolean> = {};
            rows.forEach((r, idx) => {
                 let originalName = r[githubIndex];
                 if (!originalName) return;
                 let cleanName = originalName.trim();
                 if (cleanName.includes('github.com/')) {
                     cleanName = cleanName.split('github.com/')[1];
                 }
                 cleanName = cleanName.replace('@', '');
                 cleanName = cleanName.split('/')[0].split('?')[0].split('#')[0];
                 
                 finalResults[originalName] = batchResults[cleanName] ?? false;
            });
            
            setResults(finalResults);

        } catch (err: any) {
            setError(err.message || 'Failed to parse CSV file.');
        } finally {
            setLoading(false);
        }
    };

    const generateDownload = () => {
        if (dataRows.length === 0 || headers.length === 0) return;
        
        const newHeaders = [...headers, 'Auto Verification'];
        const csvRows = [newHeaders];
        
        dataRows.forEach(row => {
            const githubVal = row[githubColIndex];
            const isVerified = githubVal ? (results[githubVal] ? 'TRUE' : 'FALSE') : 'FALSE';
            // Simple escaping for output
            const escapedRow = [...row, isVerified].map(val => {
                const cell = val === undefined || val === null ? '' : String(val);
                if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                    return `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
            });
            csvRows.push(escapedRow);
        });
        
        const csvContent = csvRows.map(r => r.join(',')).join('\\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `verified_${file?.name || 'export.csv'}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/ambassador/admin">
                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Button>
                        </Link>
                        <h1 className="font-bold text-foreground text-lg hidden sm:block">External GitHub Verification</h1>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    
                    <div className="glass-card rounded-2xl p-6 border border-border/50 text-center max-w-2xl mx-auto">
                        <UploadCloud className="w-10 h-10 text-primary mx-auto mb-3" />
                        <h2 className="text-xl font-bold mb-2">Upload CSV File</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Upload a CSV with external applicant data. Make sure it contains a column header including "GitHub" (e.g., "GitHub Username", "github"). The system will automatically verify star status and generate a downloadable report.
                        </p>
                        
                        <div className="relative">
                            <input 
                                type="file" 
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Button className="w-full gap-2">
                                <UploadCloud className="w-4 h-4" /> Select CSV File
                            </Button>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center flex-col items-center gap-3 py-10">
                            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                            <p className="text-muted-foreground text-sm font-medium">Verifying GitHub stars in batch. Please wait...</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {!loading && dataRows.length > 0 && !error && (
                        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <h3 className="font-bold text-lg">Verification Results ({dataRows.length} entries)</h3>
                                <Button onClick={generateDownload} className="bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/30 gap-1.5 h-9">
                                    <Download className="w-4 h-4" /> Download Enriched CSV
                                </Button>
                            </div>
                            <div className="overflow-x-auto max-h-[60vh]">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-secondary/50 sticky top-0 z-10 backdrop-blur-md">
                                        <tr>
                                            {headers.map((h, i) => (
                                                <th key={i} className="px-5 py-3 font-medium text-muted-foreground uppercase text-xs tracking-wider">
                                                    {h}
                                                </th>
                                            ))}
                                            <th className="px-5 py-3 font-medium text-muted-foreground uppercase text-xs tracking-wider sticky right-0 bg-secondary/90">
                                                Auto Verif
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {dataRows.map((row, i) => {
                                            const githubVal = row[githubColIndex];
                                            const isVerified = githubVal ? results[githubVal] : false;
                                            return (
                                                <tr key={i} className="hover:bg-secondary/20 transition-colors">
                                                    {row.map((cell, j) => (
                                                        <td key={j} className="px-5 py-3 text-foreground">
                                                            {cell}
                                                        </td>
                                                    ))}
                                                    <td className="px-5 py-3 sticky right-0 bg-background/90 tabular-nums">
                                                        {isVerified ? (
                                                            <span className="flex items-center gap-1.5 text-green-500 font-medium">
                                                                <CheckCircle2 className="w-4 h-4" /> TRUE
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5 text-red-400 font-medium">
                                                                <XCircle className="w-4 h-4" /> FALSE
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
