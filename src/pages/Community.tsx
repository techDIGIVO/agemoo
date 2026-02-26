import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, MessageCircle, Calendar, Trophy, Star, MapPin, Camera, 
  TrendingUp, Heart, Share2, Bookmark, Search, Filter, Plus, CheckCircle, Award 
} from "lucide-react";
import EventRegistrationDialog from "@/components/community/EventRegistrationDialog";

const Community = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [eventDialog, setEventDialog] = useState<{ isOpen: boolean; event: any }>({ isOpen: false, event: null });

  const communityStats = [
    { label: "Active Members", value: "12,847", icon: Users, trend: "+15%" },
    { label: "Monthly Posts", value: "3,254", icon: MessageCircle, trend: "+23%" },
    { label: "Events This Month", value: "47", icon: Calendar, trend: "+8%" },
    { label: "Success Stories", value: "892", icon: Trophy, trend: "+31%" }
  ];

  const featuredPosts = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        avatar: "SJ",
        title: "Wedding Photographer",
        verified: true
      },
      content: "Just completed my 100th wedding this year! Feeling grateful for this amazing community that's helped me grow. Here are my top 5 lessons learned...",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
      likes: 284,
      comments: 47,
      shares: 23,
      timestamp: "2 hours ago",
      category: "Success Story",
      trending: true
    },
    {
      id: 2,
      author: {
        name: "Mike Chen",
        avatar: "MC",
        title: "Portrait Specialist",
        verified: false
      },
      content: "New lighting technique I've been experimenting with for corporate headshots. The results have been incredible! Sharing my setup and settings...",
      image: "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=600&h=400&fit=crop",
      likes: 156,
      comments: 32,
      shares: 15,
      timestamp: "5 hours ago",
      category: "Tutorial",
      trending: false
    },
    {
      id: 3,
      author: {
        name: "Lagos Photography Collective",
        avatar: "LPC",
        title: "Photography Group",
        verified: true
      },
      content: "Announcing our monthly meetup this Saturday at Victoria Island! We'll be covering street photography techniques and networking. All skill levels welcome!",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop",
      likes: 89,
      comments: 28,
      shares: 34,
      timestamp: "1 day ago",
      category: "Event",
      trending: false
    }
  ];

  const upcomingEvents = [
    {
      title: "Lagos Photography Workshop",
      date: "April 12, 2026",
      time: "10:00 AM",
      location: "Victoria Island, Lagos",
      attendees: 45,
      type: "Workshop",
      host: "Professional Photography Guild",
      description: "Hands-on workshop covering advanced composition, natural lighting, and post-processing techniques. Open to all skill levels.",
      spotsLeft: 15
    },
    {
      title: "Portrait Lighting Masterclass",
      date: "April 19, 2026",
      time: "2:00 PM",
      location: "Online Event",
      attendees: 128,
      type: "Masterclass",
      host: "Studio Masters Academy",
      description: "Learn studio and natural portrait lighting setups used by top African fashion and editorial photographers.",
      spotsLeft: 72
    },
    {
      title: "Equipment Showcase & Demo",
      date: "April 26, 2026",
      time: "11:00 AM",
      location: "Abuja Photography Hub",
      attendees: 67,
      type: "Demo",
      host: "Camera Equipment Nigeria",
      description: "Get hands-on with the latest cameras, lenses, and lighting gear. Meet vendors and take advantage of exclusive demo-day discounts.",
      spotsLeft: 33
    }
  ];

  const communityChampions = [
    {
      name: "Emmanuel Okafor",
      avatar: "EO",
      specialty: "Wedding Photography",
      badge: "Top Rated",
      verified: true,
      completedBookings: 184,
      rating: 4.9,
      location: "Lagos, Nigeria",
      achievement: "Most booked wedding photographer in Lagos with a 4.9 average rating"
    },
    {
      name: "Fatima Aliyu",
      avatar: "FA",
      specialty: "Fashion Photography",
      badge: "Rising Star",
      verified: true,
      completedBookings: 92,
      rating: 4.8,
      location: "Abuja, Nigeria",
      achievement: "Fastest-growing portfolio with 92 bookings in under 12 months"
    },
    {
      name: "David Adebayo",
      avatar: "DA",
      specialty: "Commercial Photography",
      badge: "Mentor",
      verified: true,
      completedBookings: 156,
      rating: 4.7,
      location: "Accra, Ghana",
      achievement: "Active community mentor — helped onboard 40+ new photographers"
    }
  ];

  const discussionTopics = [
    {
      title: "Best camera settings for Nigerian wedding ceremonies?",
      replies: 23,
      lastActive: "30 min ago",
      author: "Grace Nwosu",
      category: "Technical"
    },
    {
      title: "How to price portrait sessions in Lagos market?",
      replies: 41,
      lastActive: "1 hour ago",
      author: "Kemi Adebayo",
      category: "Business"
    },
    {
      title: "Recommendations for affordable studio lighting setup",
      replies: 18,
      lastActive: "2 hours ago",
      author: "Tunde Bakare",
      category: "Equipment"
    },
    {
      title: "Copyright and model release best practices",
      replies: 35,
      lastActive: "3 hours ago",
      author: "Legal Expert",
      category: "Legal"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              Photography Community
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with fellow photographers, share knowledge, get inspired, and grow your skills 
              together in Nigeria's largest photography community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Join Community
              </Button>
              <Button variant="outline" size="lg">
                Browse Posts
              </Button>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityStats.map((stat, index) => (
                <Card key={index} className="p-6 text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground mb-1">{stat.label}</p>
                  <Badge variant="secondary" className="text-green-600">
                    {stat.trend} this month
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
                <TabsTrigger value="feed">Community Feed</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="members">Champions</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="mt-12">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Main Feed */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Post Filters */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold">Community Feed</h2>
                        <Filter className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex space-x-2">
                        {["all", "tutorials", "success", "events", "questions"].map((filter) => (
                          <Button
                            key={filter}
                            variant={activeFilter === filter ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveFilter(filter)}
                          >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Posts */}
                    {featuredPosts.map((post) => (
                      <Card key={post.id} className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarFallback>{post.author.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{post.author.name}</h3>
                              {post.author.verified && (
                                <Badge variant="secondary" className="text-xs">Verified</Badge>
                              )}
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                              {post.trending && (
                                <Badge className="text-xs bg-orange-500">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm mb-1">{post.author.title}</p>
                            <p className="mb-4">{post.content}</p>
                            
                            {/* Post Image */}
                            <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                              <Camera className="w-12 h-12 text-muted-foreground" />
                            </div>

                            {/* Post Actions */}
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex items-center space-x-4">
                                <Button variant="ghost" size="sm">
                                  <Heart className="w-4 h-4 mr-2" />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  {post.comments}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="w-4 h-4 mr-2" />
                                  {post.shares}
                                </Button>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Bookmark className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Search */}
                    <Card className="p-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input placeholder="Search community..." className="pl-10" />
                      </div>
                    </Card>

                    {/* Top Contributors */}
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Community Champions</h3>
                      <div className="space-y-4">
                        {communityChampions.map((champion, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">{champion.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-1">
                                <p className="font-medium text-sm">{champion.name}</p>
                                {champion.verified && <CheckCircle className="w-3 h-3 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground">{champion.specialty}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span className="font-medium">{champion.rating}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">{champion.badge}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Quick Links */}
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Post
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          Create Event
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Discussion
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
                  <p className="text-muted-foreground">Join workshops, meetups, and learning sessions</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => (
                    <Card key={index} className="p-6">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <Badge>{event.type}</Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="w-4 h-4 mr-1" />
                            {event.attendees} attending
                          </div>
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription>Hosted by {event.host}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-muted-foreground">{event.spotsLeft} spots left</span>
                          <Button onClick={() => setEventDialog({ isOpen: true, event })}>Register Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="discussions" className="mt-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Active Discussions</h2>
                  <p className="text-muted-foreground">Join conversations and get help from the community</p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                  {discussionTopics.map((topic, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{topic.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>by {topic.author}</span>
                            <Badge variant="outline">{topic.category}</Badge>
                            <span>{topic.replies} replies</span>
                            <span>Last active {topic.lastActive}</span>
                          </div>
                        </div>
                        <MessageCircle className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Community Champions</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our champions are verified professionals recognised for outstanding work — selected based on completed bookings, client ratings, and contributions to the community.
                  </p>
                </div>

                {/* Criteria Legend */}
                <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-primary" />
                    <span>Verified Professional</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>4.5+ Client Rating</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>50+ Completed Bookings</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {communityChampions.map((member, index) => (
                    <Card key={index} className="p-6 text-center">
                      <div className="relative inline-block">
                        <Avatar className="w-16 h-16 mx-auto mb-4">
                          <AvatarFallback className="text-lg">{member.avatar}</AvatarFallback>
                        </Avatar>
                        {member.verified && (
                          <CheckCircle className="w-5 h-5 text-primary absolute -right-1 bottom-3 bg-background rounded-full" />
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{member.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{member.specialty}</p>
                      <p className="text-xs text-muted-foreground mb-3">{member.location}</p>
                      <Badge className="mb-3">{member.badge}</Badge>
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="font-medium">{member.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{member.completedBookings} bookings</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground italic mb-4">{member.achievement}</p>
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with thousands of photographers, share your work, learn new techniques, 
              and grow your photography business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <EventRegistrationDialog
        open={eventDialog.isOpen}
        onOpenChange={(open) => setEventDialog({ isOpen: open, event: open ? eventDialog.event : null })}
        event={eventDialog.event}
      />
    </div>
  );
};

export default Community;