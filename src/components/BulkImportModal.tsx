import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText } from "lucide-react";

interface BulkImportModalProps {
  onImport: (text: string) => number;
  onSuccess: (count: number) => void;
}

export const BulkImportModal = ({ onImport, onSuccess }: BulkImportModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      const count = onImport(text);
      onSuccess(count);
      setText('');
      setIsOpen(false);
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-6">
          <Upload className="w-4 h-4 mr-2" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Bulk Import Donations
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Paste your donation data here. Each line should contain the fan name followed by the amount:
            </p>
            <div className="bg-muted/20 p-3 rounded-lg text-sm font-mono">
              daksh 2190<br />
              darkside 210<br />
              alex smith 1500
            </div>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your donation data here..."
            className="min-h-[200px] font-mono"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!text.trim() || isLoading}
              className="gradient-primary"
            >
              {isLoading ? 'Importing...' : 'Import Donations'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};