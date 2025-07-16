import { useDonations } from "@/hooks/useDonations";
import { useNotifications } from "@/hooks/useNotifications";
import { ProgressBar } from "@/components/ProgressBar";
import { DonationForm } from "@/components/DonationForm";
import { DonationList } from "@/components/DonationList";
import { BulkImportModal } from "@/components/BulkImportModal";
import { GoalCelebration } from "@/components/GoalCelebration";
import { NotificationBar } from "@/components/NotificationBar";
import { StatsCards } from "@/components/StatsCards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Download } from "lucide-react";

const Index = () => {
  const {
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
  } = useDonations();

  const { notifications, addNotification, removeNotification } = useNotifications();

  const handleAddDonation = (fanName: string, amount: number) => {
    const result = addDonation(fanName, amount);
    const existingDonation = donations.find(d => d.fanName.toLowerCase() === fanName.trim().toLowerCase());
    
    if (existingDonation) {
      addNotification(
        `₹${amount.toLocaleString()} added to ${result.fanName} (Total: ₹${(existingDonation.amount + amount).toLocaleString()})`, 
        'success'
      );
    } else {
      addNotification(
        `₹${amount.toLocaleString()} added from ${result.fanName}`, 
        'success'
      );
    }
  };

  const handleBulkImport = (text: string) => {
    return bulkImport(text);
  };

  const handleBulkImportSuccess = (count: number) => {
    addNotification(
      `Successfully imported ${count} donation${count === 1 ? '' : 's'}!`, 
      'success'
    );
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all donations? This cannot be undone.')) {
      clearAllDonations();
      addNotification('All donations cleared', 'info');
    }
  };

  const handleUpdateDonation = (id: string, fanName: string, amount: number) => {
    updateDonation(id, fanName, amount);
    addNotification('Donation updated successfully', 'success');
  };

  const handleDeleteDonation = (id: string) => {
    const donation = donations.find(d => d.id === id);
    if (donation && confirm(`Delete donation from ${donation.fanName}?`)) {
      deleteDonation(id);
      addNotification('Donation deleted', 'info');
    }
  };

  const exportToCSV = () => {
    const headers = ['Fan Name', 'Amount', 'Date', 'Time'];
    const rows = donations.map(d => [
      d.fanName,
      d.amount.toString(),
      d.timestamp.toLocaleDateString(),
      d.timestamp.toLocaleTimeString()
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jaiyaxh-donations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    addNotification('Donations exported to CSV', 'success');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">
              Jaiyaxh PS5 Fund Calculator
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track superchat donations and progress towards the PlayStation 5 goal. 
            All data is stored locally in your browser.
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards 
          totalGross={getTotalGross()}
          totalNet={getTotalNet()}
          donationCount={donations.length}
          remaining={getRemainingAmount()}
        />

        {/* Progress Bar */}
        <ProgressBar 
          current={getTotalNet()}
          goal={PS5_GOAL}
          progress={getProgress()}
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <BulkImportModal 
            onImport={handleBulkImport}
            onSuccess={handleBulkImportSuccess}
          />
          
          {donations.length > 0 && (
            <>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={handleClearAll}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </>
          )}
        </div>

        {/* Add Donation Form */}
        <DonationForm onAdd={handleAddDonation} />

        {/* Donations List */}
        <DonationList 
          donations={donations}
          onUpdate={handleUpdateDonation}
          onDelete={handleDeleteDonation}
        />

        {/* Privacy Note */}
        <Card className="glass-card p-4 mt-6 text-center text-sm text-muted-foreground">
          🔒 Privacy: All data is stored locally in your browser. No information is sent to external servers.
        </Card>
      </div>

      {/* Goal Celebration */}
      <GoalCelebration isVisible={isGoalReached} />

      {/* Notifications */}
      <NotificationBar 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default Index;
