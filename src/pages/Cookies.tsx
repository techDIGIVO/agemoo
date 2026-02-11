import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, Settings, Shield, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Cookies = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const saveConsent = async (consents: Record<string, boolean>) => {
    // Save to localStorage
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...consents,
      timestamp: new Date().toISOString()
    }));
    
    // Save to database if user is authenticated
    if (user) {
      try {
        const consentEntries = Object.entries(consents).map(([type, given]) => ({
          user_id: user.id,
          consent_type: type as 'cookie' | 'marketing' | 'analytics' | 'essential',
          consent_given: given
        }));
        
        await supabase.from('user_consents').upsert(consentEntries);
      } catch (error) {
        console.error('Failed to save consent to database:', error);
      }
    } else {
      // For anonymous users, save with session ID
      const sessionId = localStorage.getItem('sessionId') || Math.random().toString(36);
      localStorage.setItem('sessionId', sessionId);
      
      try {
        const consentEntries = Object.entries(consents).map(([type, given]) => ({
          session_id: sessionId,
          consent_type: type as 'cookie' | 'marketing' | 'analytics' | 'essential',
          consent_given: given
        }));
        
        await supabase.from('user_consents').insert(consentEntries);
      } catch (error) {
        console.error('Failed to save consent to database:', error);
      }
    }
    
    // Show success message
    toast({
      title: "Cookie Preferences Saved",
      description: "Your cookie preferences have been updated successfully.",
    });
  };

  useEffect(() => {
    const handleCookieSaved = () => {
      toast({
        title: "Cookie Preferences Saved",
        description: "Your cookie preferences have been updated successfully.",
      });
    };

    window.addEventListener('cookie-saved', handleCookieSaved);
    return () => window.removeEventListener('cookie-saved', handleCookieSaved);
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <Cookie className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">Cookie Policy</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Learn about how we use cookies and similar technologies to enhance your experience on Agemoo.
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
                    <Cookie className="w-6 h-6 text-primary" />
                    <span>What Are Cookies?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Cookies are small text files that are stored on your device when you visit our website. 
                    They help us provide you with a better experience by remembering your preferences and analyzing how you use our platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-6 h-6 text-primary" />
                    <span>Manage Your Cookie Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Essential Cookies</h4>
                        <p className="text-sm text-muted-foreground">Required for basic platform functionality</p>
                        <Badge variant="secondary" className="mt-2">Always Active</Badge>
                      </div>
                      <Switch checked disabled />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Analytics Cookies</h4>
                        <p className="text-sm text-muted-foreground">Help us understand how users interact with our platform</p>
                      </div>
                      <Switch id="analytics" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Marketing Cookies</h4>
                        <p className="text-sm text-muted-foreground">Used to show relevant ads and measure campaign effectiveness</p>
                      </div>
                      <Switch id="marketing" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Preference Cookies</h4>
                        <p className="text-sm text-muted-foreground">Remember your settings and preferences</p>
                      </div>
                      <Switch id="preference" defaultChecked />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t">
                    <Button 
                      onClick={() => {
                        // Get all switch states
                        const analytics = (document.getElementById('analytics') as HTMLInputElement)?.checked;
                        const marketing = (document.getElementById('marketing') as HTMLInputElement)?.checked;
                        const preference = (document.getElementById('preference') as HTMLInputElement)?.checked;
                        
                        saveConsent({
                          essential: true,
                          analytics: analytics || false,
                          marketing: marketing || false,
                          cookie: preference || false
                        });
                      }}
                      className="flex-1"
                    >
                      Save Preferences
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Set all switches to checked
                        ['analytics', 'marketing', 'preference'].forEach(id => {
                          const el = document.getElementById(id) as HTMLInputElement;
                          if (el) el.checked = true;
                        });
                        
                        saveConsent({
                          essential: true,
                          analytics: true,
                          marketing: true,
                          cookie: true
                        });
                      }}
                      className="flex-1"
                    >
                      Accept All
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        // Set all switches to unchecked except essential
                        ['analytics', 'marketing', 'preference'].forEach(id => {
                          const el = document.getElementById(id) as HTMLInputElement;
                          if (el) el.checked = false;
                        });
                        
                        saveConsent({
                          essential: true,
                          analytics: false,
                          marketing: false,
                          cookie: false
                        });
                      }}
                      className="flex-1"
                    >
                      Reject All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-primary" />
                    <span>Managing Your Cookie Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You can control and manage cookies in several ways. Most web browsers automatically accept cookies, 
                    but you can usually modify your browser settings to decline cookies if you prefer.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Browser Settings</h4>
                      <p className="text-sm text-muted-foreground">Configure cookie preferences in your browser settings</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Our Cookie Preferences</h4>
                      <p className="text-sm text-muted-foreground">Use the cookie banner or this page to manage your preferences</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Third-Party Opt-Outs</h4>
                      <p className="text-sm text-muted-foreground">Visit partner websites to opt out of their tracking</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-6 h-6 text-primary" />
                    <span>Third-Party Cookies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    We work with trusted third-party partners to provide enhanced functionality and analytics. 
                    These partners may place their own cookies on your device.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: "Google Analytics", purpose: "Website analytics and performance tracking" },
                      { name: "Stripe", purpose: "Payment processing and fraud prevention" },
                      { name: "Intercom", purpose: "Customer support chat functionality" },
                      { name: "Facebook Pixel", purpose: "Social media advertising and analytics" }
                    ].map((partner, index) => (
                      <div key={index} className="p-3 border rounded">
                        <h4 className="font-medium">{partner.name}</h4>
                        <p className="text-xs text-muted-foreground">{partner.purpose}</p>
                      </div>
                    ))}
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

export default Cookies;