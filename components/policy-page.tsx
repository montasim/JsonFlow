"use client";

import {PageLayout, PageHeader, ContentCard, PageSection} from "@/components/layout";
import {Features} from "@/components/features";
import type {LucideIcon} from "lucide-react";

interface PolicySection {
    title: string;
    content: string;
}

interface PolicyPageProps {
    title: string
    description: string,
    features: Array<{
        title: string;
        description: string;
        icon: LucideIcon;
    }>,
    introSection: {
        title: string;
        icon: LucideIcon;
        content: string;
    },
    sections: PolicySection[],
}

export function PolicyPage({
                               title,
                               description,
                               features,
                               introSection,
                               sections,
                           }: PolicyPageProps) {
    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <PageHeader
                    title={title}
                    description={description}
                    gradient
                />

                <Features features={features} cols={2}/>

                <ContentCard>
                    <PageSection title={introSection.title} icon={introSection.icon}>
                        <p>{introSection.content}</p>
                    </PageSection>

                    {sections.map((section) => (
                        <PageSection key={section.title} title={section.title}>
                            <p>{section.content}</p>
                        </PageSection>
                    ))}
                </ContentCard>
            </div>
        </PageLayout>
    );
}
