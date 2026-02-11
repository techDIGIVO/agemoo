import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, MapPin, Clock, DollarSign, Users, TrendingUp, 
  Heart, Coffee, Laptop, Globe, Star, ArrowRight 
} from "lucide-react";

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Lagos, Nigeria / Remote",
      type: "Full-time",
      experience: "5-7 years",
      salary: "₦8,000,000 - ₦12,000,000",
      description: "Join our engineering team to build the future of photography platform technology.",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
      posted: "2 days ago"
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₦6,000,000 - ₦9,000,000",
      description: "Create beautiful, intuitive experiences for photographers and clients worldwide.",
      skills: ["Figma", "UI/UX", "Design Systems", "User Research", "Prototyping"],
      posted: "5 days ago"
    },
    {
      title: "Photography Community Manager",
      department: "Community",
      location: "Lagos, Nigeria",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₦4,500,000 - ₦6,500,000",
      description: "Build and nurture our growing community of photographers across Nigeria.",
      skills: ["Community Building", "Social Media", "Photography", "Content Creation"],
      posted: "1 week ago"
    },
    {
      title: "Sales Development Representative",
      department: "Sales",
      location: "Abuja, Nigeria / Remote",
      type: "Full-time",
      experience: "1-3 years",
      salary: "₦3,000,000 - ₦5,000,000",
      description: "Drive growth by connecting with photographers and helping them succeed on our platform.",
      skills: ["Sales", "CRM", "Communication", "Photography Knowledge"],
      posted: "3 days ago"
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "4-6 years",
      salary: "₦7,000,000 - ₦10,000,000",
      description: "Scale our infrastructure to support millions of photographers and clients.",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Monitoring"],
      posted: "1 week ago"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Lagos, Nigeria / Remote",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₦5,000,000 - ₦7,500,000",
      description: "Ensure our photographers and clients have amazing experiences on our platform.",
      skills: ["Customer Success", "Analytics", "Communication", "Problem Solving"],
      posted: "4 days ago"
    }
  ];

  const benefits = [
    {
      title: "Competitive Salary",
      description: "Market-leading compensation packages with annual reviews",
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health insurance for you and your family",
      icon: Heart,
      color: "bg-red-500"
    },
    {
      title: "Remote Flexibility",
      description: "Work from anywhere with flexible hours and remote-first culture",
      icon: Globe,
      color: "bg-blue-500"
    },
    {
      title: "Learning Budget",
      description: "₦500,000 annual budget for courses, conferences, and books",
      icon: TrendingUp,
      color: "bg-purple-500"
    },
    {
      title: "Equipment Allowance",
      description: "Latest MacBook and equipment setup for optimal productivity",
      icon: Laptop,
      color: "bg-gray-500"
    },
    {
      title: "Team Retreats",
      description: "Annual company retreats and quarterly team building events",
      icon: Coffee,
      color: "bg-orange-500"
    }
  ];

  const companyValues = [
    {
      title: "Creativity First",
      description: "We believe in empowering creative expression and innovation in everything we do."
    },
    {
      title: "Community Driven",
      description: "Our decisions are guided by what's best for our photography community."
    },
    {
      title: "Excellence in Craft",
      description: "We strive for exceptional quality in our products and services."
    },
    {
      title: "Inclusive Growth",
      description: "We create opportunities for everyone to learn, grow, and succeed."
    }
  ];

  const stats = [
    { label: "Team Members", value: "47", icon: Users },
    { label: "Countries", value: "8", icon: Globe },
    { label: "Years of Growth", value: "3", icon: TrendingUp },
    { label: "Employee Rating", value: "4.8", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <Briefcase className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              Join Our Mission
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Help us build the future of photography in Africa. We're looking for passionate 
              individuals who want to empower creative professionals worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                View Open Positions
              </Button>
              <Button variant="outline" size="lg">
                Learn About Culture
              </Button>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at BOP 3.0
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {companyValues.map((value, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We invest in our team members' success with comprehensive benefits and growth opportunities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${benefit.color}`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join our team and help build the future of photography
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {openPositions.map((position, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold">{position.title}</h3>
                        <Badge>{position.department}</Badge>
                        <Badge variant="outline">{position.type}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{position.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {position.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {position.salary}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {position.experience}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          Posted {position.posted}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {position.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Button>
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Hiring Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We've designed a fair and transparent process to find the best talent
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: "1", title: "Application", description: "Submit your application and portfolio through our careers page" },
                  { step: "2", title: "Screening", description: "Initial review and phone/video screening with our talent team" },
                  { step: "3", title: "Interviews", description: "Technical and cultural fit interviews with team members" },
                  { step: "4", title: "Offer", description: "Final decision and offer with detailed compensation package" }
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Team Says</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from our team members about their experience working at BOP 3.0
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah Adebayo",
                  role: "Senior Developer",
                  quote: "Working at BOP 3.0 has been incredible. The team is supportive, the work is challenging, and we're making a real impact on the photography community.",
                  avatar: "SA"
                },
                {
                  name: "Michael Chen",
                  role: "Product Designer",
                  quote: "The creative freedom and collaborative environment here allows me to do my best work. Plus, the remote flexibility is amazing.",
                  avatar: "MC"
                },
                {
                  name: "Kemi Okafor",
                  role: "Community Manager",
                  quote: "Being able to directly impact photographers' lives and help them grow their businesses makes every day meaningful and rewarding.",
                  avatar: "KO"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <Separator className="mb-4" />
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't see a position that fits? We're always looking for exceptional talent. 
              Send us your resume and let us know how you'd like to contribute.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                View All Positions
              </Button>
              <Button variant="outline" size="lg">
                Send General Application
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;