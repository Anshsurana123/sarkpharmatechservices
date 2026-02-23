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
import { FileText, Building2, UploadCloud, Trash2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';

export default function AdminPage() {
    const addSop = usePharmaStore(state => state.addSop);
    const deleteSop = usePharmaStore(state => state.deleteSop);
    const sops = usePharmaStore(state => state.sops);

    const addDepartment = usePharmaStore(state => state.addDepartment);
    const deleteDepartment = usePharmaStore(state => state.deleteDepartment);
    const departments = usePharmaStore(state => state.departments);

    const [sopTitle, setSopTitle] = useState('');
    const [sopDept, setSopDept] = useState('');
    const [sopType, setSopType] = useState('');
    const [sopStatus, setSopStatus] = useState('Draft');
    const [sopContent, setSopContent] = useState('');
    const [sopFile, setSopFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [deptTitle, setDeptTitle] = useState('');
    const [deptDesc, setDeptDesc] = useState('');
    const [deptIcon, setDeptIcon] = useState('FileText');

    // Admin Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [authError, setAuthError] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('pharma_admin_auth') === 'true') {
            setIsAuthenticated(true);
        }
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
            status: sopStatus as 'Draft' | 'Approved' | 'Under Review',
            date: new Date().toISOString().split('T')[0],
            author: 'Admin User',
            content: sopContent,
            file_url: file_url
        });

        // Reset form
        setSopTitle('');
        setSopDept('');
        setSopType('');
        setSopContent('');
        setSopFile(null);
        setIsUploading(false);
        (document.getElementById('file-upload') as HTMLInputElement).value = '';
        alert('SOP Added Successfully!');
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
            </Tabs>
        </div>
    );
}
