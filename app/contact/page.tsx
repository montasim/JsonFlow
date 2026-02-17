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

    const contactMethods = [
        {
            icon: Mail,
            title: "Email",
            description: "For inquiries, reach out at:",
            href: `mailto:${config.contactEmail}`,
            label: config.contactEmail,
        },
        {
            icon: Github,
            title: "GitHub",
            description: "Report issues or contribute at:",
            href: config.appUrl,
            label: config.appUrl.replace("https://github.com/", ""),
            target: "_blank",
            rel: "noopener noreferrer",
        }
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
                        {contactMethods.map(({ icon: Icon, title, description, href, label, target, rel }) => (
                            <div key={title} className="flex gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{title}</h3>
                                    <p className="text-muted-foreground">
                                        {description}{' '}
                                        <a
                                            href={href}
                                            target={target}
                                            rel={rel}
                                            className="text-primary hover:underline"
                                        >
                                            {label}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-border/50 mt-8">
                        <h4 className="font-semibold mb-4 text-sm text-primary uppercase tracking-wider">Quick Links</h4>
                        <div className="flex flex-wrap gap-4">
                            {[
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
