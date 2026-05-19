"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  q: string;
  a: string;
}

export default function DetailFaq({ items }: { items: FaqItem[] }) {
  return (
    <Accordion multiple={false} className="space-y-0">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`faq-${i}`}
          className="border-b border-foreground/10"
        >
          <AccordionTrigger className="text-left text-lg font-medium py-6 hover:no-underline hover:translate-x-2 transition-all duration-300 hover:text-[#800020]">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
