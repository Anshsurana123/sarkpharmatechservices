import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { articles } from "@/data/mockData";
import { ArticleCard } from "@/components/shared/ArticleCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-10">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-primary/80 z-0"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary mb-4 px-4 py-1 text-sm border-none shadow-sm">
            v2.0 Beta Now Live
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            The Total Pharmaceutical Solution
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-medium">
            Streamline your quality management, track regulatory updates, and ensure compliance with our modern, AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 rounded-full shadow-md" asChild>
              <Link href="/sops" className="flex items-center">
                Browse SOPs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card text-card-foreground rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart SOP Database</h3>
          <p className="text-muted-foreground">Access all department SOPs instantly. Filter by department and document type with blazing speed.</p>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 text-secondary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Regulatory Updates</h3>
          <p className="text-muted-foreground">Stay compliant with automated FDA and EMA guideline updates pushed directly to your feed.</p>
        </div>
      </section>

      {/* Recent Updates Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Insights</h2>
          <Button variant="ghost" className="text-primary hover:text-primary/90" asChild><Link href="#">View all</Link></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Importing Badge for the hero section
import { Badge } from "@/components/ui/badge";
