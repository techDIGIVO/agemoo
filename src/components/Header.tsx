import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Camera, Briefcase, ShoppingCart, User, Menu, X, BarChart3, Home, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ProfileDialog } from "@/components/profile/ProfileDialog";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

const Header = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation(); //
  const [isOpen, setIsOpen] = useState(false);
  const [authDialog, setAuthDialog] = useState<{ isOpen: boolean; defaultTab: "signin" | "signup" }>({
    isOpen: false,
    defaultTab: "signin"
  });
  const [profileDialog, setProfileDialog] = useState(false);

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setAuthDialog({ isOpen: true, defaultTab: "signin" });
    }
  };

  const handleProfileClick = () => {
    setProfileDialog(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navigation = [
    { name: t('nav.home'), href: "/", icon: Home },
    { name: t('nav.findServices'), href: "/services", icon: Briefcase },
    { name: t('nav.rentGear'), href: "/gear", icon: Camera },
    { name: t('nav.marketplace'), href: "/marketplace", icon: ShoppingCart },
    ...(user ? [{ name: t('nav.dashboard'), href: "/dashboard", icon: BarChart3 }] : []),
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/ag-logo-clean.png"
            alt="AG Logo"
            className="h-8 w-auto"
          />
          <span className="font-bold text-xl text-foreground">Agemoo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-2 transition-smooth ${isActive(item.href)
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-primary font-medium"
                }`}
              onClick={item.href === "/dashboard" ? handleDashboardClick : undefined}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          {user ? (
            <>
              <Button
                variant="ghost"
                className="font-medium"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('nav.signOut')}
              </Button>
              <Button
                className="font-medium shadow-soft"
                onClick={handleProfileClick}
              >
                <User className="w-4 h-4 mr-2" />
                {t('nav.profile')}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="font-medium"
                onClick={() => navigate("/auth?mode=signin")}
              >
                {t('nav.signIn')}
              </Button>

              <Button
                className="font-medium shadow-soft"
                onClick={() => navigate("/auth?mode=signup")}
              >
                {t('nav.getStarted')}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-6 mt-6">
              <div className="pb-4 border-b">
                <LanguageSelector />
              </div>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 text-lg transition-smooth ${isActive(item.href)
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-primary font-medium"
                    }`}
                  onClick={(e) => {
                    setIsOpen(false);
                    if (item.href === "/dashboard") handleDashboardClick(e);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-6 border-t flex flex-col space-y-3">
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start font-medium"
                      onClick={() => {
                        setIsOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                    <Button
                      className="justify-start font-medium shadow-soft"
                      onClick={() => {
                        setIsOpen(false);
                        handleProfileClick();
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('nav.profile')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start font-medium"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/auth?mode=signin");
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>

                    <Button
                      className="justify-start font-medium shadow-soft"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/auth?mode=signup");
                      }}
                    >
                      Get Started
                    </Button>

                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <AuthDialog
        isOpen={authDialog.isOpen}
        onClose={() => setAuthDialog(prev => ({ ...prev, isOpen: false }))}
        defaultTab={authDialog.defaultTab}
      />

      <ProfileDialog
        isOpen={profileDialog}
        onClose={() => setProfileDialog(false)}
      />
    </header>
  );
};

export default Header;