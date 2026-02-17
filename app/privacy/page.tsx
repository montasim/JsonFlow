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
                { title: "No Data Storage", description: "We do not store, log, or track any of the JSON data you input. Once you close the tab or refresh the page, your data is gone (except for optional localStorage for preferences).", icon: ShieldCheck },
            ]}
            introSection={{
                title: "Detailed Information",
                icon: Eye,
                content: "At JsonFlow, we are committed to providing a secure and private environment for all developers. This policy outlines our limited data collection practices.",
            }}
            sections={[
                { title: "1. Data Collection", content: "We do not collect any personal identification information (PII). We may use anonymous analytics to understand general usage patterns and improve our user experience, but this never includes the JSON data you process." },
                { title: "2. Local Storage", content: "We use browser localStorage to remember your preferences such as theme (dark/light mode) and indentation settings. Your last JSON input may also be stored locally for convenience, but this data never leaves your browser." },
                { title: "3. Cookies", content: "We use minimalist cookies strictly for functional purposes, such as remembering your theme preference or for security measures." },
                { title: "4. Contact Privacy", content: "If you choose to contact us via email, your email address will only be used to respond to your inquiry and will never be shared with third parties." },
                { title: "5. Third-Party Services", content: "We do not use any third-party analytics, tracking, or advertising services. All processing is done client-side using open-source libraries." },
            ]}
        />
    );
}
