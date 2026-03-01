import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import BrowseInfluencers from '../components/BrowseInfluencers';
import BrowseBrands from '../components/BrowseBrands';
import CollaborationRequests from '../components/CollaborationRequests';
import MyProfile from '../components/MyProfile';
import AdminPanel from '../components/AdminPanel';
import type { UserProfile } from '../backend';
import { UserType } from '../backend';
import { Users, Building2, MessageSquare, User, Shield } from 'lucide-react';

interface DashboardProps {
  userProfile: UserProfile;
  isAdmin: boolean;
}

export default function Dashboard({ userProfile, isAdmin }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('browse');

  const isInfluencer = userProfile.userType === UserType.influencer;
  const isBrand = userProfile.userType === UserType.brand;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {isInfluencer && userProfile.influencerProfile
              ? userProfile.influencerProfile.name
              : isBrand && userProfile.brandProfile
              ? userProfile.brandProfile.companyName
              : 'User'}
          </span>
        </h1>
        <p className="text-muted-foreground">
          {isInfluencer ? 'Discover brands looking for influencers like you' : 'Find the perfect influencers for your campaigns'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-8">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            {isInfluencer ? <Building2 className="h-4 w-4" /> : <Users className="h-4 w-4" />}
            <span className="hidden sm:inline">Browse</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Requests</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin" className="flex items-center gap-2 col-span-2 lg:col-span-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="browse" className="mt-0">
          {isInfluencer ? <BrowseBrands /> : <BrowseInfluencers />}
        </TabsContent>

        <TabsContent value="requests" className="mt-0">
          <CollaborationRequests userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="profile" className="mt-0">
          <MyProfile userProfile={userProfile} />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin" className="mt-0">
            <AdminPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
