'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Star, StarHalf, MessageSquare, User, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Review {
    id: string;
    sop_id: string;
    user_name: string;
    rating: number;
    comment: string | null;
    created_at: string;
}

export function CustomerReviews({ sopId }: { sopId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [newRating, setNewRating] = useState<number>(5);
    const [newName, setNewName] = useState('');
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [sopId]);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('sop_reviews')
                .select('*')
                .eq('sop_id', sopId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || newRating < 1 || newRating > 5) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('sop_reviews')
                .insert({
                    sop_id: sopId,
                    user_name: newName,
                    rating: newRating,
                    comment: newComment.trim() || null,
                });

            if (error) throw error;

            // Reset form and refresh
            setNewName('');
            setNewComment('');
            setNewRating(5);
            setShowForm(false);
            await fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate metrics
    const totalReviews = reviews.length;
    let sum = 0;
    for (const r of reviews) sum += r.rating;
    const averageRatingRaw = totalReviews > 0 ? sum / totalReviews : 0;
    const averageRating = totalReviews > 0 ? averageRatingRaw.toFixed(1) : '0.0';

    const getPercentage = (stars: number) => {
        if (totalReviews === 0) return 0;
        const count = reviews.filter(r => r.rating === stars).length;
        return Math.round((count / totalReviews) * 100);
    };

    // Helper for large star rendering
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} className="h-6 w-6 fill-[#ff9900] text-[#ff9900]" />);
            } else if (i === fullStars && hasHalf) {
                stars.push(<StarHalf key={i} className="h-6 w-6 fill-[#ff9900] text-[#ff9900]" />);
            } else {
                stars.push(<Star key={i} className="h-6 w-6 text-[#ff9900]" />);
            }
        }
        return <div className="flex gap-1">{stars}</div>;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading reviews...
            </div>
        );
    }

    return (
        <div className="mt-16 mb-12 border-t pt-10">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Customer reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Rating Chart Area */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        {renderStars(totalReviews > 0 ? averageRatingRaw : 0)}
                        <span className="text-xl font-medium">{averageRating} out of 5</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{totalReviews} global ratings</p>

                    <div className="space-y-4 mt-6">
                        {[5, 4, 3, 2, 1].map(star => {
                            const percentage = getPercentage(star);
                            return (
                                <div key={star} className="flex items-center gap-3 text-sm">
                                    <span className="w-12 whitespace-nowrap text-blue-500 hover:text-[#c7511f] hover:underline cursor-pointer">{star} star</span>
                                    {/* Progress bar matching reference styling with theme colors */}
                                    <div className="flex-1 h-[22px] bg-muted dark:bg-muted/30 rounded-[3px] overflow-hidden relative border border-input shadow-inner">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-primary border-r border-[#de7921]/20 transition-all duration-500 ease-in-out"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-10 text-right text-blue-500 hover:text-[#c7511f] hover:underline cursor-pointer">{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions Area */}
                <div>
                    <Card className="shadow-none border h-full bg-card">
                        {showForm ? (
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <h3 className="font-semibold text-lg mb-2">Write a review</h3>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Rating</label>
                                        <div className="flex gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewRating(star)}
                                                    className="focus:outline-none focus-visible:ring-2 ring-primary rounded-sm p-1"
                                                >
                                                    <Star className={`h-8 w-8 transition-colors ${star <= newRating ? 'fill-[#ff9900] text-[#ff9900]' : 'text-muted-foreground/30 hover:text-[#ff9900]/50'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Your Name</label>
                                        <Input
                                            required
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Comment (Optional)</label>
                                        <Textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="What did you like or dislike?"
                                            className="resize-none"
                                            rows={4}
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={isSubmitting}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]">
                                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Submit Review'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        ) : (
                            <div className="p-6 flex flex-col items-start gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Review this document</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Share your thoughts with other customers</p>
                                </div>
                                <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
                                    Write a customer review
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Reviews List */}
            {totalReviews > 0 && (
                <div className="mt-12 space-y-6">
                    <h3 className="text-lg font-bold">Top reviews</h3>
                    <div className="grid gap-6">
                        {reviews.map(review => (
                            <div key={review.id} className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center border">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <span className="font-medium">{review.user_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-[#ff9900] text-[#ff9900]' : 'text-muted-foreground/20'}`} />
                                        ))}
                                    </div>
                                    <span className="font-bold text-sm">Verified Purchase</span>
                                </div>
                                <span className="text-xs text-muted-foreground block mb-2">
                                    Reviewed on {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                {review.comment && (
                                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap mt-1">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
