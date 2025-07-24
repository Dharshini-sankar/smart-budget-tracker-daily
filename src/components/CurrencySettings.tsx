
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportedCurrencies, loadBudgetData, updateCurrency } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Globe } from "lucide-react";

interface CurrencySettingsProps {
  onCurrencyChanged: () => void;
}

export function CurrencySettings({ onCurrencyChanged }: CurrencySettingsProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(loadBudgetData().currency);
  const { toast } = useToast();

  const handleCurrencyUpdate = () => {
    updateCurrency(selectedCurrency);
    onCurrencyChanged();
    
    toast({
      title: "Currency updated",
      description: `Changed to ${supportedCurrencies.find(c => c.code === selectedCurrency)?.name}`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Currency Settings
        </CardTitle>
        <CardDescription>
          Choose your preferred currency for all amounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Currency</label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Choose currency" />
            </SelectTrigger>
            <SelectContent>
              {supportedCurrencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleCurrencyUpdate} className="w-full">
          Update Currency
        </Button>
      </CardContent>
    </Card>
  );
}
