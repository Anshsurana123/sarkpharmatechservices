import type { Metadata } from 'next';
import { RefreshCcw } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Refund Policy | Sark Pharma Tech Services',
    description: 'Refund policy for SOP licences and digital documents purchased from Sark Pharma Tech Services.',
};

export default function RefundPolicyPage() {
    return (
        <div className="max-w-3xl mx-auto pb-12 space-y-10">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden p-10 text-center shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80 z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
                <div className="relative z-10 text-primary-foreground space-y-3">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/15 backdrop-blur border border-white/20 mx-auto mb-2">
                        <RefreshCcw className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Refund Policy</h1>
                    <p className="text-white/70 text-sm">Last updated: February 2026</p>
                </div>
            </section>

            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2>Digital Products — No Refund Policy</h2>
                    <p>All purchases made on <strong>Sark Pharma Tech Services</strong> are for <strong>digital products</strong> (SOP licences, templates, document packages, and online courses delivered electronically). Due to the nature of digital goods, <strong>all sales are final and non-refundable</strong> once the document, download link, or course access has been delivered.</p>
                    <p>This policy is in accordance with standard digital goods commerce practices and applicable consumer protection regulations for digital content.</p>
                </section>

                <section>
                    <h2>Exceptions</h2>
                    <p>We will consider a refund or replacement in the following exceptional circumstances:</p>
                    <ul>
                        <li><strong>Technical failure:</strong> If you were charged but did not receive the document, course access, or link within 24 hours of purchase</li>
                        <li><strong>Duplicate charge:</strong> If your payment was processed more than once for the same order</li>
                        <li><strong>Significantly misdescribed product:</strong> If the document or course is materially different from its published description</li>
                    </ul>
                    <p>To request a review, <a href="/about#contact" className="text-primary underline">contact us</a> within <strong>48 hours</strong> of purchase with your payment reference ID.</p>
                </section>

                <section>
                    <h2>Subscription / Bulk Orders</h2>
                    <p>For bulk licensing arrangements or custom SOP packages negotiated directly with our team, refund terms will be specified in the individual service agreement signed at the time of purchase.</p>
                </section>

                <section>
                    <h2>Chargebacks</h2>
                    <p>Initiating a chargeback without first contacting us may result in suspension of access to your account and purchased materials. We encourage customers to reach out directly — we are committed to resolving genuine issues promptly.</p>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>For any payment or refund queries, contact us at:</p>
                    <ul>
                        <li>Contact Form: <a href="/about#contact" className="text-primary underline">Click Here</a></li>
                        <li>Response time: 1–2 business days</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
