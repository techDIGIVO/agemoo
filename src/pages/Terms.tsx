import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, AlertTriangle, Scale } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <Scale className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">Terms of Service</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Please read these terms carefully before using our platform.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-primary" />
                    <span>Platform Usage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>By using BOP 3.0, you agree to use our platform responsibly, maintain accurate information, and comply with all applicable laws.</p>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-6 h-6 text-primary" />
                    <span>User Responsibilities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Users must provide accurate information, respect intellectual property rights, maintain professional conduct, and follow community guidelines.</p>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                    <span>Limitation of Liability</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>BOP 3.0 provides the platform "as is" and limits liability for disputes between users, service quality, or indirect damages.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;