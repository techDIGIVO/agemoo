import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <Briefcase className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">Careers at Agemoo</h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              We're building the future of photography in Africa. When we have open positions, they'll be listed here.
            </p>
          </div>
        </section>

        {/* No Openings */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto text-center">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-3">No Open Positions</h2>
                <p className="text-muted-foreground mb-6">
                  We don't have any career openings at the moment. Check back later or follow us on social media to be the first to know when new roles become available.
                </p>
                <p className="text-sm text-muted-foreground">
                  Interested in working with us? Send your CV to{" "}
                  <a href="mailto:careers@agemoo.com" className="text-primary hover:underline">
                    careers@agemoo.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
