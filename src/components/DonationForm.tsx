import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface DonationFormProps {
  onAdd: (fanName: string, amount: number) => void;
}

export const DonationForm = ({ onAdd }: DonationFormProps) => {
  const [fanName, setFanName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (fanName.trim() && parsedAmount > 0) {
      onAdd(fanName.trim(), parsedAmount);
      setFanName('');
      setAmount('');
    }
  };

  return (
    <Card className="glass-card p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Donation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fanName">Fan Name</Label>
            <Input
              id="fanName"
              type="text"
              value={fanName}
              onChange={(e) => setFanName(e.target.value)}
              placeholder="Enter fan name"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-1"
              min="1"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Donation
        </Button>
      </form>
    </Card>
  );
};