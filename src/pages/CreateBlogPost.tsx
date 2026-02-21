import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Business Tips",
  "Marketing",
  "Photography",
  "Equipment",
  "Success Stories",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

const CreateBlogPost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Sign in Required</h1>
            <p className="text-muted-foreground mb-8">
              You need to be signed in to write a blog post.
            </p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (asDraft: boolean) => {
    if (!title.trim()) {
      toast({ title: "Title required", description: "Please enter a title for your post.", variant: "destructive" });
      return;
    }
    if (!excerpt.trim()) {
      toast({ title: "Excerpt required", description: "Please enter a short excerpt.", variant: "destructive" });
      return;
    }
    if (!content.trim()) {
      toast({ title: "Content required", description: "Please write your post content.", variant: "destructive" });
      return;
    }
    if (!category) {
      toast({ title: "Category required", description: "Please select a category.", variant: "destructive" });
      return;
    }

    setSaving(true);

    const slug = slugify(title);
    const authorName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Anonymous";

    const { error } = await supabase.from("blog_posts").insert({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      category,
      author_id: user.id,
      author_name: authorName,
      image_url: imageUrl.trim() || null,
      featured,
      published: asDraft ? false : published,
      read_time: estimateReadTime(content),
    });

    setSaving(false);

    if (error) {
      console.error("Error creating blog post:", error);
      toast({
        title: "Error",
        description: error.code === "23505"
          ? "A post with a similar title already exists. Please change the title."
          : "Failed to create post. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: asDraft ? "Draft saved" : "Post published!",
      description: asDraft
        ? "Your draft has been saved."
        : "Your blog post is now live.",
    });
    navigate("/blog");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back */}
          <Button variant="ghost" onClick={() => navigate("/blog")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-8">Write a New Post</h1>

          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            {/* Main form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
                {title && (
                  <p className="text-xs text-muted-foreground">
                    Slug: <span className="font-mono">{slugify(title)}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="A short summary of your post (shown in cards & search)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  Content{" "}
                  <span className="text-xs text-muted-foreground">(HTML supported)</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here. You can use HTML tags like <h2>, <p>, <ul>, <blockquote>..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
                {content && (
                  <p className="text-xs text-muted-foreground">
                    Estimated read time: {estimateReadTime(content)}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Cover Image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    {imageUrl && (
                      <div className="aspect-video rounded-md overflow-hidden bg-muted mt-2">
                        <img
                          src={imageUrl}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured post</Label>
                    <Switch
                      id="featured"
                      checked={featured}
                      onCheckedChange={setFeatured}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Publish immediately</Label>
                    <Switch
                      id="published"
                      checked={published}
                      onCheckedChange={setPublished}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                >
                  {published ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      {saving ? "Publishing..." : "Publish Post"}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save as Draft"}
                    </>
                  )}
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateBlogPost;
