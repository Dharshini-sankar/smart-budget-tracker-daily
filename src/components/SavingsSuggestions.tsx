
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, DollarSign, PiggyBank, Target, Coffee, Car, ShoppingCart } from "lucide-react";

const savingsTips = [
  {
    category: "Reduce Expenses",
    icon: PiggyBank,
    color: "bg-destructive/10 text-destructive",
    tips: [
      "Track daily expenses using the 50/30/20 rule",
      "Cancel unused subscriptions and memberships",
      "Cook meals at home instead of dining out",
      "Use public transport or carpool to save on fuel",
      "Buy generic brands instead of premium ones"
    ]
  },
  {
    category: "Increase Income",
    icon: TrendingUp,
    color: "bg-success/10 text-success",
    tips: [
      "Start a side hustle or freelance work",
      "Sell items you no longer need online",
      "Take on part-time or remote work opportunities",
      "Invest in skills that can lead to promotions",
      "Create passive income through investments"
    ]
  },
  {
    category: "Smart Spending",
    icon: Target,
    color: "bg-warning/10 text-warning",
    tips: [
      "Use cashback and reward credit cards responsibly",
      "Shop during sales and use coupons",
      "Compare prices before making major purchases",
      "Set spending limits for entertainment and shopping",
      "Wait 24 hours before impulse purchases"
    ]
  }
];

const quickTips = [
  { icon: Coffee, tip: "Make coffee at home", savings: "$150/month" },
  { icon: Car, tip: "Use public transport", savings: "$200/month" },
  { icon: ShoppingCart, tip: "Bulk buying essentials", savings: "$80/month" },
  { icon: DollarSign, tip: "Automate savings", savings: "$300/month" },
];

export function SavingsSuggestions() {
  return (
    <div className="space-y-6">
      <Card className="animate-fade-in border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Financial Wellness Tips
          </CardTitle>
          <CardDescription>
            Expert suggestions to improve your financial health and achieve your goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savingsTips.map((section, index) => (
              <div key={section.category} className={`animate-slide-up [animation-delay:${index * 100}ms]`}>
                <div className={`p-4 rounded-lg ${section.color} mb-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <section.icon className="h-5 w-5" />
                    <h3 className="font-semibold">{section.category}</h3>
                  </div>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in [animation-delay:300ms] border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Target className="h-5 w-5" />
            Quick Savings Calculator
          </CardTitle>
          <CardDescription>
            See how small changes can lead to big savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTips.map((item, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-md transition-all duration-200 animate-scale-in [animation-delay:${index * 50}ms]`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.tip}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      Save {item.savings}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
