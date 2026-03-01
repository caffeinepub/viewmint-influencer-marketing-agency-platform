import { useGetAllInfluencers, useGetAllBrands, useGetAllContactSubmissions, useDeleteUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Users, Building2, Mail, Trash2 } from 'lucide-react';

export default function AdminPanel() {
  const { data: influencers } = useGetAllInfluencers();
  const { data: brands } = useGetAllBrands();
  const { data: contactSubmissions } = useGetAllContactSubmissions();
  const deleteUser = useDeleteUserProfile();

  const handleDeleteUser = async (userId: any) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser.mutateAsync(userId);
      toast.success('User deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{influencers?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brands?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactSubmissions?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="influencers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="influencers">Influencers</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="influencers" className="mt-6">
          <div className="space-y-4">
            {influencers?.map((influencer) => (
              <Card key={influencer.id.toString()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{influencer.influencerProfile?.name}</CardTitle>
                      <CardDescription className="text-xs">{influencer.id.toString()}</CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(influencer.id)}
                      disabled={deleteUser.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {influencer.influencerProfile?.categories.map((cat) => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="brands" className="mt-6">
          <div className="space-y-4">
            {brands?.map((brand) => (
              <Card key={brand.id.toString()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{brand.brandProfile?.companyName}</CardTitle>
                      <CardDescription className="text-xs">{brand.id.toString()}</CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(brand.id)}
                      disabled={deleteUser.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{brand.brandProfile?.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="mt-6">
          <div className="space-y-4">
            {contactSubmissions?.map((submission) => (
              <Card key={submission.id.toString()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{submission.name}</CardTitle>
                      <CardDescription>{submission.email}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {new Date(Number(submission.submittedAt) / 1000000).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{submission.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
