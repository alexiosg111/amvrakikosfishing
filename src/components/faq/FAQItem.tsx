"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItemProps {
  item: {
    id: string;
    question: string;
    answer: string;
  };
}

export function FAQItem({ item }: FAQItemProps) {
  return (
    <AccordionItem value={item.id} className="border-b border-slate-200">
      <AccordionTrigger className="text-left text-slate-900">{item.question}</AccordionTrigger>
      <AccordionContent className="text-slate-600">{item.answer}</AccordionContent>
    </AccordionItem>
  );
}
