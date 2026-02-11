import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // This would normally come from an API or database
  const post = {
    id: 1,
    title: "Building a Successful Photography Business in Lagos",
    excerpt: "Learn how Amara built her portrait photography business from zero to six figures in just 18 months.",
    category: "Success Stories",
    author: "Amara Johnson",
    date: "January 15, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1554048612-b6eb0d2c2b4b?w=1200&h=600&fit=crop",
    content: `
      <h2>The Journey Begins</h2>
      <p>When I first picked up a camera three years ago, I never imagined it would transform into a thriving business that now supports my family and employs three other people. Today, I want to share the exact steps I took to build my portrait photography business in Lagos from absolutely nothing to generating six figures annually.</p>
      
      <h2>Finding My Niche in a Crowded Market</h2>
      <p>Lagos has thousands of photographers, and when I started, I felt overwhelmed by the competition. The key breakthrough came when I realized I needed to find my unique voice and target audience. Instead of trying to be everything to everyone, I focused specifically on capturing authentic moments for young Nigerian families and professionals.</p>
      
      <blockquote>"Your biggest competition is your own self-doubt. Once I believed in my unique perspective, clients started believing in it too." - Amara Johnson</blockquote>
      
      <h2>The Three Pillars of My Success</h2>
      
      <h3>1. Consistent Quality and Style</h3>
      <p>I spent months developing a signature editing style that clients could recognize instantly. This consistency became my brand. Whether shooting in Victoria Island or Ikeja, clients knew exactly what to expect from an "Amara Johnson" photo.</p>
      
      <h3>2. Strategic Social Media Presence</h3>
      <p>Instagram became my primary marketing tool, but I didn't just post randomly. I created a content calendar, engaged authentically with my audience, and shared behind-the-scenes content that showed my personality and process.</p>
      
      <h3>3. Word-of-Mouth and Referral System</h3>
      <p>I implemented a formal referral program where existing clients received discounts for successful referrals. This turned my happiest clients into my best marketing team.</p>
      
      <h2>Overcoming the Common Challenges</h2>
      
      <p>The path wasn't always smooth. Here are the biggest challenges I faced and how I overcame them:</p>
      
      <ul>
        <li><strong>Pricing Pressure:</strong> Many clients wanted professional work at amateur prices. I learned to confidently communicate my value and walk away from clients who didn't appreciate it.</li>
        <li><strong>Equipment Costs:</strong> I started with basic equipment and upgraded gradually as my business grew. I never took on debt to buy equipment I couldn't afford.</li>
        <li><strong>Seasonal Fluctuations:</strong> I diversified my services to include corporate headshots and personal branding sessions, which provided steady income during slower wedding seasons.</li>
      </ul>
      
      <h2>The Numbers: From Zero to Six Figures</h2>
      
      <p>Here's the honest breakdown of my revenue growth:</p>
      
      <ul>
        <li><strong>Year 1:</strong> ₦1.2M (mostly wedding assistant work and small portraits)</li>
        <li><strong>Year 2:</strong> ₦3.8M (established client base, raised prices)</li>
        <li><strong>Year 3:</strong> ₦8.2M (hired assistants, expanded services)</li>
      </ul>
      
      <h2>Lessons for Aspiring Photography Entrepreneurs</h2>
      
      <p>If you're just starting your photography business in Nigeria or anywhere in Africa, here are my top recommendations:</p>
      
      <ol>
        <li><strong>Start before you're ready:</strong> I waited too long to start charging for my work. Your skills are probably better than you think.</li>
        <li><strong>Invest in relationships, not just equipment:</strong> The best camera won't help if you can't connect with people.</li>
        <li><strong>Price for your market, but don't undervalue yourself:</strong> Research what similar photographers charge and position yourself accordingly.</li>
        <li><strong>Document everything:</strong> Keep detailed records of what works and what doesn't. This data will guide your business decisions.</li>
      </ol>
      
      <h2>What's Next?</h2>
      
      <p>I'm now working on opening a photography school to help other Nigerian photographers fast-track their journey. The creative industry in Africa is booming, and there's room for all of us to succeed.</p>
      
      <p>Remember, your background, your challenges, and your unique perspective are not obstacles – they're your competitive advantages. Use them wisely.</p>
    `
  };

  const relatedPosts = [
    {
      id: 2,
      title: "10 Essential Marketing Strategies for African Photographers",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      category: "Marketing"
    },
    {
      id: 3,
      title: "Pricing Your Photography Services: A Complete Guide",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      category: "Business Tips"
    },
    {
      id: 9,
      title: "From Wedding Photos to Fashion: Diversifying Your Portfolio",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop",
      category: "Business Tips"
    }
  ];

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
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
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
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-12">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

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
                    <h3 className="text-xl font-semibold mb-2">About {post.author}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Amara Johnson is a professional portrait photographer based in Lagos, Nigeria. 
                      She specializes in capturing authentic moments for families and professionals 
                      across West Africa. Her work has been featured in several Nigerian lifestyle magazines.
                    </p>
                    <Button variant="outline">Follow on Instagram</Button>
                  </div>
                </div>
              </Card>

              {/* Related Posts */}
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
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
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
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;