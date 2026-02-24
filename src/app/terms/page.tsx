import { Scale } from "lucide-react";

export const metadata = {
    title: "Terms of Use | Sark Pharma Tech Services",
    description: "Terms and conditions for using Sark Pharma Tech Services and purchasing SOP documents.",
};

const LAST_UPDATED = "24 February 2026";

export default function TermsOfUsePage() {
    return (
        <div className="max-w-3xl mx-auto pb-16 space-y-10">

            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden p-10 text-center shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80 z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
                <div className="relative z-10 text-primary-foreground space-y-3">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/15 backdrop-blur border border-white/20 mx-auto">
                        <Scale className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Terms of Use</h1>
                    <p className="text-white/70 text-sm">Last updated: {LAST_UPDATED}</p>
                </div>
            </section>

            {/* Body */}
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-8">

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using the Sark Pharma Tech Services platform ("Service"), you agree to be bound by these Terms of Use. If you do not agree, please discontinue use of the Service immediately.</p>
                </section>

                <section>
                    <h2>2. Licence to Use SOP Documents</h2>
                    <p>Upon successful purchase, Sark Pharma Tech Services grants you a <strong>non-exclusive, non-transferable, single-facility licence</strong> to use the purchased Standard Operating Procedure (SOP) document for internal operations at one registered site.</p>
                    <ul>
                        <li>You may customise and adapt the document for your facility.</li>
                        <li>You may <strong>not</strong> resell, redistribute, sublicence, or publicly share the document in its original or modified form.</li>
                        <li>One purchase covers one site. Multi-site use requires bulk licensing — contact us at <a href="mailto:contact@sarkpharmatech.com">contact@sarkpharmatech.com</a>.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Free SOP Library</h2>
                    <p>The written text content available in the SOP Library is provided for <strong>informational and preview purposes only</strong>. It may not be copied, reproduced, or used as the basis of a document submitted for regulatory inspection without first purchasing a licence.</p>
                </section>

                <section>
                    <h2>4. Payments and Refunds</h2>
                    <ul>
                        <li>All payments are processed securely via Razorpay in Indian Rupees (INR).</li>
                        <li>Prices are listed per-document and are subject to change without notice.</li>
                        <li>Due to the digital nature of our products, <strong>refunds are not provided</strong> once a document has been downloaded. If you experience a technical issue preventing download, contact us within 48 hours and we will assist.</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Intellectual Property</h2>
                    <p>All SOP documents, regulatory insights, and platform content are the intellectual property of Sark Pharma Tech Services. Unauthorised reproduction or distribution is prohibited and may result in legal action.</p>
                </section>

                <section>
                    <h2>6. Disclaimer</h2>
                    <p>The documents and insights provided on this platform are intended as <strong>starting-point templates and informational resources</strong>. They do not constitute legal, regulatory, or professional advice. You are solely responsible for ensuring that any SOP or document meets the specific requirements of your regulatory authority and facility.</p>
                    <p>Sark Pharma Tech Services makes no warranties, express or implied, regarding the completeness, accuracy, or fitness for a particular regulatory purpose of any document.</p>
                </section>

                <section>
                    <h2>7. Limitation of Liability</h2>
                    <p>To the fullest extent permitted by law, Sark Pharma Tech Services shall not be liable for any indirect, incidental, or consequential damages arising from your use of or reliance on any document or content obtained through the Service.</p>
                </section>

                <section>
                    <h2>8. Governing Law</h2>
                    <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.</p>
                </section>

                <section>
                    <h2>9. Contact</h2>
                    <p>For questions about these Terms, contact us at <a href="mailto:contact@sarkpharmatech.com">contact@sarkpharmatech.com</a>.</p>
                </section>
            </div>
        </div>
    );
}
