import { useGetUserRequests, useUpdateRequestStatus } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { MessageSquare, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { UserProfile, CollaborationRequest } from '../backend';
import { Variant_rejected_accepted } from '../backend';
import { Separator } from './ui/separator';

interface CollaborationRequestsProps {
  userProfile: UserProfile;
}

export default function CollaborationRequests({ userProfile }: CollaborationRequestsProps) {
  const { data: requests, isLoading } = useGetUserRequests();
  const updateStatus = useUpdateRequestStatus();

  const handleUpdateStatus = async (requestId: bigint, status: Variant_rejected_accepted) => {
    try {
      await updateStatus.mutateAsync({ requestId, status });
      toast.success(`Request ${status}!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update request');
    }
  };

  const sentRequests = requests?.filter((r) => r.sender.toString() === userProfile.id.toString()) || [];
  const receivedRequests = requests?.filter((r) => r.receiver.toString() === userProfile.id.toString()) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  const RequestCard = ({ request, isSent }: { request: CollaborationRequest; isSent: boolean }) => {
    const isPending = request.status === 'pending';
    const isAccepted = request.status === 'accepted';
    const isRejected = request.status === 'rejected';

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">
                {isSent ? 'Sent to' : 'Received from'} {isSent ? request.receiver.toString().slice(0, 10) : request.sender.toString().slice(0, 10)}...
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {new Date(Number(request.createdAt) / 1000000).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge
              variant={isPending ? 'secondary' : isAccepted ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {isPending && <Clock className="h-3 w-3" />}
              {isAccepted && <CheckCircle2 className="h-3 w-3" />}
              {isRejected && <XCircle className="h-3 w-3" />}
              {request.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Message:</div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{request.message}</div>
          </div>
          {!isSent && isPending && (
            <>
              <Separator />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUpdateStatus(request.id, Variant_rejected_accepted.accepted)}
                  disabled={updateStatus.isPending}
                  className="flex-1"
                  variant="default"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(request.id, Variant_rejected_accepted.rejected)}
                  disabled={updateStatus.isPending}
                  className="flex-1"
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs defaultValue="received" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="received">
          Received ({receivedRequests.length})
        </TabsTrigger>
        <TabsTrigger value="sent">
          Sent ({sentRequests.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="received" className="mt-6">
        {receivedRequests.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No requests received</h3>
            <p className="text-muted-foreground">When someone sends you a collaboration request, it will appear here</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {receivedRequests.map((request) => (
              <RequestCard key={request.id.toString()} request={request} isSent={false} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="sent" className="mt-6">
        {sentRequests.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No requests sent</h3>
            <p className="text-muted-foreground">Start browsing and send collaboration requests to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {sentRequests.map((request) => (
              <RequestCard key={request.id.toString()} request={request} isSent={true} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
