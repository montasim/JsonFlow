"use client";

import { PageLayout, PageHeader, InfoCard, PageSection, InfoGrid, ContentCard } from "@/components/layout";
import { Scale, CheckCircle2, Braces, FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <PageHeader
                    title="Terms of Service"
                    description="Simple and transparent terms for using our platform."
                    gradient
                />

                <InfoGrid cols={2}>
                    <InfoCard
                        title="Free to Use"
                        description="Access our JSON formatter completely free of charge. No registration or hidden fees required."
                        icon={CheckCircle2}
                    />
                    <InfoCard
                        title="As-Is Service"
                        description="We provide this tool on an as-is basis. While we strive for perfection, we are not liable for any inaccuracies in JSON formatting or conversion."
                        icon={Scale}
                    />
                </InfoGrid>

                <ContentCard>
                    <PageSection title="Detailed Information" icon={FileText}>
                        <p>
                            By accessing and using JsonFlow, you agree to be bound by these Terms of Service. This ensures a safe and productive environment for all our users.
                        </p>
                    </PageSection>

                    <PageSection title="1. Fair Use Policy">
                        <p>
                            Permission is granted for personal and commercial use of our JSON formatter. However, you may not use our service for any illegal purposes or attempt to disrupt the platform through automated scraping or excessive API usage.
                        </p>
                    </PageSection>

                    <PageSection title="2. Limitation of Liability">
                        <p>
                            In no event shall JsonFlow be liable for any damages arising out of the use or inability to use the materials on our platform, including loss of data or profit. Always verify your JSON data before using it in production environments.
                        </p>
                    </PageSection>

                    <PageSection title="3. Data Accuracy">
                        <p>
                            While we aim to provide accurate JSON formatting and conversion, it is your responsibility to verify the output meets your requirements. We recommend testing with sample data before processing critical JSON.
                        </p>
                    </PageSection>

                    <PageSection title="4. Acceptable Use">
                        <p>
                            You agree not to use JsonFlow to process sensitive, confidential, or personally identifiable information that you do not have the right to share. Although all processing is local, you should exercise caution with sensitive data.
                        </p>
                    </PageSection>

                    <PageSection title="5. Modifications">
                        <p>
                            We reserve the right to modify these terms at any time. Continued use of the service after any such changes shall constitute your consent to such changes.
                        </p>
                    </PageSection>
                </ContentCard>
            </div>
        </PageLayout>
    );
}
