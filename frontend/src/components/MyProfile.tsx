import { useState } from 'react';
import { useUpdateUserProfile, useGetPortfolioItems, useAddPortfolioItem, useDeletePortfolioItem } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Edit, Plus, Trash2 } from 'lucide-react';
import type { UserProfile, InfluencerProfile, BrandProfile } from '../backend';
import { UserType, ExternalBlob } from '../backend';

interface MyProfileProps {
  userProfile: UserProfile;
}

export default function MyProfile({ userProfile }: MyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const updateProfile = useUpdateUserProfile();
  const addPortfolio = useAddPortfolioItem();
  const deletePortfolio = useDeletePortfolioItem();

  const isInfluencer = userProfile.userType === UserType.influencer;
  const { data: portfolioItems } = useGetPortfolioItems(isInfluencer ? userProfile.id : null);

  // Influencer fields
  const [name, setName] = useState(userProfile.influencerProfile?.name || '');
  const [bio, setBio] = useState(userProfile.influencerProfile?.bio || '');
  const [categories, setCategories] = useState(userProfile.influencerProfile?.categories.join(', ') || '');
  const [rates, setRates] = useState(userProfile.influencerProfile?.rates.toString() || '');
  const [platform, setPlatform] = useState(userProfile.influencerProfile?.socialMedia[0]?.platform || '');
  const [followers, setFollowers] = useState(userProfile.influencerProfile?.socialMedia[0]?.followers.toString() || '');
  const [engagementRate, setEngagementRate] = useState(userProfile.influencerProfile?.socialMedia[0]?.engagementRate.toString() || '');

  // Brand fields
  const [companyName, setCompanyName] = useState(userProfile.brandProfile?.companyName || '');
  const [description, setDescription] = useState(userProfile.brandProfile?.description || '');
  const [campaignRequirements, setCampaignRequirements] = useState(userProfile.brandProfile?.campaignRequirements || '');
  const [budget, setBudget] = useState(userProfile.brandProfile?.budget.toString() || '');

  // Portfolio fields
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [portfolioImage, setPortfolioImage] = useState<File | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let influencerProfile: InfluencerProfile | null = null;
      let brandProfile: BrandProfile | null = null;

      if (isInfluencer) {
        influencerProfile = {
          name,
          bio,
          categories: categories.split(',').map((c) => c.trim()),
          rates: BigInt(rates),
          socialMedia: [
            {
              platform,
              followers: BigInt(followers),
              engagementRate: parseFloat(engagementRate),
            },
          ],
        };
      } else {
        brandProfile = {
          companyName,
          description,
          campaignRequirements,
          budget: BigInt(budget),
        };
      }

      await updateProfile.mutateAsync({ influencerProfile, brandProfile });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!portfolioImage) {
      toast.error('Please select an image');
      return;
    }

    try {
      const arrayBuffer = await portfolioImage.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      await addPortfolio.mutateAsync({
        title: portfolioTitle,
        description: portfolioDescription,
        image: blob,
      });

      toast.success('Portfolio item added!');
      setShowAddPortfolio(false);
      setPortfolioTitle('');
      setPortfolioDescription('');
      setPortfolioImage(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add portfolio item');
    }
  };

  const handleDeletePortfolio = async (itemId: bigint) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      await deletePortfolio.mutateAsync(itemId);
      toast.success('Portfolio item deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete portfolio item');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {isInfluencer ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-bio">Bio</Label>
                    <Textarea id="edit-bio" value={bio} onChange={(e) => setBio(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-categories">Categories (comma-separated)</Label>
                    <Input id="edit-categories" value={categories} onChange={(e) => setCategories(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-rates">Rate per Post (USD)</Label>
                    <Input id="edit-rates" type="number" value={rates} onChange={(e) => setRates(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-platform">Primary Platform</Label>
                    <Select value={platform} onValueChange={setPlatform} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-followers">Followers</Label>
                      <Input id="edit-followers" type="number" value={followers} onChange={(e) => setFollowers(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-engagement">Engagement Rate (%)</Label>
                      <Input id="edit-engagement" type="number" step="0.01" value={engagementRate} onChange={(e) => setEngagementRate(e.target.value)} required />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-company">Company Name</Label>
                    <Input id="edit-company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-requirements">Campaign Requirements</Label>
                    <Textarea id="edit-requirements" value={campaignRequirements} onChange={(e) => setCampaignRequirements(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-budget">Budget (USD)</Label>
                    <Input id="edit-budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} required />
                  </div>
                </>
              )}
              <Button type="submit" disabled={updateProfile.isPending} className="w-full">
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              {isInfluencer && userProfile.influencerProfile ? (
                <>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Name</div>
                    <div className="text-lg font-semibold">{userProfile.influencerProfile.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Bio</div>
                    <div>{userProfile.influencerProfile.bio}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Categories</div>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.influencerProfile.categories.map((cat) => (
                        <Badge key={cat} variant="secondary">{cat}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Rate per Post</div>
                      <div className="text-lg font-semibold text-green-600">${userProfile.influencerProfile.rates.toString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Platform</div>
                      <div className="text-lg font-semibold">{userProfile.influencerProfile.socialMedia[0]?.platform}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Followers</div>
                      <div className="text-lg font-semibold">{userProfile.influencerProfile.socialMedia[0]?.followers.toString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Engagement Rate</div>
                      <div className="text-lg font-semibold">{userProfile.influencerProfile.socialMedia[0]?.engagementRate.toFixed(1)}%</div>
                    </div>
                  </div>
                </>
              ) : userProfile.brandProfile ? (
                <>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Company Name</div>
                    <div className="text-lg font-semibold">{userProfile.brandProfile.companyName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
                    <div>{userProfile.brandProfile.description}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Campaign Requirements</div>
                    <div>{userProfile.brandProfile.campaignRequirements}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Budget</div>
                    <div className="text-lg font-semibold text-green-600">${userProfile.brandProfile.budget.toString()}</div>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {isInfluencer && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Showcase your best work</CardDescription>
              </div>
              <Button onClick={() => setShowAddPortfolio(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {portfolioItems && portfolioItems.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioItems.map((item) => (
                  <Card key={item.id.toString()} className="overflow-hidden">
                    <img
                      src={item.image.getDirectURL()}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePortfolio(item.id)}
                        disabled={deletePortfolio.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No portfolio items yet. Add your first one!
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showAddPortfolio} onOpenChange={setShowAddPortfolio}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Portfolio Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPortfolio} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio-title">Title</Label>
              <Input
                id="portfolio-title"
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio-description">Description</Label>
              <Textarea
                id="portfolio-description"
                value={portfolioDescription}
                onChange={(e) => setPortfolioDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio-image">Image</Label>
              <Input
                id="portfolio-image"
                type="file"
                accept="image/*"
                onChange={(e) => setPortfolioImage(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAddPortfolio(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={addPortfolio.isPending} className="flex-1">
                {addPortfolio.isPending ? 'Adding...' : 'Add Item'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
