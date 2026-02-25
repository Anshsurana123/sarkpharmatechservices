'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Printer, Plus, Trash2, ArrowLeft, Wand2, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useRazorpay } from '@/hooks/useRazorpay';

export default function ResumeBuilderPage() {
    const [personalInfo, setPersonalInfo] = useState({ name: '', email: '', phone: '', linkedin: '' });
    const [summary, setSummary] = useState('');
    const [experience, setExperience] = useState([{ id: 1, company: '', role: '', dates: '', description: '' }]);
    const [education, setEducation] = useState([{ id: 1, institution: '', degree: '', year: '' }]);
    const [skills, setSkills] = useState('');

    // AI Enhancement State
    const [isEnhancing, setIsEnhancing] = useState(false);
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const addExperience = () => setExperience([...experience, { id: Date.now(), company: '', role: '', dates: '', description: '' }]);
    const removeExperience = (id: number) => setExperience(experience.filter(e => e.id !== id));

    const addEducation = () => setEducation([...education, { id: Date.now(), institution: '', degree: '', year: '' }]);
    const removeEducation = (id: number) => setEducation(education.filter(e => e.id !== id));

    const handlePrint = () => {
        window.print();
    };

    const handleEnhanceWithAI = async () => {
        if (!summary && experience.length === 1 && !experience[0].description && !skills) {
            alert('Please fill out some resume sections first before enhancing.');
            return;
        }

        // Trigger Razorpay for ₹199
        processPayment(
            199,
            'INR',
            'Premium AI Resume Enhancement',
            'AI Resume',
            'SARK_RESUME_AI'
        );

        // Listen for successful payment to unlock generation
        const handlePaymentComplete = async () => {
            setIsEnhancing(true);
            try {
                const response = await fetch('/api/enhance-resume', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ summary, experience, skills })
                });

                if (!response.ok) {
                    throw new Error('Failed to enhance resume');
                }

                const data = await response.json();

                if (data.summary) setSummary(data.summary);
                if (data.skills) setSkills(data.skills);
                if (data.experience && Array.isArray(data.experience)) {
                    // Map enhanced descriptions back to original experience IDs
                    setExperience(prev => prev.map(exp => {
                        const enhancedExp = data.experience.find((e: any) => e.id === exp.id);
                        return enhancedExp ? { ...exp, description: enhancedExp.description } : exp;
                    }));
                }

                alert("✨ Magic Complete! Your resume has been professionally enhanced. Review the changes and download your PDF.");

            } catch (error) {
                console.error("AI Enhancement Error:", error);
                alert("There was an error enhancing your resume. Please contact support.");
            } finally {
                setIsEnhancing(false);
                window.removeEventListener('pharma_purchase_complete', handlePaymentComplete);
            }
        };

        window.addEventListener('pharma_purchase_complete', handlePaymentComplete);
    };

    return (
        <div className="max-w-7xl mx-auto pb-16 space-y-8">
            <div className="flex items-center gap-4 print:hidden">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/resources"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">QA/QC Resume Builder</h1>
                    <p className="text-muted-foreground">Create an ATS-friendly resume tailored for pharma.</p>
                </div>
                <div className="ml-auto flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={handleEnhanceWithAI}
                        disabled={isEnhancing || isPaymentProcessing}
                        className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-indigo-200"
                    >
                        {isEnhancing || isPaymentProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                        {isEnhancing ? 'Enhancing...' : 'Enhance with A.I. (₹199)'}
                    </Button>
                    <Button onClick={handlePrint} className="gap-2"><Printer className="h-4 w-4" /> Export PDF</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">

                {/* Editor Section */}
                <div className="space-y-6 print:hidden">
                    <Card>
                        <CardHeader className="pb-4 border-b mb-4">
                            <CardTitle className="text-lg">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input value={personalInfo.name} onChange={e => setPersonalInfo({ ...personalInfo, name: e.target.value })} placeholder="e.g. John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={personalInfo.email} onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })} placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input value={personalInfo.phone} onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })} placeholder="+1 234 567 8900" />
                                </div>
                                <div className="space-y-2">
                                    <Label>LinkedIn / URL</Label>
                                    <Input value={personalInfo.linkedin} onChange={e => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} placeholder="linkedin.com/in/johndoe" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4 border-b mb-4">
                            <CardTitle className="text-lg">Professional Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                className="min-h-[100px]"
                                value={summary}
                                onChange={e => setSummary(e.target.value)}
                                placeholder="Detail-oriented QA professional with 5+ years of experience in GMP manufacturing..."
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4 border-b mb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Experience</CardTitle>
                            <Button variant="outline" size="sm" onClick={addExperience}><Plus className="h-4 w-4 mr-1" /> Add Role</Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={exp.id} className="space-y-4 pb-6 border-b last:border-0 last:pb-0 relative group">
                                    {experience.length > 1 && (
                                        <Button variant="ghost" size="icon" className="absolute -right-2 -top-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeExperience(exp.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Job Title</Label>
                                            <Input value={exp.role} onChange={e => {
                                                const newExp = [...experience];
                                                newExp[index].role = e.target.value;
                                                setExperience(newExp);
                                            }} placeholder="Senior QA Officer" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Company</Label>
                                            <Input value={exp.company} onChange={e => {
                                                const newExp = [...experience];
                                                newExp[index].company = e.target.value;
                                                setExperience(newExp);
                                            }} placeholder="PharmaCorp Inc." />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label>Dates</Label>
                                            <Input value={exp.dates} onChange={e => {
                                                const newExp = [...experience];
                                                newExp[index].dates = e.target.value;
                                                setExperience(newExp);
                                            }} placeholder="Jan 2020 - Present" />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label>Responsibilities & Achievements</Label>
                                            <Textarea value={exp.description} onChange={e => {
                                                const newExp = [...experience];
                                                newExp[index].description = e.target.value;
                                                setExperience(newExp);
                                            }} placeholder="• Managed deviation investigations..." className="min-h-[100px]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4 border-b mb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Education</CardTitle>
                            <Button variant="outline" size="sm" onClick={addEducation}><Plus className="h-4 w-4 mr-1" /> Add Education</Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {education.map((edu, index) => (
                                <div key={edu.id} className="space-y-4 pb-6 border-b last:border-0 last:pb-0 relative group">
                                    {education.length > 1 && (
                                        <Button variant="ghost" size="icon" className="absolute -right-2 -top-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeEducation(edu.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2">
                                            <Label>Degree & Major</Label>
                                            <Input value={edu.degree} onChange={e => {
                                                const newEdu = [...education];
                                                newEdu[index].degree = e.target.value;
                                                setEducation(newEdu);
                                            }} placeholder="M.Sc. in Pharmaceutical Sciences" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Institution</Label>
                                            <Input value={edu.institution} onChange={e => {
                                                const newEdu = [...education];
                                                newEdu[index].institution = e.target.value;
                                                setEducation(newEdu);
                                            }} placeholder="University Name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Year of Graduation</Label>
                                            <Input value={edu.year} onChange={e => {
                                                const newEdu = [...education];
                                                newEdu[index].year = e.target.value;
                                                setEducation(newEdu);
                                            }} placeholder="2018" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4 border-b mb-4">
                            <CardTitle className="text-lg">Skills</CardTitle>
                            <CardDescription>Comma separated list of keywords (e.g. GMP, Root Cause Analysis, CAPA)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={skills}
                                onChange={e => setSkills(e.target.value)}
                                placeholder="CAPA, Root Cause Analysis, GMP Auditing, ISO 9001, Validation Protocols..."
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Section */}
                <div className={`sticky top-24 bg-white border shadow-xl p-8 lg:p-12 min-h-[A4] w-full text-slate-900 transition-all duration-500 print:shadow-none print:border-none print:p-0 print:m-0 ${isEnhancing ? 'opacity-50 blur-sm scale-[0.98]' : 'opacity-100 scale-100'}`} id="resume-preview">
                    {/* CSS for printing only the preview */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            #resume-preview, #resume-preview * {
                                visibility: visible;
                            }
                            #resume-preview {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                            }
                            @page { margin: 2cm; }
                        }
                    `}} />

                    {/* Resume Header */}
                    <div className="border-b-2 border-primary pb-4 mb-6 text-center">
                        <h2 className="text-3xl font-bold uppercase tracking-wider mb-2 text-primary">
                            {personalInfo.name || 'YOUR NAME'}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-slate-700">
                            {personalInfo.email && <span>{personalInfo.email}</span>}
                            {personalInfo.email && personalInfo.phone && <span>|</span>}
                            {personalInfo.phone && <span>{personalInfo.phone}</span>}
                            {personalInfo.phone && personalInfo.linkedin && <span>|</span>}
                            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                        </div>
                    </div>

                    {/* Summary */}
                    {summary && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-3 text-slate-800">Professional Summary</h3>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {(experience.length > 0 && experience[0].role !== '') && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-3 text-slate-800">Professional Experience</h3>
                            <div className="space-y-4">
                                {experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex items-start justify-between mb-1">
                                            <div>
                                                <h4 className="font-bold text-base">{exp.role || 'Job Title'}</h4>
                                                <p className="text-sm font-medium italic text-slate-600">{exp.company || 'Company Name'}</p>
                                            </div>
                                            <span className="text-sm font-medium whitespace-nowrap">{exp.dates || 'Dates'}</span>
                                        </div>
                                        {exp.description && (
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap ml-0 sm:ml-4 text-slate-800">{exp.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {(education.length > 0 && education[0].degree !== '') && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-3 text-slate-800">Education</h3>
                            <div className="space-y-3">
                                {education.map(edu => (
                                    <div key={edu.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h4 className="font-bold text-sm">{edu.degree || 'Degree'}</h4>
                                            <p className="text-sm italic text-slate-600">{edu.institution || 'Institution'}</p>
                                        </div>
                                        <span className="text-sm whitespace-nowrap">{edu.year || 'Year'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {skills && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-3 text-slate-800">Core Competencies</h3>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm leading-relaxed">
                                {skills.split(',').map((skill, i) => skill.trim() && (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        {skill.trim()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
