import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { Donation } from "@/hooks/useDonations";

interface DonationListProps {
  donations: Donation[];
  onUpdate: (id: string, fanName: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export const DonationList = ({ donations, onUpdate, onDelete }: DonationListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const startEdit = (donation: Donation) => {
    setEditingId(donation.id);
    setEditName(donation.fanName);
    setEditAmount(donation.amount.toString());
  };

  const saveEdit = () => {
    if (editingId && editName.trim() && parseFloat(editAmount) > 0) {
      onUpdate(editingId, editName.trim(), parseFloat(editAmount));
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditAmount('');
  };

  if (donations.length === 0) {
    return (
      <Card className="glass-card p-8 text-center">
        <div className="text-muted-foreground">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-lg font-medium mb-2">No donations yet</h3>
          <p>Add your first donation above or use bulk import!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4">Donations ({donations.length})</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {donations.map((donation) => (
          <div
            key={donation.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50"
          >
            {editingId === donation.id ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1"
                  placeholder="Fan name"
                />
                <Input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-24"
                  placeholder="Amount"
                />
                <Button size="sm" onClick={saveEdit} variant="outline">
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={cancelEdit} variant="outline">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {donation.fanName}
                    {donation.donationCount > 1 && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {donation.donationCount}x donations
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {donation.timestamp.toLocaleDateString()} at {donation.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-right mr-4">
                  <div className="font-bold text-primary">₹{donation.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    Net: ₹{Math.round(donation.amount * 0.7).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => startEdit(donation)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onDelete(donation.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};