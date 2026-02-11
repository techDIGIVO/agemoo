import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle } from "lucide-react";

const SupportFAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I sign up as a photographer?",
          a: "Click 'Get Started' and fill out the vendor application form with your details, portfolio, and specialties."
        },
        {
          q: "How do I book a photographer?",
          a: "Browse services, select a photographer, check their availability, and click 'Book Now' to complete your booking."
        }
      ]
    },
    {
      category: "Payments & Pricing",
      questions: [
        {
          q: "How does payment work?",
          a: "Payments are processed securely through our platform. Clients pay upfront, and funds are released to photographers after service delivery."
        },
        {
          q: "What are the fees?",
          a: "We charge a small platform fee. View our pricing page for detailed information."
        }
      ]
    },
    {
      category: "Bookings & Cancellations",
      questions: [
        {
          q: "Can I cancel a booking?",
          a: "Yes, cancellations are free up to 48 hours before the scheduled time. See our cancellation policy for details."
        },
        {
          q: "How do I reschedule?",
          a: "Contact your photographer directly through our messaging system to arrange a new date."
        }
      ]
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">Find answers to common questions</p>
          </div>

          <Card className="p-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Card>

          {faqs.map((category, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
              <Accordion type="single" collapsible>
                {category.questions.map((faq, qIdx) => (
                  <AccordionItem key={qIdx} value={`${idx}-${qIdx}`}>
                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                    <AccordionContent>{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SupportFAQ;
