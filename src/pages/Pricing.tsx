import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for photographers just starting out",
      features: [
        "Create basic profile",
        "List up to 3 services",
        "Accept up to 5 bookings/month",
        "Basic calendar integration",
        "Email support",
        "Access to community"
      ],
      limitations: [
        "Limited portfolio uploads",
        "No priority support",
        "Standard listing visibility"
      ],
      popular: false,
      buttonText: "Get Started"
    },
    {
      name: "Professional",
      price: "₦15,000",
      period: "/month",
      description: "For growing photography businesses",
      features: [
        "Unlimited services listings",
        "Unlimited bookings",
        "Advanced portfolio showcase",
        "Priority customer support",
        "Analytics dashboard",
        "Calendar sync with Google/Outlook",
        "Custom booking forms",
        "Client review management",
        "Enhanced profile visibility"
      ],
      limitations: [],
      popular: true,
      buttonText: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "₦35,000",
      period: "/month",
      description: "For established studios and agencies",
      features: [
        "Everything in Professional",
        "Team collaboration tools",
        "White-label solutions",
        "Advanced analytics & reporting",
        "Priority listing placement",
        "Dedicated account manager",
        "Custom integrations",
        "Bulk invoice generation",
        "Advanced client management",
        "API access"
      ],
      limitations: [],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you'll be billed prorated amounts."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, bank transfers, and mobile money payments popular in Africa including M-Pesa, MTN Mobile Money, and Airtel Money."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees! You only pay the monthly subscription cost. We believe in transparent pricing with no hidden charges."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee for annual plans. Monthly plans can be cancelled anytime with no additional charges."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data remains accessible for 90 days after cancellation. You can export your portfolio, client information, and booking history during this period."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                Simple Pricing
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Choose the Perfect Plan for Your
                <span className="text-gradient"> Photography Business</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Start free and scale as you grow. No hidden fees, no surprises.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  30-day free trial
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  No setup fees
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Cancel anytime
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative p-8 ${plan.popular ? 'ring-2 ring-primary shadow-elegant' : 'shadow-soft'} hover:shadow-medium transition-smooth`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <Button 
                      className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => {
                        if (plan.buttonText === "Get Started") {
                          navigate("/?signup=starter");
                        } else if (plan.buttonText === "Start Free Trial") {
                          navigate("/?signup=professional&trial=true");
                        } else if (plan.buttonText === "Contact Sales") {
                          navigate("/contact?subject=enterprise");
                        } else if (plan.buttonText === "Schedule Demo") {
                          navigate("/contact?demo=enterprise");
                        }
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Check className="w-4 h-4 text-green-600 mr-2" />
                        What's included:
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center text-muted-foreground">
                          <X className="w-4 h-4 text-muted-foreground mr-2" />
                          Limitations:
                        </h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <li key={limitIndex} className="flex items-start">
                              <X className="w-4 h-4 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Compare All Features</h2>
              <p className="text-xl text-muted-foreground">
                See exactly what you get with each plan
              </p>
            </div>

            <div className="max-w-5xl mx-auto overflow-x-auto">
              <div className="min-w-full bg-background rounded-lg shadow-soft">
                <div className="grid grid-cols-4 gap-4 p-6 border-b">
                  <div className="font-semibold">Features</div>
                  <div className="text-center font-semibold">Starter</div>
                  <div className="text-center font-semibold">Professional</div>
                  <div className="text-center font-semibold">Enterprise</div>
                </div>
                
                {[
                  ["Profile Creation", true, true, true],
                  ["Service Listings", "3", "Unlimited", "Unlimited"],
                  ["Monthly Bookings", "5", "Unlimited", "Unlimited"],
                  ["Portfolio Photos", "10", "Unlimited", "Unlimited"],
                  ["Customer Support", "Email", "Priority", "Dedicated Manager"],
                  ["Analytics Dashboard", false, true, true],
                  ["Team Collaboration", false, false, true],
                  ["API Access", false, false, true],
                  ["White-label Options", false, false, true]
                ].map(([feature, starter, professional, enterprise], index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0">
                    <div className="font-medium">{feature}</div>
                    <div className="text-center">
                      {typeof starter === 'boolean' ? (
                        starter ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : starter}
                    </div>
                    <div className="text-center">
                      {typeof professional === 'boolean' ? (
                        professional ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : professional}
                    </div>
                    <div className="text-center">
                      {typeof enterprise === 'boolean' ? (
                        enterprise ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : enterprise}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/contact")}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Grow Your Photography Business?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of photographers already using Agemoo to build successful businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" onClick={() => navigate("/?signup=professional&trial=true")}>
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate("/contact?subject=demo")}>
                  Schedule Demo
                </Button>
              </div>
              <div className="flex items-center justify-center mt-8 space-x-2">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-muted-foreground">4.9/5 from 2,000+ photographers</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;