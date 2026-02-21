import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkPasswordStrength } from "@/utils/passwordStrength";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGoogle } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const mode = (searchParams.get("mode") as "signin" | "signup") || "signin";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "",
    name: "", 
    profession: "" 
  });
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  
  const passwordStrength = checkPasswordStrength(signUpForm.password);
  const passwordsMatch = signUpForm.password && signUpForm.confirmPassword && signUpForm.password === signUpForm.confirmPassword;

  const handleTabChange = (value: string) => {
    setSearchParams({ mode: value });
    setShowReset(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInForm.email,
        password: signInForm.password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast({
            variant: "destructive",
            title: "Email not confirmed",
            description: "Please check your email and click the confirmation link to activate your account.",
          });
          return;
        }
        
        if (error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Invalid credentials",
            description: "The email or password you entered is incorrect.",
          });
          return;
        }
        
        if (error.message.includes("User not found")) {
          toast({
            variant: "destructive",
            title: "Account not found",
            description: "No account exists with this email. Please sign up first.",
          });
          handleTabChange("signup");
          return;
        }
        throw error;
      }

      toast({ title: "Success!", description: "You've been signed in successfully." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast({ variant: "destructive", title: "Passwords don't match" });
      return;
    }
    
    if (!acceptedTerms || !acceptedPrivacy) {
      toast({ variant: "destructive", title: "Agreement required", description: "Please accept the Terms and Privacy Policy." });
      return;
    }
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpForm.email,
        password: signUpForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            name: signUpForm.name,
            profession: signUpForm.profession,
          }
        }
      });

      if (error) throw error;

      if (data?.user && !data.session) {
        toast({
          title: "Check your email!",
          description: "We've sent you a confirmation link to complete signup.",
        });
      } else {
        toast({ title: "Account created successfully!", description: "Welcome to Agemoo!" });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sign up failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      toast({ title: "Reset email sent!", description: "Check your email for instructions." });
      setShowReset(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Reset failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ variant: "destructive", title: "SSO failed", description: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-muted/20 py-12">
        <div className="w-full max-w-md space-y-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {showReset ? (
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your email to receive reset instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={isLoading} className="flex-1">Send Reset Link</Button>
                    <Button type="button" variant="outline" onClick={() => setShowReset(false)}>Back</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={mode} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <Card className="shadow-lg border-primary/10">
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input 
                            type="email" 
                            required 
                            className="pl-10"
                            value={signInForm.email}
                            onChange={e => setSignInForm({...signInForm, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            className="pl-10 pr-10"
                            value={signInForm.password}
                            onChange={e => setSignInForm({...signInForm, password: e.target.value})}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-8 w-8"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <Button type="button" variant="link" size="sm" onClick={() => setShowReset(true)} className="p-0 h-auto">Forgot password?</Button>
                      <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                      </div>
                      <Button type="button" variant="outline" className="w-full flex gap-2" onClick={handleGoogleSignIn}><FaGoogle /> Continue with Google</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="signup">
                <Card className="shadow-lg border-primary/10">
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Join our community of creative professionals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input required className="pl-10" value={signUpForm.name} onChange={e => setSignUpForm({...signUpForm, name: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Profession</Label>
                        <Input required placeholder="e.g., Photographer" value={signUpForm.profession} onChange={e => setSignUpForm({...signUpForm, profession: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input type="email" required className="pl-10" value={signUpForm.email} onChange={e => setSignUpForm({...signUpForm, email: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input type={showPassword ? "text" : "password"} required className="pl-10 pr-10" value={signUpForm.password} onChange={e => setSignUpForm({...signUpForm, password: e.target.value})} />
                          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {signUpForm.password && (
                          <div className="space-y-1">
                            <Progress value={passwordStrength.percentage} className="h-1" style={{ backgroundColor: '#e2e8f0', color: passwordStrength.color }} />
                            <p className="text-[10px] text-muted-foreground">Strength: {passwordStrength.label}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm Password</Label>
                        <Input type={showPassword ? "text" : "password"} required value={signUpForm.confirmPassword} onChange={e => setSignUpForm({...signUpForm, confirmPassword: e.target.value})} />
                        {signUpForm.confirmPassword && (
                          <p className={`text-[10px] ${passwordsMatch ? 'text-green-600' : 'text-destructive'}`}>
                            {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(c) => setAcceptedTerms(!!c)} />
                          <Label htmlFor="terms" className="text-xs leading-none">I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link></Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="privacy" checked={acceptedPrivacy} onCheckedChange={(c) => setAcceptedPrivacy(!!c)} />
                          <Label htmlFor="privacy" className="text-xs leading-none">I agree to the <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></Label>
                        </div>
                      </div>
                      <Button className="w-full" type="submit" disabled={isLoading || !acceptedTerms || !acceptedPrivacy}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                      </div>
                      <Button type="button" variant="outline" className="w-full flex gap-2" onClick={handleGoogleSignIn}><FaGoogle /> Continue with Google</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;