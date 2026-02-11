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
  TrendingUp, Heart, Share2, Bookmark, Search, Filter, Plus 
} from "lucide-react";

const Community = () => {
  const [activeFilter, setActiveFilter] = useState("all");

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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      date: "March 15, 2024",
      time: "10:00 AM",
      location: "Victoria Island, Lagos",
      attendees: 45,
      type: "Workshop",
      host: "Professional Photography Guild"
    },
    {
      title: "Portrait Lighting Masterclass",
      date: "March 22, 2024",
      time: "2:00 PM",
      location: "Online Event",
      attendees: 128,
      type: "Masterclass",
      host: "Studio Masters Academy"
    },
    {
      title: "Equipment Showcase & Demo",
      date: "March 28, 2024",
      time: "11:00 AM",
      location: "Abuja Photography Hub",
      attendees: 67,
      type: "Demo",
      host: "Camera Equipment Nigeria"
    }
  ];

  const topContributors = [
    {
      name: "Emmanuel Okafor",
      avatar: "EO",
      points: 2847,
      badge: "Expert Contributor",
      specialty: "Wedding Photography"
    },
    {
      name: "Fatima Aliyu",
      avatar: "FA",
      points: 2156,
      badge: "Rising Star",
      specialty: "Fashion Photography"
    },
    {
      name: "David Adebayo",
      avatar: "DA",
      points: 1923,
      badge: "Mentor",
      specialty: "Commercial Photography"
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
                <TabsTrigger value="members">Top Members</TabsTrigger>
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
                      <h3 className="font-semibold mb-4">Top Contributors</h3>
                      <div className="space-y-4">
                        {topContributors.map((contributor, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">{contributor.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{contributor.name}</p>
                              <p className="text-xs text-muted-foreground">{contributor.specialty}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{contributor.points}</p>
                              <Badge variant="outline" className="text-xs">{contributor.badge}</Badge>
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
                            {event.attendees}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription>Hosted by {event.host}</CardDescription>
                      </CardHeader>
                      <CardContent>
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
                        <Button className="w-full mt-4">Register</Button>
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
                  <p className="text-muted-foreground">Meet our most active and helpful community members</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topContributors.map((member, index) => (
                    <Card key={index} className="p-6 text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-4">
                        <AvatarFallback className="text-lg">{member.avatar}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold mb-2">{member.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{member.specialty}</p>
                      <Badge className="mb-3">{member.badge}</Badge>
                      <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{member.points} points</span>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
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
    </div>
  );
};

export default Community;