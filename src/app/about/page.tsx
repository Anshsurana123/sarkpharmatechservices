
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, BookOpen, FileText, Lightbulb, Mail, Globe, Send, Phone, MessageCircle, Target, Eye, Award } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto pb-12 space-y-12">

            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80 z-0" />
                <div className="absolute top-[-40px] left-[-40px] w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-pulse z-0" />
                <div className="absolute bottom-[-40px] right-[-40px] w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse z-0" style={{ animationDelay: '1.2s' }} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
                <div className="relative z-10 text-primary-foreground space-y-4">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/15 backdrop-blur border border-white/20 mx-auto mb-2">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Sark Pharma Tech Services</h1>
                    <p className="text-lg text-white/75 max-w-2xl mx-auto">
                        Your trusted digital platform for pharmaceutical compliance, SOP management, and regulatory intelligence.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Target className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                    Sark Pharma Tech Services was built to bridge the gap between the complexity of pharmaceutical regulations and the day-to-day operations of quality professionals. We provide structured, editable, and professionally authored Standard Operating Procedures (SOPs) that help pharmaceutical manufacturers, research labs, and regulatory teams stay audit-ready and compliant at all times.
                </p>
                <ul className="space-y-2 text-muted-foreground text-sm">
                    {["Support pharma professionals with ready-to-use GMP-compliant documentation", "Improve GMP compliance across pharmaceutical manufacturing facilities", "Provide ready-to-use, editable SOPs and regulatory templates", "Deliver affordable access to pharmaceutical knowledge for organisations of all sizes"].map(m => (
                        <li key={m} className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />{m}</li>
                    ))}
                </ul>
            </section>

            {/* Vision */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Eye className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                    To become the world&apos;s most trusted and comprehensive pharmaceutical knowledge platform — empowering every GMP facility, from emerging startups to global manufacturers, with the documentation, education, and regulatory intelligence they need to operate at the highest standards of quality.
                </p>
            </section>

            {/* Founder / Leadership */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Award className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Founder &amp; Leadership</h2>
                </div>
                <Card className="border shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b px-6 py-4 flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0 text-2xl font-extrabold">
                            RS
                        </div>
                        <div>
                            <p className="font-bold text-lg">Rupesh Surana</p>
                            <p className="text-muted-foreground text-sm">Founder, Pharmaceutical Quality &amp; Compliance Expert</p>
                        </div>
                    </div>
                    <CardContent className="pt-5 space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            With over a decade of hands-on experience in the pharmaceutical industry, our founder has worked across Quality Assurance, Quality Control, Regulatory Affairs, and Production departments in licensed pharmaceutical manufacturing facilities.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            {[
                                { label: "Experience", value: "17+ Years in Pharma" },
                                { label: "Qualification", value: "M.Pharm / Pharma Sciences" },
                                { label: "Expertise", value: "QA, QC, Regulatory, GMP" },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-muted/30 rounded-xl p-3">
                                    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                                    <p className="font-semibold">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide">Areas of Expertise</p>
                            <div className="flex flex-wrap gap-2">
                                {["QA", "QC", "Regulatory Affairs", "Production", "IT", "SHE", "Pharmacovigilance", "Warehouses", "HR & Admin", "Packaging Development", "Formulation & Dev", "Technology Transfer", "Engineering"].map(area => (
                                    <Badge key={area} variant="secondary" className="text-xs px-2 py-0.5">{area}</Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* What we offer */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">What We Offer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { icon: FileText, title: "SOP Database", desc: "Professionally authored, MS Word-editable SOPs covering QA, QC, Microbiology, Production, Regulatory Affairs, and more." },
                        { icon: BookOpen, title: "SOP Library", desc: "Free access to the written content of our SOPs — browse, read, and understand procedures before purchasing." },
                        { icon: Lightbulb, title: "Regulatory Insights", desc: "Curated articles and expert commentary on FDA, EMA, WHO, and ICH guidelines to keep your team informed." },
                        { icon: ShieldCheck, title: "Compliance-Ready Templates", desc: "All documents are structured to meet GMP, GLP, GDP, and cGMP requirements, ready to be customised for your facility." },
                    ].map(({ icon: Icon, title, desc }) => (
                        <Card key={title} className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-5 flex gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold mb-1">{title}</p>
                                    <p className="text-sm text-muted-foreground">{desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Industries */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Industries We Serve</h2>
                <div className="flex flex-wrap gap-2">
                    {["Pharmaceutical Manufacturing", "Biotechnology", "Medical Devices", "Research & Development", "Clinical Laboratories", "Contract Research Organisations", "Nutraceuticals", "Veterinary Pharma"].map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm bg-muted text-foreground hover:bg-muted/80">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section className="rounded-2xl border bg-card overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b px-8 py-5">
                    <h2 className="text-2xl font-bold tracking-tight">Get in Touch</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Custom SOP requirements, bulk licensing enquiries, or general questions — we&apos;re here to help.
                    </p>
                </div>
                <div className="p-8 grid md:grid-cols-2 gap-8">
                    {/* Contact form — powered by Formspree */}
                    <form
                        action="https://formspree.io/f/xvzbdgdk"
                        method="POST"
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                <input id="name" name="name" required placeholder="Dr. Jane Smith" className="w-full px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <input id="email" name="email" type="email" required placeholder="jane@pharma.com" className="w-full px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="type" className="text-sm font-medium">Enquiry Type</label>
                            <select id="type" name="enquiry_type" className="w-full px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                                <option>Custom SOP Request</option>
                                <option>Bulk Licensing</option>
                                <option>Technical Support</option>
                                <option>Partnership</option>
                                <option>General Enquiry</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <textarea id="message" name="message" required rows={4} placeholder="Tell us about your requirement..." className="w-full px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                        </div>
                        <Button type="submit" className="w-full gap-2 rounded-lg">
                            <Send className="h-4 w-4" /> Send Message
                        </Button>
                    </form>

                    {/* Contact details */}
                    <div className="space-y-4 flex flex-col justify-center">
                        <div>
                            <p className="font-semibold text-sm mb-1">Email Us</p>
                            <a href="mailto:contact@sarkpharmatech.com" className="flex items-center gap-2 text-primary hover:underline text-sm">
                                <Mail className="h-4 w-4" /> contact@sarkpharmatech.com
                            </a>
                        </div>
                        <div>
                            <p className="font-semibold text-sm mb-1">Call Us</p>
                            <a href="tel:+917350185431" className="flex items-center gap-2 text-primary hover:underline text-sm">
                                <Phone className="h-4 w-4" /> +91 73501 85431
                            </a>
                        </div>
                        <div>
                            <p className="font-semibold text-sm mb-1">WhatsApp</p>
                            <a href="https://wa.me/917350185431" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:underline text-sm">
                                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                            </a>
                        </div>
                        <div>
                            <p className="font-semibold text-sm mb-1">Location</p>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Globe className="h-4 w-4" /> Maharashtra, India
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-sm mb-1">Website</p>
                            <a href="https://sarkpharmatechservices.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline text-sm">
                                <Globe className="h-4 w-4" /> sarkpharmatechservices.vercel.app
                            </a>
                        </div>
                        <div className="rounded-xl bg-muted/40 border p-4 text-sm text-muted-foreground">
                            <p className="font-medium text-foreground mb-1">Response Time</p>
                            We typically respond within <strong>1–2 business days</strong>. For urgent SOP requests, please mention &quot;URGENT&quot; in your subject line.
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
