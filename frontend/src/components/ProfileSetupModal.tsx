import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import type { InfluencerProfile, BrandProfile } from '../backend';
import { UserType } from '../backend';

export default function ProfileSetupModal() {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [step, setStep] = useState<'type' | 'details'>('type');

  // Influencer fields
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [categories, setCategories] = useState('');
  const [rates, setRates] = useState('');
  const [platform, setPlatform] = useState('');
  const [followers, setFollowers] = useState('');
  const [engagementRate, setEngagementRate] = useState('');

  // Brand fields
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [campaignRequirements, setCampaignRequirements] = useState('');
  const [budget, setBudget] = useState('');

  const saveProfile = useSaveCallerUserProfile();

  const handleTypeSelection = (type: UserType) => {
    setUserType(type);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userType) return;

    try {
      let influencerProfile: InfluencerProfile | null = null;
      let brandProfile: BrandProfile | null = null;

      if (userType === UserType.influencer) {
        if (!name || !bio || !categories || !rates || !platform || !followers || !engagementRate) {
          toast.error('Please fill in all fields');
          return;
        }

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
        if (!companyName || !description || !campaignRequirements || !budget) {
          toast.error('Please fill in all fields');
          return;
        }

        brandProfile = {
          companyName,
          description,
          campaignRequirements,
          budget: BigInt(budget),
        };
      }

      await saveProfile.mutateAsync({ userType, influencerProfile, brandProfile });
      toast.success('Profile created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Viewmint!</DialogTitle>
          <DialogDescription>
            {step === 'type'
              ? 'Choose your account type to get started'
              : `Complete your ${userType === UserType.influencer ? 'influencer' : 'brand'} profile`}
          </DialogDescription>
        </DialogHeader>

        {step === 'type' ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-32 flex flex-col gap-2"
              onClick={() => handleTypeSelection(UserType.influencer)}
            >
              <span className="text-4xl">🎭</span>
              <span className="font-semibold">Influencer</span>
              <span className="text-xs text-muted-foreground">Showcase your reach</span>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex flex-col gap-2"
              onClick={() => handleTypeSelection(UserType.brand)}
            >
              <span className="text-4xl">🏢</span>
              <span className="font-semibold">Brand</span>
              <span className="text-xs text-muted-foreground">Find influencers</span>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === UserType.influencer ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categories">Categories * (comma-separated)</Label>
                  <Input
                    id="categories"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    placeholder="Fashion, Lifestyle, Tech"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rates">Rate per Post (USD) *</Label>
                  <Input
                    id="rates"
                    type="number"
                    value={rates}
                    onChange={(e) => setRates(e.target.value)}
                    placeholder="500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Primary Platform *</Label>
                  <Select value={platform} onValueChange={setPlatform} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
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
                    <Label htmlFor="followers">Followers *</Label>
                    <Input
                      id="followers"
                      type="number"
                      value={followers}
                      onChange={(e) => setFollowers(e.target.value)}
                      placeholder="10000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engagement">Engagement Rate (%) *</Label>
                    <Input
                      id="engagement"
                      type="number"
                      step="0.01"
                      value={engagementRate}
                      onChange={(e) => setEngagementRate(e.target.value)}
                      placeholder="3.5"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about your brand"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignRequirements">Campaign Requirements *</Label>
                  <Textarea
                    id="campaignRequirements"
                    value={campaignRequirements}
                    onChange={(e) => setCampaignRequirements(e.target.value)}
                    placeholder="What are you looking for in influencers?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="5000"
                    required
                  />
                </div>
              </>
            )}
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setStep('type')} className="flex-1">
                Back
              </Button>
              <Button type="submit" disabled={saveProfile.isPending} className="flex-1">
                {saveProfile.isPending ? 'Creating...' : 'Create Profile'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
