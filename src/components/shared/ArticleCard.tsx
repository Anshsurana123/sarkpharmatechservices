import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface ArticleCardProps {
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
}

export function ArticleCard({ title, excerpt, date, category, readTime }: ArticleCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
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
            <CardContent>
                <p className="text-sm text-foreground/80 line-clamp-3">
                    {excerpt}
                </p>
            </CardContent>
        </Card>
    );
}
