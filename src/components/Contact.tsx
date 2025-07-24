
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle, Globe, Github, Twitter } from "lucide-react";

export function Contact() {
  return (
    <Card className="animate-fade-in border-0 shadow-card bg-gradient-to-r from-primary/5 to-success/5">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <MessageCircle className="h-6 w-6 text-primary" />
          Get in Touch
        </CardTitle>
        <CardDescription className="text-lg">
          Have questions, suggestions, or found a bug? We're here to help!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <a href="mailto:support@budgettracker.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    support@budgettracker.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <Phone className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <a href="tel:+1-555-0123" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    +1 (555) 012-3456
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <Globe className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">Website</p>
                  <a href="https://budgettracker.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    www.budgettracker.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => window.open('mailto:support@budgettracker.com?subject=Bug Report', '_blank')}
              >
                <Mail className="h-4 w-4" />
                Report a Bug
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => window.open('mailto:feedback@budgettracker.com?subject=Feature Request', '_blank')}
              >
                <MessageCircle className="h-4 w-4" />
                Request Feature
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => window.open('mailto:help@budgettracker.com?subject=Need Help', '_blank')}
              >
                <Phone className="h-4 w-4" />
                Get Help
              </Button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Follow us for updates and tips</p>
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Support Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            We typically respond within 24 hours
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
