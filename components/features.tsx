import { InfoGrid, InfoCard } from "@/components/layout";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface FeaturesProps {
  features: Feature[];
  cols?: number;
}

export function Features({ features, cols = 4 }: FeaturesProps) {
  return (
    <div className="">
      <h3 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
        Features
      </h3>
      <InfoGrid cols={cols}>
        {features.map(({ title, description, icon: Icon }) => (
          <InfoCard key={title} title={title} description={description} icon={Icon} />
        ))}
      </InfoGrid>
    </div>
  );
}
