import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, UserCheck } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-muted-foreground">Last updated: January 2024</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-6 h-6 text-primary" />
                    <span>Information We Collect</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>We collect information you provide directly, such as account details, profile information, and communications. We also collect usage data, device information, and location data to improve our services.</p>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-6 h-6 text-primary" />
                    <span>How We Use Your Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>We use your information to provide services, process payments, communicate with you, improve our platform, and ensure safety and security.</p>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="w-6 h-6 text-primary" />
                    <span>Your Rights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>You have rights to access, update, delete, and port your data. You can also control communications and opt out of certain data processing.</p>
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

export default Privacy;