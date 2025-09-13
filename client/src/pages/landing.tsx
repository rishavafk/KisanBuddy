import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Bot, Shield, BarChart3, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="text-primary-foreground" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">AgriSmart</h1>
              <p className="text-xs text-muted-foreground">Precision Agriculture</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" data-testid="button-login">Login</Button>
            </Link>
            <Link href="/signup">
              <Button data-testid="button-signup">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-foreground">
              Intelligent Pesticide Management
              <span className="block text-primary mt-2">Powered by AI</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Revolutionize your farming with precision spraying technology. 
              Detect plant infections early, reduce pesticide waste, and boost crop yields 
              with our smart agricultural system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="min-w-48" data-testid="button-get-started">
                  Start Farming Smart
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="min-w-48" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose AgriSmart?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our intelligent system combines AI-powered detection with precision spraying 
              to deliver sustainable agriculture solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bot className="text-primary" size={24} />
                </div>
                <CardTitle className="text-lg">Smart Bot Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect drones for real-time field monitoring and automated pesticide application.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-accent" size={24} />
                </div>
                <CardTitle className="text-lg">AI Disease Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced AI algorithms detect plant diseases and infections with 94% accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="text-secondary" size={24} />
                </div>
                <CardTitle className="text-lg">Data Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive analytics dashboard to track crop health and optimize treatments.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Leaf className="text-primary" size={24} />
                </div>
                <CardTitle className="text-lg">Eco-Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Reduce pesticide usage by up to 76% while maintaining crop quality and yield.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Sustainable Agriculture Made Simple
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Transform your farming operations with intelligent automation that protects both 
                your crops and the environment. Our system ensures precise pesticide application 
                only where and when needed.
              </p>
              
              <div className="space-y-4">
                {[
                  "76% reduction in pesticide waste",
                  "94% infection detection accuracy", 
                  "Real-time crop health monitoring",
                  "Automated treatment recommendations",
                  "Cost savings up to ₹50,000 per season"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-primary" size={20} />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15,000+</div>
                <div className="text-muted-foreground mb-6">Farmers Using AgriSmart</div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-card rounded-lg p-4">
                    <div className="text-2xl font-bold text-accent">247L</div>
                    <div className="text-sm text-muted-foreground">Pesticide Saved</div>
                  </div>
                  <div className="bg-card rounded-lg p-4">
                    <div className="text-2xl font-bold text-secondary">98.5%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                </div>
                
                <Link href="/signup">
                  <Button className="w-full" data-testid="button-join-farmers">
                    Join Thousands of Smart Farmers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="text-primary-foreground" size={16} />
              </div>
              <span className="font-bold text-lg">AgriSmart</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Intelligent pesticide sprinkling system for sustainable agriculture
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
