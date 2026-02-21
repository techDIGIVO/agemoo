import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, User, ArrowRight, PenSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author_name: string;
  created_at: string;
  read_time: string | null;
  image_url: string | null;
  featured: boolean | null;
}

const Blog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Business Tips", "Marketing", "Photography", "Equipment", "Success Stories"];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, author_name, created_at, read_time, image_url, featured")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blog posts:", error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filtered = posts.filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filtered.find((p) => p.featured);
  const regularPosts = filtered.filter((p) => p !== featuredPost);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
              {user && (
                <Button className="mt-4" onClick={() => navigate("/blog/new")}>
                  <PenSquare className="w-4 h-4 mr-2" />
                  Write a Post
                </Button>
              )}
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
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {loading ? (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-80 w-full rounded-lg" />
              </div>
            </div>
          </section>
        ) : featuredPost ? (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-4 bg-primary/10 text-primary">Featured Article</Badge>
                <Card className="overflow-hidden shadow-medium cursor-pointer hover:shadow-elegant transition-smooth"
                      onClick={() => navigate(`/blog/${featuredPost.id}`)}>
                  <div className="md:flex">
                    {featuredPost.image_url && (
                      <div className="md:w-1/2">
                        <img
                          src={featuredPost.image_url}
                          alt={featuredPost.title}
                          className="w-full h-64 md:h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className={featuredPost.image_url ? "md:w-1/2 p-8" : "p-8"}>
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
                            <span>{featuredPost.author_name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(featuredPost.created_at)}</span>
                          </div>
                          {featuredPost.read_time && <span>{featuredPost.read_time}</span>}
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        ) : null}

        {/* Regular Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : regularPosts.length === 0 && !featuredPost ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground mb-4">
                  {searchTerm || activeCategory !== "All"
                    ? "No posts match your search."
                    : "No blog posts yet. Be the first to write one!"}
                </p>
                {user && (
                  <Button onClick={() => navigate("/blog/new")}>
                    <PenSquare className="w-4 h-4 mr-2" />
                    Write a Post
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-medium transition-smooth cursor-pointer"
                        onClick={() => navigate(`/blog/${post.id}`)}>
                    <div className="aspect-video bg-muted">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <PenSquare className="w-10 h-10" />
                        </div>
                      )}
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
                          <span>{post.author_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;