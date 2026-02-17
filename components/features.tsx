import { InfoGrid, InfoCard } from "@/components/layout";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface FeaturesProps {
  title?: string;
  features: Feature[];
  cols?: 1 | 2 | 3 | 4;
}

export function Features({ title, features, cols = 4 }: FeaturesProps) {
  return (
    <div className="">
        {
            title && <h3 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                {title}
            </h3>
        }

      <InfoGrid cols={cols}>
        {features.map(({ title, description, icon: Icon }) => (
          <InfoCard key={title} title={title} description={description} icon={Icon} />
        ))}
      </InfoGrid>
    </div>
  );
}
