import { useState } from 'react';
import { useGetAllBrands, useSendCollaborationRequest } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Building2, DollarSign, MessageSquare, Target } from 'lucide-react';
import type { UserProfile } from '../backend';

export default function BrowseBrands() {
  const { data: brands, isLoading } = useGetAllBrands();
  const [selectedBrand, setSelectedBrand] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState('');
  const sendRequest = useSendCollaborationRequest();

  const handleSendRequest = async () => {
    if (!selectedBrand || !message) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await sendRequest.mutateAsync({
        receiver: selectedBrand.id,
        message,
      });
      toast.success('Collaboration request sent!');
      setSelectedBrand(null);
      setMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send request');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading brands...</p>
        </div>
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No brands yet</h3>
        <p className="text-muted-foreground">Check back soon for new opportunities!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => {
          const profile = brand.brandProfile;
          if (!profile) return null;

          return (
            <Card key={brand.id.toString()} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.companyName.charAt(0).toUpperCase()}
                  </div>
                  <Badge variant="secondary">Brand</Badge>
                </div>
                <CardTitle>{profile.companyName}</CardTitle>
                <CardDescription className="line-clamp-2">{profile.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium mb-1">Campaign Requirements</div>
                      <div className="text-sm text-muted-foreground line-clamp-3">
                        {profile.campaignRequirements}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600">${profile.budget.toString()}</span>
                  <span className="text-xs text-muted-foreground">budget</span>
                </div>
                <Button
                  onClick={() => setSelectedBrand(brand)}
                  className="w-full"
                  variant="default"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedBrand} onOpenChange={() => setSelectedBrand(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Collaboration</DialogTitle>
            <DialogDescription>
              Send a message to {selectedBrand?.brandProfile?.companyName} about why you're a great fit
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="request-message">Your Pitch</Label>
              <Textarea
                id="request-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell them about your audience, content style, and why you'd be perfect for their campaign..."
                rows={5}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedBrand(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSendRequest} disabled={sendRequest.isPending} className="flex-1">
                {sendRequest.isPending ? 'Sending...' : 'Send Application'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
