import { useState, useEffect } from 'react';

export interface Donation {
  id: string;
  fanName: string;
  amount: number;
  timestamp: Date;
  donationCount: number; // Track how many times this person has donated
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
          timestamp: new Date(d.timestamp),
          donationCount: d.donationCount || 1 // Backward compatibility
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
    const trimmedName = fanName.trim().toLowerCase();
    
    setDonations(prev => {
      // Check if user already exists (case-insensitive)
      const existingDonation = prev.find(d => d.fanName.toLowerCase() === trimmedName);
      
      if (existingDonation) {
        // Update existing donation
        return prev.map(d => 
          d.id === existingDonation.id 
            ? { 
                ...d, 
                amount: d.amount + amount,
                donationCount: d.donationCount + 1,
                timestamp: new Date() // Update timestamp to latest donation
              }
            : d
        );
      } else {
        // Create new donation
        const newDonation: Donation = {
          id: crypto.randomUUID(),
          fanName: fanName.trim(),
          amount,
          timestamp: new Date(),
          donationCount: 1
        };
        return [newDonation, ...prev];
      }
    });
    
    // Return the added amount for notification purposes
    return { fanName: fanName.trim(), amount };
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
    let processedCount = 0;
    
    setDonations(prev => {
      let updatedDonations = [...prev];
      
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          const amount = parseInt(parts[parts.length - 1]);
          const fanName = parts.slice(0, -1).join(' ');
          
          if (!isNaN(amount) && amount > 0 && fanName) {
            const trimmedName = fanName.trim().toLowerCase();
            const existingIndex = updatedDonations.findIndex(d => d.fanName.toLowerCase() === trimmedName);
            
            if (existingIndex >= 0) {
              // Update existing donation
              updatedDonations[existingIndex] = {
                ...updatedDonations[existingIndex],
                amount: updatedDonations[existingIndex].amount + amount,
                donationCount: updatedDonations[existingIndex].donationCount + 1,
                timestamp: new Date()
              };
            } else {
              // Create new donation
              const newDonation: Donation = {
                id: crypto.randomUUID(),
                fanName: fanName.trim(),
                amount,
                timestamp: new Date(),
                donationCount: 1
              };
              updatedDonations.unshift(newDonation);
            }
            processedCount++;
          }
        }
      }
      
      return updatedDonations;
    });
    
    return processedCount;
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