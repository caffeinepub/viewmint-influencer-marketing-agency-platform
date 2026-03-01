import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useSubmitContactForm } from '../hooks/useQueries';
import { toast } from 'sonner';
import { ArrowRight, Users, TrendingUp, Target, CheckCircle2, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submitContact = useSubmitContactForm();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await submitContact.mutateAsync({ name, email, message });
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Connecting Brands with Influencers
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Amplify Your{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Brand Story
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Viewmint connects innovative brands with authentic influencers to create campaigns that resonate,
                engage, and convert.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-muted-foreground">Influencers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">200+</div>
                  <div className="text-sm text-muted-foreground">Brands</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">1M+</div>
                  <div className="text-sm text-muted-foreground">Reach</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl" />
              <img
                src="/assets/generated/hero-image.dim_1200x600.jpg"
                alt="Influencer Marketing"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-32 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/assets/generated/team-photo.dim_800x500.jpg"
                alt="Our Team"
                className="rounded-3xl shadow-xl w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                About <span className="text-purple-600">Viewmint</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                We're a cutting-edge influencer marketing agency dedicated to bridging the gap between brands and
                content creators. Our platform leverages technology to make collaborations seamless, transparent, and
                effective.
              </p>
              <p className="text-lg text-muted-foreground">
                With years of experience in digital marketing and a deep understanding of social media dynamics, we've
                helped hundreds of brands achieve their marketing goals through authentic influencer partnerships.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">Verified Influencers</div>
                    <div className="text-sm text-muted-foreground">Quality over quantity</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">Data-Driven</div>
                    <div className="text-sm text-muted-foreground">Analytics & insights</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">Transparent Pricing</div>
                    <div className="text-sm text-muted-foreground">No hidden fees</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">24/7 Support</div>
                    <div className="text-sm text-muted-foreground">Always here to help</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive solutions for brands and influencers to succeed in the digital landscape
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-purple-600 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Influencer Matching</CardTitle>
                <CardDescription>
                  Connect with the perfect influencers for your brand using our advanced matching algorithm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    AI-powered recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Audience demographics analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Engagement rate verification
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-600 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Campaign Management</CardTitle>
                <CardDescription>
                  End-to-end campaign management from planning to execution and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Strategic planning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Content approval workflow
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Performance tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-600 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Comprehensive analytics to measure ROI and optimize your influencer marketing strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Real-time dashboards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ROI calculations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Detailed reports
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <img
              src="/assets/generated/services-illustration.dim_600x400.jpg"
              alt="Services"
              className="rounded-3xl shadow-xl mx-auto max-w-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 sm:py-32 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground">
              See how we've helped brands and influencers achieve remarkable results
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="relative overflow-hidden">
                  <img
                    src="/assets/generated/portfolio-showcase.dim_800x600.jpg"
                    alt={`Campaign ${i}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-sm font-medium mb-1">Campaign #{i}</div>
                    <div className="text-xs opacity-90">Fashion & Lifestyle</div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">2.5M</div>
                      <div className="text-xs text-muted-foreground">Reach</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">4.2%</div>
                      <div className="text-xs text-muted-foreground">Engagement</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">350%</div>
                      <div className="text-xs text-muted-foreground">ROI</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submitContact.isPending} className="w-full" size="lg">
                    {submitContact.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
