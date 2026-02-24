import { ShieldCheck } from "lucide-react";

export const metadata = {
    title: "Privacy Policy | Sark Pharma Tech Services",
    description: "Privacy Policy for Sark Pharma Tech Services — how we collect, use, and protect your data.",
};

const LAST_UPDATED = "24 February 2026";

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-3xl mx-auto pb-16 space-y-10">

            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden p-10 text-center shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80 z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
                <div className="relative z-10 text-primary-foreground space-y-3">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/15 backdrop-blur border border-white/20 mx-auto">
                        <ShieldCheck className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
                    <p className="text-white/70 text-sm">Last updated: {LAST_UPDATED}</p>
                </div>
            </section>

            {/* Body */}
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-8">

                <section>
                    <h2>1. Information We Collect</h2>
                    <p>When you visit Sark Pharma Tech Services, we may collect the following information:</p>
                    <ul>
                        <li><strong>Contact form data</strong> — name, email address, and message content submitted via our contact form (processed by Formspree).</li>
                        <li><strong>Usage data</strong> — pages visited, time spent, browser type, and referring URL, collected via Vercel Analytics.</li>
                        <li><strong>Payment data</strong> — order amounts and currency for SOP and Course purchases, processed securely by Razorpay. We do not store card or UPI details.</li>
                        <li><strong>Authentication data</strong> — email address and provider details when you sign in via Google or LinkedIn (managed by Supabase Auth).</li>
                    </ul>
                </section>

                <section>
                    <h2>2. How We Use Your Information</h2>
                    <ul>
                        <li>To respond to enquiries submitted through the contact form.</li>
                        <li>To process purchase orders and deliver licensed documents or course access.</li>
                        <li>To improve the platform through anonymised usage analytics.</li>
                        <li>To authenticate users and maintain secure sessions.</li>
                    </ul>
                    <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
                </section>

                <section>
                    <h2>3. Cookies</h2>
                    <p>We use a minimal number of cookies to:</p>
                    <ul>
                        <li>Store your cookie consent preference in <code>localStorage</code>.</li>
                        <li>Maintain authentication sessions (Supabase session cookies).</li>
                        <li>Collect anonymised page-view analytics (Vercel Analytics — no personally identifiable cookies).</li>
                    </ul>
                    <p>You can decline cookies using the banner displayed on your first visit. Note that declining may affect authentication functionality.</p>
                </section>

                <section>
                    <h2>4. Third-Party Services</h2>
                    <p>We use the following third-party services which have their own privacy policies:</p>
                    <ul>
                        <li><strong>Supabase</strong> — database and authentication (supabase.com)</li>
                        <li><strong>Razorpay</strong> — payment processing (razorpay.com)</li>
                        <li><strong>Formspree</strong> — contact form submission (formspree.io)</li>
                        <li><strong>Vercel</strong> — hosting and analytics (vercel.com)</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Data Retention</h2>
                    <p>We retain contact form submissions and purchase records for up to 3 years for business correspondence purposes. User authentication data is retained while your account is active. You may request deletion at any time by emailing <a href="mailto:contact@sarkpharmatech.com">contact@sarkpharmatech.com</a>.</p>
                </section>

                <section>
                    <h2>6. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Request access to the personal data we hold about you.</li>
                        <li>Request correction or deletion of your data.</li>
                        <li>Withdraw consent at any time.</li>
                    </ul>
                    <p>To exercise these rights, contact us at <a href="mailto:contact@sarkpharmatech.com">contact@sarkpharmatech.com</a>.</p>
                </section>

                <section>
                    <h2>7. Contact</h2>
                    <p>For any privacy-related queries, please email <a href="mailto:contact@sarkpharmatech.com">contact@sarkpharmatech.com</a>.</p>
                </section>
            </div>
        </div>
    );
}
