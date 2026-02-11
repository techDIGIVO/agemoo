import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Download, Mail, Trash2, Eye, Lock, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const GDPR = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDataExport = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to export your data.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Export requested",
      description: "Your data export will be sent to your email within 24 hours.",
    });
  };

  const handleDeleteAccount = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete your account.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Deletion requested",
      description: "Your account deletion request has been submitted. We'll contact you within 48 hours.",
    });
  };

  const handleUpdateProfile = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update your profile.",
        variant: "destructive"
      });
      return;
    }
    navigate("/dashboard/profile");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">GDPR Compliance</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your data protection rights under the General Data Protection Regulation (GDPR).
            </p>
            <Badge className="text-lg px-4 py-2">EU Data Protection Compliant</Badge>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="w-6 h-6 text-primary" />
                    <span>Your GDPR Rights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    Under GDPR, you have specific rights regarding your personal data. We are committed to ensuring you can exercise these rights easily.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Right to Access",
                        description: "Request copies of your personal data",
                        icon: Eye,
                        action: "Request Data Export"
                      },
                      {
                        title: "Right to Rectification",
                        description: "Correct inaccurate personal data",
                        icon: UserCheck,
                        action: "Update Profile"
                      },
                      {
                        title: "Right to Erasure",
                        description: "Request deletion of your data",
                        icon: Trash2,
                        action: "Delete Account"
                      },
                      {
                        title: "Right to Portability",
                        description: "Transfer your data to another service",
                        icon: Download,
                        action: "Export Data"
                      }
                    ].map((right, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <right.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{right.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{right.description}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                if (right.action === "Request Data Export" || right.action === "Export Data") {
                                  handleDataExport();
                                } else if (right.action === "Delete Account") {
                                  handleDeleteAccount();
                                } else if (right.action === "Update Profile") {
                                  handleUpdateProfile();
                                }
                              }}
                            >
                              {right.action}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-6 h-6 text-primary" />
                    <span>How We Process Your Data</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Legal Basis for Processing</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { basis: "Consent", example: "Marketing communications, optional features" },
                          { basis: "Contract", example: "Providing services, payment processing" },
                          { basis: "Legitimate Interest", example: "Platform security, fraud prevention" },
                          { basis: "Legal Obligation", example: "Tax reporting, regulatory compliance" }
                        ].map((item, index) => (
                          <div key={index} className="p-3 border rounded">
                            <h5 className="font-medium">{item.basis}</h5>
                            <p className="text-xs text-muted-foreground">{item.example}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Data Retention</h4>
                      <p className="text-muted-foreground text-sm">
                        We retain personal data only as long as necessary for the purposes outlined in our Privacy Policy. 
                        Account data is typically retained for 7 years after account closure for legal and business purposes.
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">International Transfers</h4>
                      <p className="text-muted-foreground text-sm">
                        When we transfer data outside the EU, we ensure appropriate safeguards are in place, 
                        including Standard Contractual Clauses and adequacy decisions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-6 h-6 text-primary" />
                    <span>Data Protection Officer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    For questions about data processing or to exercise your GDPR rights, contact our Data Protection Officer:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>dpo@bop3.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span>BOP 3.0 Data Protection Team</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground">
                    Response time: We will respond to your request within 30 days as required by GDPR.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle>Exercise Your Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Use the options below to exercise your GDPR rights. We may need to verify your identity before processing your request.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button className="w-full" onClick={handleDataExport}>
                      <Download className="w-4 h-4 mr-2" />
                      Request Data Export
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/privacy')}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Data Processing
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleUpdateProfile}>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Update Preferences
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8 bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Supervisory Authority</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 text-sm mb-4">
                    If you believe we have not addressed your concerns adequately, you have the right to lodge a complaint 
                    with your local data protection supervisory authority.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-blue-800">EU Residents:</p>
                    <p className="text-blue-700">Contact your national data protection authority</p>
                    <p className="font-medium text-blue-800">UK Residents:</p>
                    <p className="text-blue-700">Information Commissioner's Office (ICO)</p>
                  </div>
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

export default GDPR;