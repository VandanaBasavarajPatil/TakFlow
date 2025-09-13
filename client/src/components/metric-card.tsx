import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendColor?: string;
}

export default function MetricCard({ title, value, icon: Icon, trend, trendColor }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          {trend && (
            <span className={`text-sm font-medium ${trendColor}`}>
              {trend}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-1">
          {value}
        </h3>
        <p className="text-sm text-muted-foreground">
          {title}
        </p>
      </CardContent>
    </Card>
  );
}
