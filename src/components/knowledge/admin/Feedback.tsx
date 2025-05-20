
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { MessageSquare, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Feedback {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  status?: string;
  notes?: string;
}

export const FeedbackPage = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      
      // Get feedback items
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add status if it doesn't exist yet (since we're enhancing the existing table)
      const processedFeedback = data?.map(item => ({
        ...item,
        status: item.status || 'new',
        notes: item.notes || ''
      })) || [];
      
      setFeedback(processedFeedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: string) => {
    try {
      // Check if status column exists in the feedback table
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        // If column doesn't exist, we'll get an error
        console.error("Error updating status:", error);
        toast.error("Status feature not available. The 'status' column may not exist in the feedback table.");
        return;
      }
      
      toast.success("Status updated successfully");
      
      // Update local state
      setFeedback(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status } : item
        )
      );
    } catch (error) {
      console.error("Error updating feedback status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleOpenNotes = (item: Feedback) => {
    setSelectedFeedback(item);
    setFeedbackNote(item.notes || '');
    setDialogOpen(true);
  };

  const saveNotes = async () => {
    if (!selectedFeedback) return;
    
    try {
      // Try to update notes - this might fail if the notes column doesn't exist
      const { error } = await supabase
        .from('feedback')
        .update({ notes: feedbackNote })
        .eq('id', selectedFeedback.id);
      
      if (error) {
        console.error("Error saving notes:", error);
        toast.error("Notes feature not available. The 'notes' column may not exist in the feedback table.");
        return;
      }
      
      // Update local state
      setFeedback(prev => 
        prev.map(item => 
          item.id === selectedFeedback.id ? { ...item, notes: feedbackNote } : item
        )
      );
      
      toast.success("Notes saved successfully");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes");
    }
  };

  const exportFeedback = () => {
    try {
      // Filter feedback based on current filters
      let dataToExport = [...feedback];
      
      if (searchQuery) {
        dataToExport = dataToExport.filter(item => 
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        dataToExport = dataToExport.filter(item => item.status === statusFilter);
      }
      
      // Convert to CSV
      const headers = ['ID', 'User ID', 'Content', 'Created At', 'Status', 'Notes'];
      const csvRows = [
        headers.join(','),
        ...dataToExport.map(item => [
          item.id,
          item.user_id,
          `"${item.content.replace(/"/g, '""')}"`, // Escape quotes in content
          new Date(item.created_at).toLocaleString(),
          item.status || 'new',
          `"${(item.notes || '').replace(/"/g, '""')}"`
        ].join(','))
      ];
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `feedback_export_${new Date().toISOString()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting feedback:", error);
      toast.error("Failed to export feedback");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Apply filters
  let filteredFeedback = [...feedback];
  
  if (searchQuery) {
    filteredFeedback = filteredFeedback.filter(item => 
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (statusFilter !== 'all') {
    filteredFeedback = filteredFeedback.filter(item => item.status === statusFilter);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Feedback</h1>
        <p className="text-muted-foreground">Review and manage feedback from users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Management</CardTitle>
          <CardDescription>
            View, filter, and respond to user feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select 
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              className="flex-shrink-0"
              onClick={exportFeedback}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <p className="text-muted-foreground">Loading feedback...</p>
              </div>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto opacity-20 mb-2" />
              <p>No feedback found matching your filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">
                      {item.user_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md truncate">
                        {item.content}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={item.status || 'new'}
                        onValueChange={(value) => updateFeedbackStatus(item.id, value)}
                      >
                        <SelectTrigger className="h-8 w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_review">In Review</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenNotes(item)}
                      >
                        {item.notes ? "Edit Notes" : "Add Notes"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Notes Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Feedback Notes</DialogTitle>
            <DialogDescription>
              Add internal notes for this feedback item.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted p-3 rounded-md mb-2 text-sm">
              <p className="font-medium">Original Feedback:</p>
              <p className="mt-1">{selectedFeedback?.content}</p>
            </div>
            
            <Textarea
              placeholder="Add notes here..."
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveNotes}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackPage;
