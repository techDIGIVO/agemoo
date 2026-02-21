import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FullBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author_id: string | null;
  author_name: string;
  created_at: string;
  read_time: string | null;
  image_url: string | null;
}

interface RelatedPost {
  id: string;
  title: string;
  category: string;
  image_url: string | null;
}

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [post, setPost] = useState<FullBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, content, category, author_id, author_name, created_at, read_time, image_url")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching blog post:", error);
      }

      if (data) {
        setPost(data);

        // Fetch related posts from same category
        const { data: related } = await supabase
          .from("blog_posts")
          .select("id, title, category, image_url")
          .eq("published", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .order("created_at", { ascending: false })
          .limit(3);

        setRelatedPosts(related || []);
      }

      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!", description: "Post URL copied to clipboard." });
    } catch {
      toast({ title: "Share", description: window.location.href });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-2/3 mb-8" />
            <Skeleton className="aspect-video w-full rounded-lg mb-12" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              This blog post doesn't exist or has been unpublished.
            </p>
            <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <article className="py-8">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate("/blog")}
              className="mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>

            {/* Header */}
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4">{post.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-6 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.author_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  {post.read_time && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.read_time}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              {/* Featured Image */}
              {post.image_url && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-12">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-16">
                <div 
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="space-y-6 text-muted-foreground leading-relaxed"
                />
              </div>

              <Separator className="my-12" />

              {/* Author Bio */}
              <Card className="p-8 mb-16">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">About {post.author_name}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {post.author_name} is a contributor on the Agemoo photography platform.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Card 
                        key={relatedPost.id} 
                        className="overflow-hidden cursor-pointer hover:shadow-medium transition-smooth"
                        onClick={() => navigate(`/blog/${relatedPost.id}`)}
                      >
                        <div className="aspect-video bg-muted">
                          {relatedPost.image_url ? (
                            <img
                              src={relatedPost.image_url}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Clock className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {relatedPost.category}
                          </Badge>
                          <h3 className="font-semibold leading-tight hover:text-primary transition-smooth">
                            {relatedPost.title}
                          </h3>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;