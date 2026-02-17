"use client";

import { PageLayout, PageHeader, InfoCard, PageSection, InfoGrid, ContentCard } from "@/components/layout";
import { ShieldCheck, Lock, Eye, Braces } from "lucide-react";

export default function PrivacyPage() {
    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <PageHeader
                    title="Privacy Policy"
                    description="Your privacy is our top priority. Learn how we handle your data."
                    gradient
                />

                <InfoGrid cols={2}>
                    <InfoCard
                        title="Local Processing"
                        description="All JSON formatting, validation, and conversion happens locally in your browser using JavaScript. Your JSON data never leaves your device and is never sent to our servers."
                        icon={Lock}
                    />
                    <InfoCard
                        title="No Data Storage"
                        description="We do not store, log, or track any of the JSON data you input. Once you close the tab or refresh the page, your data is gone (except for optional localStorage for preferences)."
                        icon={ShieldCheck}
                    />
                </InfoGrid>

                <ContentCard>
                    <PageSection title="Detailed Information" icon={Eye}>
                        <p>
                            At JsonFlow, we are committed to providing a secure and private environment for all developers. This policy outlines our limited data collection practices.
                        </p>
                    </PageSection>

                    <PageSection title="1. Data Collection">
                        <p>
                            We do not collect any personal identification information (PII). We may use anonymous analytics to understand general usage patterns and improve our user experience, but this never includes the JSON data you process.
                        </p>
                    </PageSection>

                    <PageSection title="2. Local Storage">
                        <p>
                            We use browser localStorage to remember your preferences such as theme (dark/light mode) and indentation settings. Your last JSON input may also be stored locally for convenience, but this data never leaves your browser.
                        </p>
                    </PageSection>

                    <PageSection title="3. Cookies">
                        <p>
                            We use minimalist cookies strictly for functional purposes, such as remembering your theme preference or for security measures.
                        </p>
                    </PageSection>

                    <PageSection title="4. Contact Privacy">
                        <p>
                            If you choose to contact us via email, your email address will only be used to respond to your inquiry and will never be shared with third parties.
                        </p>
                    </PageSection>

                    <PageSection title="5. Third-Party Services">
                        <p>
                            We do not use any third-party analytics, tracking, or advertising services. All processing is done client-side using open-source libraries.
                        </p>
                    </PageSection>
                </ContentCard>
            </div>
        </PageLayout>
    );
}
