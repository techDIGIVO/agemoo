import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Business Tips", "Marketing", "Photography", "Equipment", "Success Stories"];

  const blogPosts = [
    {
      id: 1,
      title: "Building a Successful Photography Business in Lagos",
      excerpt: "Learn how Amara built her portrait photography business from zero to six figures in just 18 months.",
      category: "Success Stories",
      author: "Amara Johnson",
      date: "January 15, 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1554048612-b6eb0d2c2b4b?w=600&h=400&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "10 Essential Marketing Strategies for African Photographers",
      excerpt: "Discover proven marketing techniques that work specifically in African markets and cultural contexts.",
      category: "Marketing",
      author: "Kwame Asante",
      date: "January 12, 2024",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
      featured: false
    },
    {
      id: 3,
      title: "Pricing Your Photography Services: A Complete Guide",
      excerpt: "How to price your services competitively while ensuring profitability in emerging markets.",
      category: "Business Tips",
      author: "Zara Okafor",
      date: "January 10, 2024",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
      featured: false
    },
    {
      id: 4,
      title: "The Rise of Mobile Photography in Africa",
      excerpt: "How smartphones are democratizing photography and creating new business opportunities across the continent.",
      category: "Photography",
      author: "Ibrahim Musa",
      date: "January 8, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&h=400&fit=crop",
      featured: false
    },
    {
      id: 5,
      title: "Building Your Photography Portfolio: Do's and Don'ts",
      excerpt: "Expert tips on creating a portfolio that attracts clients and showcases your unique style.",
      category: "Business Tips",
      author: "Fatima Al-Hassan",
      date: "January 5, 2024",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=400&fit=crop",
      featured: false
    },
    {
      id: 6,
      title: "Essential Camera Gear for African Wildlife Photography",
      excerpt: "A comprehensive guide to choosing the right equipment for capturing Africa's stunning wildlife.",
      category: "Equipment",
      author: "David Ochieng",
      date: "January 3, 2024",
      readTime: "15 min read",
      image: "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=600&h=400&fit=crop",
      featured: false
    },
    {
      id: 7,
      title: "How to Negotiate with Clients: African Business Culture Edition",
      excerpt: "Understanding cultural nuances and building trust when negotiating photography contracts.",
      category: "Business Tips",
      author: "Grace Akinyi",
      date: "December 30, 2023",
      readTime: "11 min read",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&h=400&fit=crop",
      featured: false
    },
    {
      id: 8,
      title: "Social Media Marketing for Photographers in 2024",
      excerpt: "Latest strategies for growing your photography business through Instagram, TikTok, and Facebook.",
      category: "Marketing",
      author: "Chioma Ikechukwu",
      date: "December 28, 2023",
      readTime: "13 min read",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      featured: false
    },
    {
      id: 9,
      title: "From Wedding Photos to Fashion: Diversifying Your Portfolio",
      excerpt: "How to expand your photography services and tap into multiple revenue streams.",
      category: "Business Tips",
      author: "Michael Tembo",
      date: "December 25, 2023",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=400&fit=crop",
      featured: false
    },
    {
      id: 10,
      title: "The Business of Event Photography in Nigeria",
      excerpt: "Insights into Nigeria's thriving event photography market and how to succeed in it.",
      category: "Success Stories",
      author: "Blessing Adegoke",
      date: "December 22, 2023",
      readTime: "14 min read",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
      featured: false
    },
    {
      id: 11,
      title: "Understanding Copyright Laws for African Photographers",
      excerpt: "Protecting your work and understanding intellectual property rights in different African countries.",
      category: "Business Tips",
      author: "Samuel Mensah",
      date: "December 20, 2023",
      readTime: "16 min read",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop",
      featured: false
    },
    {
      id: 12,
      title: "Building a Photography Community: Lessons from Accra",
      excerpt: "How a group of young photographers in Accra created a thriving creative collective.",
      category: "Success Stories",
      author: "Akosua Frimpong",
      date: "December 18, 2023",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1543269664-647b39fcf18b?w=600&h=400&fit=crop",
      featured: false
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-12 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Photography <span className="text-gradient">Business Blog</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Insights, tips, and success stories from Africa's photography community
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-6 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-4 bg-primary/10 text-primary">Featured Article</Badge>
                <Card className="overflow-hidden shadow-medium cursor-pointer hover:shadow-elegant transition-smooth"
                      onClick={() => navigate(`/blog/${featuredPost.id}`)}>
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-8">
                      <Badge variant="secondary" className="mb-3">
                        {featuredPost.category}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-smooth">
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{featuredPost.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{featuredPost.date}</span>
                          </div>
                          <span>{featuredPost.readTime}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-medium transition-smooth cursor-pointer"
                      onClick={() => navigate(`/blog/${post.id}`)}>
                  <div className="aspect-video bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-smooth">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;