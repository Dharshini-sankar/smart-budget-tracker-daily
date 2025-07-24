
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  PieChart, 
  Target, 
  Shield, 
  Smartphone, 
  BarChart3,
  ArrowRight,
  Sparkles,
  DollarSign
} from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    { icon: TrendingUp, text: "Track Your Income", color: "text-success" },
    { icon: PieChart, text: "Monitor Expenses", color: "text-destructive" },
    { icon: Target, text: "Achieve Goals", color: "text-warning" },
    { icon: BarChart3, text: "Visual Analytics", color: "text-primary" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <div
      key={i}
      className={`absolute animate-pulse opacity-20`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }}
    >
      <DollarSign className="h-6 w-6 text-primary" />
    </div>
  ));

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements}
      </div>

      {/* Animated Background Circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-success/10 rounded-full animate-pulse [animation-delay:1s]"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-warning/10 rounded-full animate-pulse [animation-delay:2s]"></div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-8 animate-fade-in">
          {/* Logo/Brand */}
          <div className="animate-scale-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-6 shadow-primary">
              <Sparkles className="h-10 w-10 text-primary-foreground animate-pulse" />
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
              Smart Budget
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground animate-slide-up [animation-delay:200ms]">
              Tracker
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:400ms]">
              Transform your financial future with intelligent budgeting and real-time insights
            </p>
          </div>

          {/* Rotating Features */}
          <div className="animate-slide-up [animation-delay:600ms]">
            <Card className="inline-block border-0 shadow-card bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-gradient-primary shadow-primary">
                    {features.map((feature, index) => (
                      <feature.icon
                        key={index}
                        className={`h-6 w-6 text-primary-foreground transition-all duration-500 ${
                          index === currentFeature ? 'opacity-100 scale-100' : 'opacity-0 scale-75 absolute'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    {features[currentFeature].text}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="animate-scale-in [animation-delay:800ms]">
            <Button
              onClick={onEnter}
              size="lg"
              className="text-lg px-8 py-6 shadow-primary hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fade-in [animation-delay:1000ms]">
            {[
              { icon: Shield, text: "Secure & Private" },
              { icon: Smartphone, text: "Mobile Friendly" },
              { icon: BarChart3, text: "Real-time Analytics" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm text-sm text-muted-foreground hover:bg-muted/80 transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${1200 + index * 100}ms` }}
              >
                <item.icon className="h-4 w-4" />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in [animation-delay:1500ms]">
          <div className="flex gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">$2M+</div>
              <div className="text-sm text-muted-foreground">Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">4.9★</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
