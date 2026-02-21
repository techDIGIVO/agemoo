import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie, Settings, X } from "lucide-react";
import {
  hasConsentBeenGiven,
  saveConsent,
  applyCookies,
  removeNonEssentialCookies,
  type CookieConsent,
} from "@/utils/cookies";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so it doesn't flash on page load
    const timer = setTimeout(() => {
      if (!hasConsentBeenGiven()) {
        setVisible(true);
      } else {
        // Consent already exists — apply cookies silently
        const consent = JSON.parse(
          localStorage.getItem("cookieConsent") || "{}"
        ) as CookieConsent;
        applyCookies(consent);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    const consent: CookieConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      preference: true,
      timestamp: new Date().toISOString(),
    };
    saveConsent(consent);
    applyCookies(consent);
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    const consent: CookieConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      preference: false,
      timestamp: new Date().toISOString(),
    };
    saveConsent(consent);
    removeNonEssentialCookies();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-4xl rounded-xl border bg-background/95 backdrop-blur-md shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Icon */}
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Cookie className="h-5 w-5 text-primary" />
          </div>

          {/* Text */}
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Cookie className="h-4 w-4 sm:hidden text-primary" />
              We use cookies
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies to enhance your browsing experience, analyse site traffic, and personalise
              content. You can manage your preferences at any time.{" "}
              <Link to="/cookies" className="underline underline-offset-2 hover:text-primary">
                Cookie Policy
              </Link>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectNonEssential}
              className="text-xs"
            >
              Essential Only
            </Button>
            <Link to="/cookies">
              <Button variant="outline" size="sm" className="text-xs w-full">
                <Settings className="h-3.5 w-3.5 mr-1" />
                Manage
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="text-xs"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
