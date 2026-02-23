'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, Mail, Github, Linkedin, Check } from 'lucide-react';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Success! You can now sign in with your new account.' });
            // Optionally clear the form
            setPassword('');
        }
        setIsLoading(false);
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
            setIsLoading(false);
        } else {
            // Successfully logged in, let the global listener catch the session, then redirect
            setMessage({ type: 'success', text: 'Logged in successfully!' });
            setTimeout(() => {
                router.push('/');
            }, 500);
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'linkedin_oidc') => {
        setIsLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
            setIsLoading(false);
        }
        // If successful, Supabase automatically redirects to the provider
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to your PharmaModern account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        {message && (
                            <div className={`p-3 mb-6 text-sm border rounded-md flex items-start gap-2 ${message.type === 'error' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <Button
                                variant="outline"
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleOAuthSignIn('google')}
                                className="w-full bg-background hover:bg-muted"
                            >
                                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.037 21.983c6.16 0 10.95-4.269 10.95-10.871 0-.756-.062-1.464-.176-2.164H12.037v4.066h6.142c-.255 1.343-1.002 2.476-2.115 3.238v2.673h3.425c2.007-1.848 3.166-4.57 3.166-7.732 0-.829-.071-1.62-.212-2.39-10.372 0-10.407 0-10.407 0v4.254h5.819c-.25 1.157-.935 2.117-1.884 2.766v2.296h3.044c1.783-1.642 2.812-4.062 2.812-6.86 0-.67-.06-1.32-.172-1.95-10.024 0-10.024 0-10.024 0v4.931h5.302c-.22 1-.82 1.83-1.65 2.37v1.96h2.66c1.55-1.43 2.44-3.53 2.44-5.96 0-.57-.05-1.12-.14-1.66-9.66 0-9.66 0-9.66 0v5.57h4.81c-.19.86-.71 1.57-1.43 2.04v1.68h2.3c1.33-1.22 2.1-3.04 2.1-5.11z" clipRule="evenodd" />
                                    <path d="M12.037 21.983c3.085 0 5.672-1.026 7.561-2.775l-3.425-2.673c-1.022.686-2.327 1.092-4.136 1.092-3.18 0-5.874-2.148-6.83-5.035H1.67v2.756c1.894 3.766 5.808 6.635 10.367 6.635z" fill="#34A853" />
                                    <path d="M5.207 12.592c-.244-.73-.385-1.516-.385-2.328 0-.812.141-1.597.385-2.328V5.18H1.67A10.875 10.875 0 00.5 10.264c0 1.761.42 3.435 1.17 4.935l3.537-2.607z" fill="#FBBC05" />
                                    <path d="M12.037 2.854c1.675 0 3.179.576 4.364 1.713l3.27-3.27C17.702-.128 15.115-1 12.037-1 7.478-1 3.564 1.87 1.67 5.18l3.537 2.756c.956-2.887 3.65-5.082 6.83-5.082z" fill="#EA4335" />
                                    <path d="M12.037 2.854c1.675 0 3.179.576 4.364 1.713l3.27-3.27C17.702-.128 15.115-1 12.037-1 7.478-1 3.564 1.87 1.67 5.18l3.537 2.756c.956-2.887 3.65-5.082 6.83-5.082z" fill="#4285F4" />
                                </svg>
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleOAuthSignIn('linkedin_oidc')}
                                className="w-full bg-background hover:bg-muted"
                            >
                                <Linkedin className="h-4 w-4 mr-2 text-[#0A66C2]" />
                                LinkedIn
                            </Button>
                        </div>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                            </div>
                        </div>

                        <TabsContent value="signin">
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signin-email">Email</Label>
                                    <Input
                                        id="signin-email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signin-password">Password</Label>
                                    <Input
                                        id="signin-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Creating account...' : 'Create Account'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
