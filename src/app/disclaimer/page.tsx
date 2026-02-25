import type { Metadata } from 'next';
import { Scale, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Disclaimer | Sark Pharma Tech Services',
    description: 'Important disclaimer regarding the use of SOPs, templates, and educational content provided by Sark Pharma Tech Services.',
};

export default function DisclaimerPage() {
    return (
        <div className="max-w-3xl mx-auto pb-12 space-y-10">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden p-10 text-center shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80 z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
                <div className="relative z-10 text-primary-foreground space-y-3">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/15 backdrop-blur border border-white/20 mx-auto mb-2">
                        <AlertTriangle className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Disclaimer</h1>
                    <p className="text-white/70 text-sm">Last updated: February 2026</p>
                </div>
            </section>

            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2>General Information Only</h2>
                    <p>The content, SOPs, templates, regulatory articles, and training materials provided by <strong>Sark Pharma Tech Services</strong> are intended for general informational and educational purposes only. Nothing on this website constitutes professional regulatory, legal, or medical advice.</p>
                </section>

                <section>
                    <h2>No Guarantee of Compliance</h2>
                    <p>While every effort is made to ensure that documents are accurate, up-to-date, and aligned with current GMP, WHO, FDA, EMA, and ICH guidelines, <strong>Sark Pharma Tech Services does not guarantee</strong> that the use of any template or SOP will result in regulatory approval, audit clearance, or compliance with any specific authority.</p>
                    <p>All documents must be reviewed, validated, and approved by a qualified person within your organisation before implementation. Regulatory requirements vary by country, facility type, product category, and applicable regulatory authority.</p>
                </section>

                <section>
                    <h2>Suitability for Your Organisation</h2>
                    <p>SOPs and templates provided are generic starting points designed to be adapted to your specific facility, processes, and regulatory jurisdiction. <strong>You are solely responsible</strong> for customising, validating, and implementing these documents in accordance with the applicable regulations that govern your operations.</p>
                </section>

                <section>
                    <h2>No Liability</h2>
                    <p>Sark Pharma Tech Services, its founders, employees, and affiliates shall not be held liable for:</p>
                    <ul>
                        <li>Regulatory non-compliance or audit failures resulting from use of our documents</li>
                        <li>Any direct, indirect, incidental, or consequential damages arising from reliance on information published on this website</li>
                        <li>Errors, omissions, or outdated information in any document or article</li>
                    </ul>
                </section>

                <section>
                    <h2>External Links</h2>
                    <p>This website may contain links to external resources, regulatory authority websites, and third-party tools. We are not responsible for the accuracy, legality, or content of external sites.</p>
                </section>

                <section>
                    <h2>Updates to This Disclaimer</h2>
                    <p>We reserve the right to modify this disclaimer at any time. Continued use of the website following any update constitutes your acceptance of the revised disclaimer.</p>
                </section>

                <section>
                    <h2>Contact</h2>
                    <p>Questions regarding this disclaimer? <a href="/about#contact" className="text-primary underline">Contact us</a>.</p>
                </section>
            </div>
        </div>
    );
}
