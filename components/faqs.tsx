"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between gap-4 p-5">
        <h4 className="font-medium flex-1">{question}</h4>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </div>
      <div
        ref={contentRef}
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-muted-foreground leading-relaxed p-5 pt-0">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

interface FAQsProps {
  faqs: FAQ[];
  title?: string;
}

export function FAQs({ faqs, title = "Frequently Asked Questions" }: FAQsProps) {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <FAQItem key={`${faq.question}-${index}`} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}
