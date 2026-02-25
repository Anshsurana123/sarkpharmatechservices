'use client';

import { useState, useEffect } from 'react';
import { verifyAdmin } from './actions';
import { usePharmaStore } from '@/data/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Building2, UploadCloud, Trash2, ShieldCheck, Newspaper, Users, CreditCard, GraduationCap, PackageOpen } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';

export default function AdminPage() {
    const addSop = usePharmaStore(state => state.addSop);
    const deleteSop = usePharmaStore(state => state.deleteSop);
    const sops = usePharmaStore(state => state.sops);

    const addDepartment = usePharmaStore(state => state.addDepartment);
    const deleteDepartment = usePharmaStore(state => state.deleteDepartment);
    const departments = usePharmaStore(state => state.departments);

    const addInsight = usePharmaStore(state => state.addInsight);
    const deleteInsight = usePharmaStore(state => state.deleteInsight);
    const insights = usePharmaStore(state => state.insights);

    const addCourse = usePharmaStore(state => state.addCourse);
    const deleteCourse = usePharmaStore(state => state.deleteCourse);
    const courses = usePharmaStore(state => state.courses);

    const bundleLinks = usePharmaStore(state => state.bundleLinks);
    const updateBundleLink = usePharmaStore(state => state.updateBundleLink);

    const initialize = usePharmaStore(state => state.initialize);
    const isInitialized = usePharmaStore(state => state.isInitialized);

    const [sopTitle, setSopTitle] = useState('');
    const [sopDept, setSopDept] = useState('');
    const [sopType, setSopType] = useState('');
    const [sopContent, setSopContent] = useState('');
    const [sopFile, setSopFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [deptTitle, setDeptTitle] = useState('');
    const [deptDesc, setDeptDesc] = useState('');
    const [deptIcon, setDeptIcon] = useState('FileText');

    // Insight form state
    const [insightTitle, setInsightTitle] = useState('');
    const [insightExcerpt, setInsightExcerpt] = useState('');
    const [insightCategory, setInsightCategory] = useState('Regulatory Updates');
    const [insightReadTime, setInsightReadTime] = useState('5 min read');
    const [insightFile, setInsightFile] = useState<File | null>(null);
    const [isInsightUploading, setIsInsightUploading] = useState(false);

    // Course form state
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDesc, setCourseDesc] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [courseLevel, setCourseLevel] = useState('Beginner');
    const [courseModules, setCourseModules] = useState('');
    const [courseFiles, setCourseFiles] = useState<File[]>([]);
    const [isCourseUploading, setIsCourseUploading] = useState(false);

    // Bundle form state
    const [qmsLink, setQmsLink] = useState('');
    const [whoLink, setWhoLink] = useState('');
    const [euLink, setEuLink] = useState('');
    const [isSavingBundles, setIsSavingBundles] = useState(false);

    // Admin Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [authError, setAuthError] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // Dashboard Data
    const [transactions, setTransactions] = useState<any[]>([]);
    const [usersList, setUsersList] = useState<any[]>([
        { id: '1', email: 'rupesh.surana@example.com', role: 'Admin', joined: '2025-01-10' },
        { id: '2', email: 'qa.manager@pharmaco.com', role: 'User', joined: '2026-02-15' },
        { id: '3', email: 'auditor.smith@agency.gov', role: 'User', joined: '2026-02-18' },
    ]);
    const [isLoadingAdminData, setIsLoadingAdminData] = useState(false);

    // Sync store initial values into local state
    useEffect(() => {
        if (bundleLinks.length > 0) {
            setQmsLink(bundleLinks.find(b => b.id === 'qms-package')?.file_url || qmsLink);
            setWhoLink(bundleLinks.find(b => b.id === 'who-gmp')?.file_url || whoLink);
            setEuLink(bundleLinks.find(b => b.id === 'eu-gmp')?.file_url || euLink);
        }
    }, [bundleLinks]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAdminData();
        }
    }, [isAuthenticated]);

    const fetchAdminData = async () => {
        setIsLoadingAdminData(true);
        try {
            const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
            if (data) setTransactions(data);
        } catch (e) {
            console.error('Error fetching admin data', e);
        } finally {
            setIsLoadingAdminData(false);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem('pharma_admin_auth') === 'true') {
            setIsAuthenticated(true);
        }
        initialize();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setAuthError('');

        try {
            const result = await verifyAdmin(adminUser, adminPass);

            if (result.success) {
                setIsAuthenticated(true);
                sessionStorage.setItem('pharma_admin_auth', 'true');
            } else {
                setAuthError(result.error || 'Authentication failed.');
            }
        } catch (err) {
            setAuthError('An error occurred during verification.');
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleAddSop = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sopTitle || !sopDept || !sopType) return;
        setIsUploading(true);

        let file_url = undefined;

        // Try uploading the file to Supabase Storage if one is provided
        if (sopFile) {
            const fileName = `${sopDept.substring(0, 3)}-${Date.now()}-${sopFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const { data, error } = await supabase.storage.from('sops').upload(fileName, sopFile);

            if (error) {
                console.error("Storage upload error:", error);
                alert("Failed to upload the file to Supabase Storage.");
            } else if (data) {
                const { data: publicData } = supabase.storage.from('sops').getPublicUrl(fileName);
                file_url = publicData.publicUrl;
            }
        }

        await addSop({
            title: sopTitle,
            department: sopDept,
            documentType: sopType,
            status: 'Approved',
            date: new Date().toISOString().split('T')[0],
            author: 'Admin User',
            content: sopContent,
            file_url: file_url
        });

        setSopTitle('');
        setSopDept('');
        setSopType('');
        setSopContent('');
        setSopFile(null);
        setIsUploading(false);
        const el = document.getElementById('file-upload') as HTMLInputElement;
        if (el) el.value = '';
        alert('✅ SOP Added Successfully and saved to database!');
    };

    const handleAddDepartment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!deptTitle || !deptDesc) return;

        addDepartment({
            title: deptTitle,
            description: deptDesc,
            icon: deptIcon
        });

        // Reset form
        setDeptTitle('');
        setDeptDesc('');
        alert('Department Added Successfully!');
    };

    const handleAddInsight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!insightTitle || !insightExcerpt) return;
        setIsInsightUploading(true);

        let file_url: string | undefined = undefined;

        if (insightFile) {
            const fileName = `INS-${Date.now()}-${insightFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const { data, error } = await supabase.storage.from('insights').upload(fileName, insightFile);
            if (error) {
                console.error('Insight file upload error:', error);
                alert('Failed to upload the document. Please try again.');
                setIsInsightUploading(false);
                return;
            } else if (data) {
                const { data: publicData } = supabase.storage.from('insights').getPublicUrl(fileName);
                file_url = publicData.publicUrl;
            }
        }

        await addInsight({
            title: insightTitle,
            excerpt: insightExcerpt,
            date: new Date().toISOString().split('T')[0],
            category: insightCategory,
            read_time: insightReadTime,
            file_url
        });

        // Reset form
        setInsightTitle('');
        setInsightExcerpt('');
        setInsightFile(null);
        setIsInsightUploading(false);
        const el = document.getElementById('insight-file-upload') as HTMLInputElement;
        if (el) el.value = '';
        alert('Insight Added Successfully!');
    };

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseTitle || !courseDesc || !coursePrice) return;
        setIsCourseUploading(true);

        const uploadedFiles: { name: string, url: string, type: string }[] = [];

        if (courseFiles.length > 0) {
            for (const file of courseFiles) {
                const fileName = `CRS-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
                const { data, error } = await supabase.storage.from('courses').upload(fileName, file);

                if (error) {
                    console.error('Course file upload error:', error);
                    alert(`Failed to upload ${file.name}.`);
                } else if (data) {
                    const { data: publicData } = supabase.storage.from('courses').getPublicUrl(fileName);
                    uploadedFiles.push({
                        name: file.name,
                        url: publicData.publicUrl,
                        type: file.type || 'file'
                    });
                }
            }
        }

        await addCourse({
            title: courseTitle,
            description: courseDesc,
            price: Number(coursePrice),
            duration: courseDuration,
            level: courseLevel,
            modules: courseModules.split(',').map(m => m.trim()).filter(Boolean),
            files: uploadedFiles
        });

        setCourseTitle('');
        setCourseDesc('');
        setCoursePrice('');
        setCourseDuration('');
        setCourseLevel('Beginner');
        setCourseModules('');
        setCourseFiles([]);
        setIsCourseUploading(false);
        const el = document.getElementById('course-files-upload') as HTMLInputElement;
        if (el) el.value = '';
        alert('Course Added Successfully!');
    };

    const handleSaveBundles = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingBundles(true);
        try {
            if (qmsLink) await updateBundleLink('qms-package', qmsLink);
            if (whoLink) await updateBundleLink('who-gmp', whoLink);
            if (euLink) await updateBundleLink('eu-gmp', euLink);
            alert('Bundle Links saved successfully! Users purchasing these packages will now receive these links.');
        } catch (error) {
            console.error('Error saving bundle links:', error);
            alert('Failed to save bundle links.');
        } finally {
            setIsSavingBundles(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-4">
                <Card className="w-full max-w-sm border-destructive/20 shadow-lg">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-2 text-destructive">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-destructive">Restricted Area</CardTitle>
                        <CardDescription>Enter admin credentials to continue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {authError && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md text-center">
                                    {authError}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={adminUser}
                                    onChange={(e) => setAdminUser(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={adminPass}
                                    onChange={(e) => setAdminPass(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isAuthenticating}>
                                {isAuthenticating ? 'Verifying...' : 'Login'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
                <p className="text-muted-foreground">Manage platform content and taxonomy.</p>
            </div>

            <Tabs defaultValue="sops" className="w-full max-w-3xl">
                <TabsList className="mb-4">
                    <TabsTrigger value="sops" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Documents
                    </TabsTrigger>
                    <TabsTrigger value="departments" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Departments
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="flex items-center gap-2">
                        <Newspaper className="h-4 w-4" /> Insights
                    </TabsTrigger>

                    <TabsTrigger value="payments" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Payments
                    </TabsTrigger>
                    <TabsTrigger value="courses" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" /> Courses
                    </TabsTrigger>
                    <TabsTrigger value="bundles" className="flex items-center gap-2">
                        <PackageOpen className="h-4 w-4" /> Bundles
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="sops">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New SOP</CardTitle>
                            <CardDescription>Upload a new standard operating procedure to the database.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddSop} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Document Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., HVAC System Maintenance"
                                        value={sopTitle}
                                        onChange={(e) => setSopTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Department</Label>
                                        <Select value={sopDept} onValueChange={setSopDept} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map(d => (
                                                    <SelectItem key={d.id} value={d.title}>{d.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Document Type</Label>
                                        <Select value={sopType} onValueChange={setSopType} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Manual">Manual</SelectItem>
                                                <SelectItem value="Protocol">Protocol</SelectItem>
                                                <SelectItem value="Checklist">Checklist</SelectItem>
                                                <SelectItem value="Validation Document">Validation Document</SelectItem>
                                                <SelectItem value="Regulatory Document">Regulatory Document</SelectItem>
                                                <SelectItem value="Template">Template</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Document Upload</Label>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                accept=".doc,.docx,.pdf"
                                                onChange={(e) => setSopFile(e.target.files?.[0] || null)}
                                            />
                                            {sopFile && <span className="text-xs text-muted-foreground whitespace-nowrap">{Math.round(sopFile.size / 1024)} KB</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 pt-2 border-t">
                                    <Label htmlFor="content">Document Content (Optional Markdown/Text)</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Write the SOP content here, or upload a Word Document above..."
                                        className="min-h-[150px]"
                                        value={sopContent}
                                        onChange={(e) => setSopContent(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full mt-4" disabled={isUploading}>
                                    {isUploading ? 'Uploading...' : 'Create Document'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="mt-6 border-destructive/20">
                        <CardHeader>
                            <CardTitle className="text-destructive">Manage Documents</CardTitle>
                            <CardDescription>Permanently remove documents from the database.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sops.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No documents found.</p>
                                ) : (
                                    sops.map(sop => (
                                        <div key={sop.id} className="flex items-center justify-between p-3 rounded-md border bg-muted/20">
                                            <div>
                                                <p className="font-medium text-sm">{sop.title}</p>
                                                <p className="text-xs text-muted-foreground">{sop.id} • {sop.department}</p>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to delete this document?')) {
                                                        await deleteSop(sop.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="departments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Department</CardTitle>
                            <CardDescription>Create a new taxonomy category for organizing related SOPs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddDepartment} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="deptName">Department Name</Label>
                                    <Input
                                        id="deptName"
                                        placeholder="e.g., Clinical Trials"
                                        value={deptTitle}
                                        onChange={(e) => setDeptTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deptDesc">Description</Label>
                                    <Input
                                        id="deptDesc"
                                        placeholder="Brief description of the department's role"
                                        value={deptDesc}
                                        onChange={(e) => setDeptDesc(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Navigation Icon</Label>
                                    <Select value={deptIcon} onValueChange={setDeptIcon}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FileText">Document</SelectItem>
                                            <SelectItem value="Building2">Building</SelectItem>
                                            <SelectItem value="Beaker">Beaker</SelectItem>
                                            <SelectItem value="Microscope">Microscope</SelectItem>
                                            <SelectItem value="BriefcaseMedical">Medical Kit</SelectItem>
                                            <SelectItem value="Cross">Cross</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="w-full">Create Department</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="mt-6 border-destructive/20">
                        <CardHeader>
                            <CardTitle className="text-destructive">Manage Departments</CardTitle>
                            <CardDescription>Permanently remove departments. Note: This assumes associated SOPs are handled.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {departments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No departments found.</p>
                                ) : (
                                    departments.map(dept => (
                                        <div key={dept.id} className="flex items-center justify-between p-3 rounded-md border bg-muted/20">
                                            <div>
                                                <p className="font-medium text-sm">{dept.title}</p>
                                                <p className="text-xs text-muted-foreground">{dept.id}</p>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to delete this department?')) {
                                                        await deleteDepartment(dept.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="insights">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Insight</CardTitle>
                            <CardDescription>Publish a new article or insight to the home page. Optionally attach a Word document for download.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddInsight} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="insightTitle">Title</Label>
                                    <Input
                                        id="insightTitle"
                                        placeholder="e.g., FDA Updates Guidance on Sterile Manufacturing"
                                        value={insightTitle}
                                        onChange={(e) => setInsightTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="insightExcerpt">Description</Label>
                                    <Textarea
                                        id="insightExcerpt"
                                        placeholder="A short summary of the insight (shown on the home page card)..."
                                        className="min-h-[100px]"
                                        value={insightExcerpt}
                                        onChange={(e) => setInsightExcerpt(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={insightCategory} onValueChange={setInsightCategory}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Regulatory Updates">Regulatory Updates</SelectItem>
                                                <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                                                <SelectItem value="Quality Control">Quality Control</SelectItem>
                                                <SelectItem value="Microbiology">Microbiology</SelectItem>
                                                <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                                                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                                <SelectItem value="Career">Career / Interview Q&A</SelectItem>
                                                <SelectItem value="General">General</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Estimated Read Time</Label>
                                        <Select value={insightReadTime} onValueChange={setInsightReadTime}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select read time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2 min read">2 min read</SelectItem>
                                                <SelectItem value="3 min read">3 min read</SelectItem>
                                                <SelectItem value="5 min read">5 min read</SelectItem>
                                                <SelectItem value="7 min read">7 min read</SelectItem>
                                                <SelectItem value="10 min read">10 min read</SelectItem>
                                                <SelectItem value="15 min read">15 min read</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2 pt-2 border-t">
                                    <Label htmlFor="insight-file-upload" className="flex items-center gap-2">
                                        <UploadCloud className="h-4 w-4" /> Word Document (Optional)
                                    </Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="insight-file-upload"
                                            type="file"
                                            accept=".doc,.docx"
                                            onChange={(e) => setInsightFile(e.target.files?.[0] || null)}
                                        />
                                        {insightFile && <span className="text-xs text-muted-foreground whitespace-nowrap">{Math.round(insightFile.size / 1024)} KB</span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground">If provided, users will see a &quot;Download Document&quot; button on the insight card.</p>
                                </div>
                                <Button type="submit" className="w-full mt-4" disabled={isInsightUploading}>
                                    {isInsightUploading ? 'Publishing...' : 'Publish Insight'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="mt-6 border-destructive/20">
                        <CardHeader>
                            <CardTitle className="text-destructive">Manage Insights</CardTitle>
                            <CardDescription>Remove insights from the home page permanently.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {insights.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No insights published yet.</p>
                                ) : (
                                    insights.map(insight => (
                                        <div key={insight.id} className="flex items-center justify-between p-3 rounded-md border bg-muted/20">
                                            <div>
                                                <p className="font-medium text-sm">{insight.title}</p>
                                                <p className="text-xs text-muted-foreground">{insight.date} • {insight.category}</p>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to remove this insight?')) {
                                                        await deleteInsight(insight.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>



                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transactions Ledger</CardTitle>
                            <CardDescription>Track successful purchases of SOPs, Bundles, and Courses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingAdminData ? (
                                <div className="py-8 text-center text-muted-foreground animate-pulse">Loading transactions...</div>
                            ) : transactions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 border rounded-lg border-dashed">
                                    <CreditCard className="h-10 w-10 text-muted-foreground/50 mb-4" />
                                    <h3 className="font-semibold text-lg">No Transactions Yet</h3>
                                    <p className="text-sm text-muted-foreground mt-2 max-w-sm mb-6">
                                        Sales recorded via Razorpay will appear here.
                                    </p>
                                    <Button variant="outline" asChild>
                                        <a href="https://dashboard.razorpay.com/" target="_blank" rel="noopener noreferrer">
                                            Open Razorpay Dashboard
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {transactions.map(tx => (
                                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-md border bg-muted/20">
                                            <div>
                                                <p className="font-medium text-sm">{tx.item_name}</p>
                                                <p className="text-xs text-muted-foreground">ID: {tx.payment_id} • {new Date(tx.created_at).toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm text-green-600">+{tx.currency} {tx.amount.toLocaleString()}</p>
                                                <Badge variant="outline" className="text-[10px] mt-1 bg-green-500/10 text-green-600 border-none">Completed</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t flex justify-between items-center px-2">
                                        <span className="font-bold">Total Sales</span>
                                        <span className="font-bold text-lg text-green-600">
                                            INR {transactions.filter(t => t.currency === 'INR').reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}
                                            {' | '}
                                            USD {transactions.filter(t => t.currency === 'USD').reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="courses">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Course</CardTitle>
                            <CardDescription>Create a new online training program for purchase.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddCourse} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="courseTitle">Course Title</Label>
                                    <Input
                                        id="courseTitle"
                                        placeholder="e.g., Advanced GMP Auditing"
                                        value={courseTitle}
                                        onChange={(e) => setCourseTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="courseDesc">Description</Label>
                                    <Textarea
                                        id="courseDesc"
                                        placeholder="Detailed description of the course..."
                                        value={courseDesc}
                                        onChange={(e) => setCourseDesc(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="coursePrice">Price ($)</Label>
                                        <Input
                                            id="coursePrice"
                                            type="number"
                                            placeholder="e.g., 299"
                                            value={coursePrice}
                                            onChange={(e) => setCoursePrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="courseDuration">Duration</Label>
                                        <Input
                                            id="courseDuration"
                                            placeholder="e.g., 4 Weeks"
                                            value={courseDuration}
                                            onChange={(e) => setCourseDuration(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 lg:col-span-2">
                                        <Label>Level</Label>
                                        <Select value={courseLevel} onValueChange={setCourseLevel}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                                <SelectItem value="Expert">Expert</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="courseModules">Modules (comma separated)</Label>
                                    <Input
                                        id="courseModules"
                                        placeholder="e.g., Module 1: Intro to GMP, Module 2: Auditing Techniques..."
                                        value={courseModules}
                                        onChange={(e) => setCourseModules(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2 pt-2 border-t">
                                    <Label htmlFor="course-files-upload" className="flex items-center gap-2">
                                        <UploadCloud className="h-4 w-4" /> Course Materials (Videos, Images, Files)
                                    </Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="course-files-upload"
                                            type="file"
                                            multiple
                                            onChange={(e) => setCourseFiles(e.target.files ? Array.from(e.target.files) : [])}
                                        />
                                        {courseFiles.length > 0 && <span className="text-xs text-muted-foreground whitespace-nowrap">{courseFiles.length} files selected</span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Upload the course content. Users will be given access to these files after successful payment.</p>
                                </div>
                                <Button type="submit" className="w-full mt-4" disabled={isCourseUploading}>
                                    {isCourseUploading ? 'Uploading & Creating...' : 'Create Course'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="mt-6 border-destructive/20">
                        <CardHeader>
                            <CardTitle className="text-destructive">Manage Courses</CardTitle>
                            <CardDescription>Permanently remove courses from the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {courses.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No courses created yet.</p>
                                ) : (
                                    courses.map(course => (
                                        <div key={course.id} className="flex items-center justify-between p-3 rounded-md border bg-muted/20">
                                            <div>
                                                <p className="font-medium text-sm">{course.title}</p>
                                                <p className="text-xs text-muted-foreground">${course.price} • {course.level}</p>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to delete this course?')) {
                                                        await deleteCourse(course.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bundles">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Premium Bundles</CardTitle>
                            <CardDescription>Updates the secure Google Drive / Cloud links that are automatically emailed or presented to buyers upon successful purchase of a package.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveBundles} className="space-y-6">
                                <div className="space-y-3 p-4 border rounded-lg bg-card/50">
                                    <h3 className="font-bold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Complete QMS Package</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="qmsLink">Download URL (Google Drive / Zip URL)</Label>
                                        <Input
                                            id="qmsLink"
                                            placeholder="https://drive.google.com/..."
                                            value={qmsLink}
                                            onChange={(e) => setQmsLink(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">This link unlocks the 250+ SOP standard library package.</p>
                                    </div>
                                </div>

                                <div className="space-y-3 p-4 border rounded-lg bg-card/50">
                                    <h3 className="font-bold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-secondary" /> WHO-GMP Package</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="whoLink">Download URL</Label>
                                        <Input
                                            id="whoLink"
                                            placeholder="https://drive.google.com/..."
                                            value={whoLink}
                                            onChange={(e) => setWhoLink(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 p-4 border rounded-lg bg-card/50">
                                    <h3 className="font-bold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-500" /> EU-GMP Annex 1 Package</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="euLink">Download URL</Label>
                                        <Input
                                            id="euLink"
                                            placeholder="https://drive.google.com/..."
                                            value={euLink}
                                            onChange={(e) => setEuLink(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={isSavingBundles}>
                                    {isSavingBundles ? 'Saving Links...' : 'Save All Bundle Links'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
