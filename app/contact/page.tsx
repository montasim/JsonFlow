"use client";

import { PageLayout, PageHeader, ContentCard } from "@/components/layout";
import { Mail, Github, Globe, MessageSquare } from "lucide-react";
import { Features } from "@/components/features";
import { config } from "@/lib/config";

export default function ContactPage() {
    const features = [
        { title: "Open Source", description: "JsonFlow is open source. Feel free to contribute, report issues, or suggest features on GitHub.", icon: Github },
        { title: "Community Driven", description: "Built by developers, for developers. Your feedback helps make JsonFlow better for everyone.", icon: MessageSquare },
    ];

    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <PageHeader
                    title="Get in Touch"
                    description="Have questions about JsonFlow or suggestions for improvement? We'd love to hear from you."
                    gradient
                />

                <Features features={features} cols={2} />

                <ContentCard>
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Email</h3>
                                <p className="text-muted-foreground">
                                    For inquiries, reach out at:{' '}
                                    <a href={`mailto:${config.contactEmail}`} className="text-primary hover:underline">
                                        {config.contactEmail}
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                <Github className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">GitHub</h3>
                                <p className="text-muted-foreground">
                                    Report issues or contribute at:{' '}
                                    <a
                                        href={config.appUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        {config.appUrl.replace("https://github.com/", "")}
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                <Globe className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Global Reach</h3>
                                <p className="text-muted-foreground">
                                    Trusted by developers worldwide for fast, private JSON processing.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border/50 mt-8">
                        <h4 className="font-semibold mb-4 text-sm text-primary uppercase tracking-wider">Quick Links</h4>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { label: "GitHub Repository", href: config.appUrl },
                                { label: "Report an Issue", href: `${config.appUrl}/issues` },
                                { label: "Request a Feature", href: `${config.appUrl}/discussions` },
                            ].map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all text-sm font-medium"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </ContentCard>
            </div>
        </PageLayout>
    );
}
