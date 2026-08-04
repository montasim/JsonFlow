"use client";

import { PolicyPage } from "@/components/policy-page";
import { ShieldCheck, Lock, Eye } from "lucide-react";

export default function PrivacyPage() {
    return (
        <PolicyPage
            title="Privacy Policy"
            description="Your privacy is our top priority. Learn how we handle your data."
            features={[
                { title: "Local Processing", description: "All JSON formatting, validation, and conversion happens locally in your browser using JavaScript. Your JSON data never leaves your device and is never sent to our servers.", icon: Lock },
                { title: "Browser-Only Storage", description: "JsonFlow does not send JSON to an application API. Your theme, indentation, and recent formatter or comparison input can remain in this browser through localStorage.", icon: ShieldCheck },
            ]}
            introSection={{
                title: "Detailed Information",
                icon: Eye,
                content: "At JsonFlow, we are committed to providing a secure and private environment for all developers. This policy outlines our limited data collection practices.",
            }}
            sections={[
                { title: "1. Data Collection", content: "We do not collect any personal identification information (PII). We may use anonymous analytics to understand general usage patterns and improve our user experience, but this never includes the JSON data you process." },
                { title: "2. Local Storage", content: "We use browser localStorage to remember your theme, indentation, recent formatter input, comparison documents, and comparison options. Clear the editors or your browser site data to remove those saved values." },
                { title: "3. Cookies", content: "The application does not set its own cookies for formatting or comparison. The hosting platform, browser extensions, or future integrations remain outside this application-level guarantee." },
                { title: "4. Contact Privacy", content: "If you choose to contact us via email, your email address will only be used to respond to your inquiry and will never be shared with third parties." },
                { title: "5. Third-Party Services", content: "We do not use any third-party analytics, tracking, or advertising services. All processing is done client-side using open-source libraries." },
            ]}
        />
    );
}
