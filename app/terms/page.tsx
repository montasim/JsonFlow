"use client";

import { PolicyPage } from "@/components/policy-page";
import { Scale, CheckCircle2, FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <PolicyPage
            title="Terms of Service"
            description="Simple and transparent terms for using our platform."
            features={[
                { title: "Free to Use", description: "Access our JSON formatter completely free of charge. No registration or hidden fees required.", icon: CheckCircle2 },
                { title: "As-Is Service", description: "We provide this tool on an as-is basis. While we strive for perfection, we are not liable for any inaccuracies in JSON formatting or conversion.", icon: Scale },
            ]}
            introSection={{
                title: "Detailed Information",
                icon: FileText,
                content: "By accessing and using JsonFlow, you agree to be bound by these Terms of Service. This ensures a safe and productive environment for all our users.",
            }}
            sections={[
                { title: "1. Fair Use Policy", content: "Permission is granted for personal and commercial use of our JSON formatter. However, you may not use our service for any illegal purposes or attempt to disrupt the platform through automated scraping or excessive API usage." },
                { title: "2. Limitation of Liability", content: "In no event shall JsonFlow be liable for any damages arising out of the use or inability to use the materials on our platform, including loss of data or profit. Always verify your JSON data before using it in production environments." },
                { title: "3. Data Accuracy", content: "While we aim to provide accurate JSON formatting and conversion, it is your responsibility to verify the output meets your requirements. We recommend testing with sample data before processing critical JSON." },
                { title: "4. Acceptable Use", content: "You agree not to use JsonFlow to process sensitive, confidential, or personally identifiable information that you do not have the right to share. Although all processing is local, you should exercise caution with sensitive data." },
                { title: "5. Modifications", content: "We reserve the right to modify these terms at any time. Continued use of the service after any such changes shall constitute your consent to such changes." },
            ]}
        />
    );
}
