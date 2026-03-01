import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  UserProfile,
  UserType,
  InfluencerProfile,
  BrandProfile,
  CollaborationRequest,
  ContactFormSubmission,
  PortfolioItem,
  Variant_rejected_accepted,
} from '../backend';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userType,
      influencerProfile,
      brandProfile,
    }: {
      userType: UserType;
      influencerProfile: InfluencerProfile | null;
      brandProfile: BrandProfile | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(userType, influencerProfile, brandProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      influencerProfile,
      brandProfile,
    }: {
      influencerProfile: InfluencerProfile | null;
      brandProfile: BrandProfile | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserProfile(influencerProfile, brandProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Browse Queries
export function useGetAllInfluencers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['influencers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInfluencers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBrands() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBrands();
    },
    enabled: !!actor && !isFetching,
  });
}

// Collaboration Requests
export function useSendCollaborationRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiver, message }: { receiver: Principal; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendCollaborationRequest(receiver, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
    },
  });
}

export function useGetUserRequests() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CollaborationRequest[]>({
    queryKey: ['userRequests', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserRequests(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useUpdateRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: bigint;
      status: Variant_rejected_accepted;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRequestStatus(requestId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
    },
  });
}

// Contact Form
export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm(name, email, message);
    },
  });
}

export function useGetAllContactSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactFormSubmission[]>({
    queryKey: ['contactSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

// Portfolio
export function useAddPortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      image,
    }: {
      title: string;
      description: string;
      image: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPortfolioItem(title, description, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
    },
  });
}

export function useGetPortfolioItems(influencerId: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PortfolioItem[]>({
    queryKey: ['portfolioItems', influencerId?.toString()],
    queryFn: async () => {
      if (!actor || !influencerId) return [];
      return actor.getPortfolioItems(influencerId);
    },
    enabled: !!actor && !isFetching && !!influencerId,
  });
}

export function useDeletePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePortfolioItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteUserProfile(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['influencers'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}

export function useDeleteCollaborationRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCollaborationRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
    },
  });
}
