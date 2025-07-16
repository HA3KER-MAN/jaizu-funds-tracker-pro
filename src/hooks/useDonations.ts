import { useState, useEffect } from 'react';

export interface Donation {
  id: string;
  fanName: string;
  amount: number;
  timestamp: Date;
}

const STORAGE_KEY = 'jaiyaxh-donations';
const PS5_GOAL = 54000;

export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isGoalReached, setIsGoalReached] = useState(false);

  // Load donations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const donationsWithDates = parsed.map((d: any) => ({
          ...d,
          timestamp: new Date(d.timestamp)
        }));
        setDonations(donationsWithDates);
      } catch (error) {
        console.error('Error loading donations:', error);
      }
    }
  }, []);

  // Save to localStorage whenever donations change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
  }, [donations]);

  // Check if goal is reached
  useEffect(() => {
    const netTotal = getTotalNet();
    if (netTotal >= PS5_GOAL && !isGoalReached) {
      setIsGoalReached(true);
      setTimeout(() => setIsGoalReached(false), 5000); // Hide after 5 seconds
    }
  }, [donations, isGoalReached]);

  const addDonation = (fanName: string, amount: number) => {
    const newDonation: Donation = {
      id: crypto.randomUUID(),
      fanName: fanName.trim(),
      amount,
      timestamp: new Date()
    };
    setDonations(prev => [newDonation, ...prev]);
    return newDonation;
  };

  const updateDonation = (id: string, fanName: string, amount: number) => {
    setDonations(prev => prev.map(d => 
      d.id === id ? { ...d, fanName: fanName.trim(), amount } : d
    ));
  };

  const deleteDonation = (id: string) => {
    setDonations(prev => prev.filter(d => d.id !== id));
  };

  const bulkImport = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const newDonations: Donation[] = [];
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const amount = parseInt(parts[parts.length - 1]);
        const fanName = parts.slice(0, -1).join(' ');
        
        if (!isNaN(amount) && amount > 0 && fanName) {
          newDonations.push({
            id: crypto.randomUUID(),
            fanName: fanName.trim(),
            amount,
            timestamp: new Date()
          });
        }
      }
    }
    
    setDonations(prev => [...newDonations, ...prev]);
    return newDonations.length;
  };

  const clearAllDonations = () => {
    setDonations([]);
  };

  const getTotalGross = () => {
    return donations.reduce((sum, d) => sum + d.amount, 0);
  };

  const getTotalNet = () => {
    return Math.round(getTotalGross() * 0.7); // 70% after YouTube's 30% cut
  };

  const getProgress = () => {
    return Math.min((getTotalNet() / PS5_GOAL) * 100, 100);
  };

  const getRemainingAmount = () => {
    return Math.max(PS5_GOAL - getTotalNet(), 0);
  };

  return {
    donations,
    addDonation,
    updateDonation,
    deleteDonation,
    bulkImport,
    clearAllDonations,
    getTotalGross,
    getTotalNet,
    getProgress,
    getRemainingAmount,
    isGoalReached,
    PS5_GOAL
  };
};