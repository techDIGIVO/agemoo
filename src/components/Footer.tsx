import { Camera, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import NewsletterDialog from "@/components/newsletter/NewsletterDialog";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();
  const [newsletterDialogOpen, setNewsletterDialogOpen] = useState(false);
  
  const footerLinks = {
    [t('footer.platform')]: [
      { name: t('footer.findServices'), href: "/services" },
      { name: t('footer.rentGear'), href: "/gear" },
      { name: t('footer.marketplace'), href: "/marketplace" },
      { name: t('footer.pricing'), href: "/pricing" }
    ],
    [t('footer.resources')]: [
      { name: t('footer.helpCenter'), href: "/help" },
      { name: t('footer.safetyGuidelines'), href: "/safety" },
      { name: t('footer.community'), href: "/community" },
      { name: t('footer.blog'), href: "/blog" }
    ],
    [t('footer.company')]: [
      { name: t('footer.aboutUs'), href: "/about" },
      { name: t('footer.careers'), href: "/careers" },
      { name: t('footer.pressKit'), href: "/press" },
      { name: t('footer.contact'), href: "/contact" }
    ],
    [t('footer.legal')]: [
      { name: t('footer.privacyPolicy'), href: "/privacy" },
      { name: t('footer.termsOfService'), href: "/terms" },
      { name: t('footer.cookiePolicy'), href: "/cookies" },
      { name: t('footer.gdpr'), href: "/gdpr" }
    ]
  };

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/ag-logo-clean.png" 
                alt="AG Logo" 
                className="h-8 w-auto"
              />
              <span className="font-bold text-xl text-gradient">Agemoo</span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {t('footer.description')}
            </p>

            <div className="space-y-4">
              <h4 className="font-semibold">{t('footer.stayUpdated')}</h4>
              <div className="flex space-x-2">
                <Input 
                  placeholder={t('footer.emailPlaceholder')} 
                  className="flex-1"
                  readOnly
                  onClick={() => setNewsletterDialogOpen(true)}
                />
                <Button 
                  className="font-medium"
                  onClick={() => setNewsletterDialogOpen(true)}
                >
                  {t('footer.subscribe')}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{t('footer.globalPlatform')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@bop3.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="font-semibold">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span>{t('footer.digitalEvolutions')}</span>
          </div>
        </div>
      </div>
      
      <NewsletterDialog 
        open={newsletterDialogOpen} 
        onOpenChange={setNewsletterDialogOpen} 
      />
    </footer>
  );
};

export default Footer;