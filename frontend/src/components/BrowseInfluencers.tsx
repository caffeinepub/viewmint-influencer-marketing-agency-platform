import { useState } from 'react';
import { useGetAllInfluencers, useSendCollaborationRequest } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Users, TrendingUp, DollarSign, MessageSquare } from 'lucide-react';
import type { UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

export default function BrowseInfluencers() {
  const { data: influencers, isLoading } = useGetAllInfluencers();
  const [selectedInfluencer, setSelectedInfluencer] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState('');
  const sendRequest = useSendCollaborationRequest();

  const handleSendRequest = async () => {
    if (!selectedInfluencer || !message) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await sendRequest.mutateAsync({
        receiver: selectedInfluencer.id,
        message,
      });
      toast.success('Collaboration request sent!');
      setSelectedInfluencer(null);
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
          <p className="text-muted-foreground">Loading influencers...</p>
        </div>
      </div>
    );
  }

  if (!influencers || influencers.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No influencers yet</h3>
        <p className="text-muted-foreground">Check back soon for new influencers!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {influencers.map((influencer) => {
          const profile = influencer.influencerProfile;
          if (!profile) return null;

          const primarySocial = profile.socialMedia[0];

          return (
            <Card key={influencer.id.toString()} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <Badge variant="secondary">{primarySocial?.platform || 'Social Media'}</Badge>
                </div>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription className="line-clamp-2">{profile.bio}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.categories.map((cat) => (
                    <Badge key={cat} variant="outline">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{primarySocial?.followers.toString() || '0'}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{primarySocial?.engagementRate.toFixed(1) || '0'}%</div>
                      <div className="text-xs text-muted-foreground">Engagement</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600">${profile.rates.toString()}</span>
                  <span className="text-xs text-muted-foreground">per post</span>
                </div>
                <Button
                  onClick={() => setSelectedInfluencer(influencer)}
                  className="w-full"
                  variant="default"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedInfluencer} onOpenChange={() => setSelectedInfluencer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Collaboration Request</DialogTitle>
            <DialogDescription>
              Send a message to {selectedInfluencer?.influencerProfile?.name} about your collaboration opportunity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="request-message">Your Message</Label>
              <Textarea
                id="request-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell them about your campaign and why you'd like to collaborate..."
                rows={5}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedInfluencer(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSendRequest} disabled={sendRequest.isPending} className="flex-1">
                {sendRequest.isPending ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
