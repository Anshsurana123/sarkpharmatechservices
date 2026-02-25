'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MessagesSquare, Clock, Plus, ArrowRight } from "lucide-react";
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

type ForumPost = {
    id: string;
    user_id: string;
    author_name: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
    replies_count?: number; // Mocked or joined if available
};

export default function ForumPage() {
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState<{ id: string, name: string } | null>(null);

    // New Post State
    const [isComposing, setIsComposing] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newCategory, setNewCategory] = useState('General Discussion');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPosts();
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setIsAuthenticated(true);
            setUserProfile({
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'Anonymous QA' // Fallback basic name
            });
        }
    };

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('forum_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Default empty state if table doesn't exist yet
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newContent || !userProfile) return;

        setIsSubmitting(true);
        try {
            const newPost = {
                user_id: userProfile.id,
                author_name: userProfile.name,
                title: newTitle,
                content: newContent,
                category: newCategory,
            };

            const { data, error } = await supabase.from('forum_posts').insert([newPost]).select();
            if (error) throw error;

            if (data) {
                setPosts([data[0], ...posts]);
            }

            setIsComposing(false);
            setNewTitle('');
            setNewContent('');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to post. (Ensure the forum_posts table exists in Supabase!)');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-16 space-y-8">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-center shadow-xl mb-8">
                <Image src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80" alt="Professional Networking" fill className="object-cover z-0" priority />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/95 via-[#0d6e66]/85 to-[#0f2744]/70 z-[1]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-[1]" />
                <div className="relative z-10 text-white space-y-4">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mx-auto mb-2">
                        <Users className="h-8 w-8 text-white" />
                    </div>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mx-auto mb-2 block w-max">Community Forum</Badge>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">The Pharma Quality Network</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        A dedicated community where compliance professionals discuss audit findings, regulatory changes, and share practical solutions.
                    </p>
                </div>
            </section>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Main Feed */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-2xl font-bold">Recent Discussions</h2>
                        {isAuthenticated ? (
                            <Button onClick={() => setIsComposing(!isComposing)}>
                                {isComposing ? 'Cancel Post' : <><Plus className="h-4 w-4 mr-2" /> New Post</>}
                            </Button>
                        ) : (
                            <Button variant="outline" disabled>Log in to Post</Button>
                        )}
                    </div>

                    {isComposing && (
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg">Create a Discussion</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreatePost} className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="What's your question or topic?" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Category</label>
                                            <Select value={newCategory} onValueChange={setNewCategory}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Audit Prep">Audit Prep</SelectItem>
                                                    <SelectItem value="OOS / CAPA">OOS / CAPA</SelectItem>
                                                    <SelectItem value="Validation">Validation</SelectItem>
                                                    <SelectItem value="General Discussion">General Discussion</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Content</label>
                                        <Textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Provide context, share an experience..." className="min-h-[120px]" required />
                                    </div>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Posting...' : 'Publish Post'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {isLoading ? (
                        <div className="py-12 text-center text-muted-foreground animate-pulse">Loading discussions...</div>
                    ) : posts.length === 0 ? (
                        <div className="py-12 text-center border rounded-xl bg-card">
                            <MessagesSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-lg font-bold">No discussions yet</h3>
                            <p className="text-muted-foreground">Be the first to start a conversation in the community!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <Card key={post.id} className="hover:border-primary/40 transition-colors group">
                                    <CardContent className="p-5 flex gap-4">
                                        <div className="hidden sm:flex flex-col items-center justify-center bg-muted h-12 w-12 rounded-full shrink-0">
                                            <Users className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs font-normal">{post.category}</Badge>
                                                        <span className="text-xs text-muted-foreground flex items-center"><Clock className="h-3 w-3 mr-1" /> {new Date(post.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <Link href={`/forum/${post.id}`}>
                                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors mt-1">{post.title}</h3>
                                                    </Link>
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground/80 line-clamp-2">{post.content}</p>
                                            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-2">
                                                <span>By {post.author_name}</span>
                                                <Link href={`/forum/${post.id}`} className="flex items-center hover:text-primary transition-colors ml-auto">
                                                    Read & Reply <ArrowRight className="h-3 w-3 ml-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between items-center text-primary font-medium cursor-pointer">
                                <span>All Topics</span>
                                <span>{posts.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground hover:text-foreground cursor-pointer">
                                <span>Audit Prep</span>
                                <span>{posts.filter(p => p.category === 'Audit Prep').length}</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground hover:text-foreground cursor-pointer">
                                <span>OOS / CAPA</span>
                                <span>{posts.filter(p => p.category === 'OOS / CAPA').length}</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground hover:text-foreground cursor-pointer">
                                <span>Validation</span>
                                <span>{posts.filter(p => p.category === 'Validation').length}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground border-none">
                        <CardContent className="p-5 text-center space-y-3">
                            <h3 className="font-bold">Guidelines</h3>
                            <p className="text-xs text-primary-foreground/80">
                                Keep discussions professional. Do not share confidential company documents or unredacted proprietary data.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
