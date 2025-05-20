
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

type FeedbackProps = {
  onLogout: (() => void) | (() => Promise<void>);
};

const Feedback = ({ onLogout }: FeedbackProps) => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error("Please enter your feedback before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to submit feedback");
        setIsSubmitting(false);
        return;
      }
      
      // Store feedback in Supabase (you'll need to create a feedback table)
      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        content: feedback,
      });
      
      if (error) {
        handleSupabaseError(error, 'submitting feedback');
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Thank you for your feedback!");
      setFeedback(""); // Clear the textarea
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Submit Feedback</h1>
        <p className="text-muted-foreground">
          We value your input. Please share your thoughts, suggestions, or report any issues you've encountered.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Feedback Form</CardTitle>
            <CardDescription>
              Help us improve Comply by sharing your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium mb-1">
                  Your Feedback
                </label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us what you think about the platform, suggest improvements, or report issues..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Other Ways to Reach Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Email Support</h3>
              <p className="text-sm text-muted-foreground">support@hibuildingcode.com</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone Support</h3>
              <p className="text-sm text-muted-foreground">(808) 555-1234</p>
              <p className="text-xs text-muted-foreground">Monday-Friday, 8:00am-5:00pm HST</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Feedback;
