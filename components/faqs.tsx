interface FAQ {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-5">
      <h4 className="font-semibold mb-2 text-primary">{question}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
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
        {faqs.map(({ question, answer }) => (
          <FAQItem key={question} question={question} answer={answer} />
        ))}
      </div>
    </div>
  );
}
