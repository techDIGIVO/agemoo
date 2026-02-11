import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { AuthDialog } from "@/components/auth/AuthDialog";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signup");

  useEffect(() => {
    // Check for signup URL parameters
    const signup = searchParams.get('signup');
    const trial = searchParams.get('trial');
    
    if (signup) {
      setAuthTab("signup");
      setAuthDialogOpen(true);
      // Clean up URL parameters
      searchParams.delete('signup');
      searchParams.delete('trial');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
      
      <AuthDialog
        isOpen={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        defaultTab={authTab}
      />
    </div>
  );
};

export default Index;
