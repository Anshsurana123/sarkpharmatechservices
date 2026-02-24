import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock } from "lucide-react";
import Link from "next/link";

interface ArticleCardProps {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    file_url?: string;
}

export function ArticleCard({ id, title, excerpt, date, category, readTime }: ArticleCardProps) {
    return (
        <Link href={`/insights/${id}`} className="block group h-full">
            <Card className="hover:shadow-md hover:border-primary/40 transition-all flex flex-col h-full cursor-pointer">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary dark:bg-primary/10 dark:text-primary hover:bg-secondary/20 dark:hover:bg-primary/20">
                            {category}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {readTime}
                        </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-xs">{date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="text-sm text-foreground/80 line-clamp-3">
                        {excerpt}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}
