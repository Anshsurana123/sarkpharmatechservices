'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

const CONSENT_KEY = 'pharma_cookie_consent';

export function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (!stored) setVisible(true);
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-card/95 backdrop-blur-md border shadow-2xl rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Cookie className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        We use cookies to improve your experience and analyse usage. By continuing, you agree to our{' '}
                        <a href="/about" className="underline text-foreground hover:text-primary transition-colors">Privacy Policy</a>.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={handleDecline} className="rounded-full text-xs">
                        Decline
                    </Button>
                    <Button size="sm" onClick={handleAccept} className="rounded-full text-xs">
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    );
}
