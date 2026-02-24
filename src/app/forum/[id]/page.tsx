'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Clock, MessageSquareQuote } from "lucide-react";
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

type ForumPost = {
    id: string;
    user_id: string;
    author_name: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
};

type ForumComment = {
    id: string;
    post_id: string;
    user_id: string;
    author_name: string;
    content: string;
    created_at: string;
};

export default function ForumPostPage({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<ForumPost | null>(null);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Auth and Reply state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState<{ id: string, name: string } | null>(null);
    const [newReply, setNewReply] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPostData();
        checkAuth();
    }, [params.id]);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setIsAuthenticated(true);
            setUserProfile({
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'Anonymous QA'
            });
        }
    };

    const fetchPostData = async () => {
        setIsLoading(true);
        try {
            // Fetch the main post
            const { data: postData, error: postError } = await supabase
                .from('forum_posts')
                .select('*')
                .eq('id', params.id)
                .single();

            if (postError) throw postError;
            setPost(postData);

            // Fetch comments
            const { data: commentsData, error: commentsError } = await supabase
                .from('forum_comments')
                .select('*')
                .eq('post_id', params.id)
                .order('created_at', { ascending: true });

            if (commentsError) throw commentsError;
            setComments(commentsData || []);

        } catch (error) {
            console.error('Error fetching post data:', error);
            // Ignore error - handles case where tables aren't created in Supabase yet during demo
        } finally {
            setIsLoading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReply || !userProfile || !post) return;

        setIsSubmitting(true);
        try {
            const comment = {
                post_id: post.id,
                user_id: userProfile.id,
                author_name: userProfile.name,
                content: newReply
            };

            const { data, error } = await supabase.from('forum_comments').insert([comment]).select();
            if (error) throw error;

            if (data) {
                setComments([...comments, data[0]]);
            }
            setNewReply('');
        } catch (error) {
            console.error('Error creating reply:', error);
            alert('Failed to post reply.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="max-w-4xl mx-auto py-16 text-center animate-pulse">Loading discussion...</div>;
    }

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
                <h2 className="text-2xl font-bold">Post Not Found</h2>
                <Button variant="outline" asChild><Link href="/forum">Return to Forum</Link></Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-16 space-y-8">
            <Button variant="ghost" className="mb-4" asChild>
                <Link href="/forum"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Discussions</Link>
            </Button>

            {/* Original Post */}
            <Card className="border-t-4 border-t-primary shadow-sm">
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-3 border-b pb-6">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">{post.category}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(post.created_at).toLocaleString()}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight">{post.title}</h1>
                        <div className="flex items-center gap-3 pt-2">
                            <div className="bg-primary/10 h-10 w-10 text-primary rounded-full flex items-center justify-center shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <p className="font-semibold text-sm">Posted by <span className="text-primary">{post.author_name}</span></p>
                        </div>
                    </div>
                    <div className="prose prose-sm md:prose max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </div>
                </CardContent>
            </Card>

            {/* Comments Section */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2">
                    <MessageSquareQuote className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-xl font-bold">{comments.length} Replies</h3>
                </div>

                {comments.map((comment) => (
                    <Card key={comment.id} className="bg-muted/10 shadow-sm border-l-4 border-l-secondary">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-secondary/10 h-8 w-8 text-secondary rounded-full flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{comment.author_name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(comment.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-foreground/90 whitespace-pre-wrap text-sm leading-relaxed">
                                {comment.content}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Reply Form */}
            <Card className="mt-8 border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Add your reply</h3>
                    {isAuthenticated ? (
                        <form onSubmit={handleReply} className="space-y-4">
                            <Textarea
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="Share your expertise or perspective..."
                                className="min-h-[120px]"
                                required
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Posting...' : 'Publish Reply'}
                            </Button>
                        </form>
                    ) : (
                        <div className="bg-background border rounded-lg p-8 text-center space-y-4">
                            <p className="text-muted-foreground">You must be logged in to participate in the discussion.</p>
                            <Button variant="outline" asChild><Link href="/login">Log In / Sign Up</Link></Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
