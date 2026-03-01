import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface BrandProfile {
    campaignRequirements: string;
    description: string;
    companyName: string;
    budget: bigint;
}
export interface SocialMediaMetrics {
    engagementRate: number;
    platform: string;
    followers: bigint;
}
export interface ContactFormSubmission {
    id: bigint;
    name: string;
    submittedAt: Time;
    email: string;
    message: string;
}
export interface InfluencerProfile {
    bio: string;
    categories: Array<string>;
    name: string;
    socialMedia: Array<SocialMediaMetrics>;
    rates: bigint;
}
export interface PortfolioItem {
    id: bigint;
    title: string;
    createdAt: Time;
    description: string;
    image: ExternalBlob;
    influencerId: Principal;
}
export interface CollaborationRequest {
    id: bigint;
    status: Variant_pending_rejected_accepted;
    createdAt: Time;
    sender: Principal;
    message: string;
    receiver: Principal;
}
export interface UserProfile {
    id: Principal;
    userType: UserType;
    brandProfile?: BrandProfile;
    createdAt: Time;
    influencerProfile?: InfluencerProfile;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserType {
    influencer = "influencer",
    brand = "brand"
}
export enum Variant_pending_rejected_accepted {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum Variant_rejected_accepted {
    rejected = "rejected",
    accepted = "accepted"
}
export interface backendInterface {
    addPortfolioItem(title: string, description: string, image: ExternalBlob): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createUserProfile(userType: UserType, influencerProfile: InfluencerProfile | null, brandProfile: BrandProfile | null): Promise<void>;
    deleteCollaborationRequest(requestId: bigint): Promise<void>;
    deletePortfolioItem(itemId: bigint): Promise<void>;
    deleteUserProfile(userId: Principal): Promise<void>;
    getAllBrands(): Promise<Array<UserProfile>>;
    getAllContactSubmissions(): Promise<Array<ContactFormSubmission>>;
    getAllInfluencers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPortfolioItems(influencerId: Principal): Promise<Array<PortfolioItem>>;
    getUserProfile(userId: Principal): Promise<UserProfile | null>;
    getUserRequests(userId: Principal): Promise<Array<CollaborationRequest>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(userType: UserType, influencerProfile: InfluencerProfile | null, brandProfile: BrandProfile | null): Promise<void>;
    sendCollaborationRequest(receiver: Principal, message: string): Promise<bigint>;
    submitContactForm(name: string, email: string, message: string): Promise<bigint>;
    updateRequestStatus(requestId: bigint, status: Variant_rejected_accepted): Promise<void>;
    updateUserProfile(influencerProfile: InfluencerProfile | null, brandProfile: BrandProfile | null): Promise<void>;
}
