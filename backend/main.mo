import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Types
  public type UserType = { #influencer; #brand };

  public type SocialMediaMetrics = {
    followers : Nat;
    engagementRate : Float;
    platform : Text;
  };

  public type InfluencerProfile = {
    name : Text;
    bio : Text;
    categories : [Text];
    rates : Nat;
    socialMedia : [SocialMediaMetrics];
  };

  public type BrandProfile = {
    companyName : Text;
    description : Text;
    campaignRequirements : Text;
    budget : Nat;
  };

  public type UserProfile = {
    id : Principal;
    userType : UserType;
    influencerProfile : ?InfluencerProfile;
    brandProfile : ?BrandProfile;
    createdAt : Time.Time;
  };

  public type CollaborationRequest = {
    id : Nat;
    sender : Principal;
    receiver : Principal;
    message : Text;
    status : { #pending; #accepted; #rejected };
    createdAt : Time.Time;
  };

  public type ContactFormSubmission = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    submittedAt : Time.Time;
  };

  public type PortfolioItem = {
    id : Nat;
    influencerId : Principal;
    title : Text;
    description : Text;
    image : Storage.ExternalBlob;
    createdAt : Time.Time;
  };

  // Comparison modules
  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Text.compare(a.id.toText(), b.id.toText());
    };
  };

  module CollaborationRequest {
    public func compare(a : CollaborationRequest, b : CollaborationRequest) : Order.Order {
      if (a.id < b.id) { #less } else if (a.id > b.id) { #greater } else {
        #equal;
      };
    };
  };

  module ContactFormSubmission {
    public func compare(a : ContactFormSubmission, b : ContactFormSubmission) : Order.Order {
      if (a.id < b.id) { #less } else if (a.id > b.id) { #greater } else {
        #equal;
      };
    };
  };

  module PortfolioItem {
    public func compare(a : PortfolioItem, b : PortfolioItem) : Order.Order {
      if (a.id < b.id) { #less } else if (a.id > b.id) { #greater } else {
        #equal;
      };
    };
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let collaborationRequests = Map.empty<Nat, CollaborationRequest>();
  let contactFormSubmissions = Map.empty<Nat, ContactFormSubmission>();
  let portfolioItems = Map.empty<Nat, PortfolioItem>();

  var nextRequestId = 1;
  var nextContactId = 1;
  var nextPortfolioId = 1;

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Required Profile Functions for Frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(userType : UserType, influencerProfile : ?InfluencerProfile, brandProfile : ?BrandProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        // Create new profile
        let profile : UserProfile = {
          id = caller;
          userType;
          influencerProfile;
          brandProfile;
          createdAt = Time.now();
        };
        userProfiles.add(caller, profile);
      };
      case (?existingProfile) {
        // Update existing profile
        let updatedProfile : UserProfile = {
          existingProfile with
          userType;
          influencerProfile;
          brandProfile;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // User Profile Management
  public shared ({ caller }) func createUserProfile(userType : UserType, influencerProfile : ?InfluencerProfile, brandProfile : ?BrandProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User profile already exists");
    };

    let profile : UserProfile = {
      id = caller;
      userType;
      influencerProfile;
      brandProfile;
      createdAt = Time.now();
    };

    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateUserProfile(influencerProfile : ?InfluencerProfile, brandProfile : ?BrandProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          existingProfile with
          influencerProfile;
          brandProfile;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getUserProfile(userId : Principal) : async ?UserProfile {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless admin");
    };
    userProfiles.get(userId);
  };

  public query ({ caller }) func getAllInfluencers() : async [UserProfile] {
    // Public browsing allowed - no auth check needed
    userProfiles.values().toArray().filter(
      func(profile) {
        profile.userType == #influencer;
      }
    ).sort();
  };

  public query ({ caller }) func getAllBrands() : async [UserProfile] {
    // Public browsing allowed - no auth check needed
    userProfiles.values().toArray().filter(
      func(profile) {
        profile.userType == #brand;
      }
    ).sort();
  };

  // Collaboration Requests
  public shared ({ caller }) func sendCollaborationRequest(receiver : Principal, message : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send collaboration requests");
    };

    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("Sender profile not found");
    };

    if (not userProfiles.containsKey(receiver)) {
      Runtime.trap("Receiver profile not found");
    };

    let request : CollaborationRequest = {
      id = nextRequestId;
      sender = caller;
      receiver;
      message;
      status = #pending;
      createdAt = Time.now();
    };

    collaborationRequests.add(nextRequestId, request);
    nextRequestId += 1;
    request.id;
  };

  public shared ({ caller }) func updateRequestStatus(requestId : Nat, status : { #accepted; #rejected }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update request status");
    };

    switch (collaborationRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.receiver != caller) {
          Runtime.trap("Only the receiver can update the request status");
        };

        let updatedRequest : CollaborationRequest = {
          request with
          status;
        };
        collaborationRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getUserRequests(userId : Principal) : async [CollaborationRequest] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own requests unless admin");
    };

    collaborationRequests.values().toArray().filter(
      func(request) {
        request.sender == userId or request.receiver == userId;
      }
    ).sort();
  };

  // Contact Form
  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async Nat {
    // Public function - guests can submit contact forms, no auth check needed
    let submission : ContactFormSubmission = {
      id = nextContactId;
      name;
      email;
      message;
      submittedAt = Time.now();
    };

    contactFormSubmissions.add(nextContactId, submission);
    nextContactId += 1;
    submission.id;
  };

  public query ({ caller }) func getAllContactSubmissions() : async [ContactFormSubmission] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view contact submissions");
    };
    contactFormSubmissions.values().toArray().sort();
  };

  // Portfolio Management
  public shared ({ caller }) func addPortfolioItem(title : Text, description : Text, image : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add portfolio items");
    };

    let item : PortfolioItem = {
      id = nextPortfolioId;
      influencerId = caller;
      title;
      description;
      image;
      createdAt = Time.now();
    };

    portfolioItems.add(nextPortfolioId, item);
    nextPortfolioId += 1;
    item.id;
  };

  public query ({ caller }) func getPortfolioItems(influencerId : Principal) : async [PortfolioItem] {
    // Public browsing allowed - no auth check needed
    portfolioItems.values().toArray().filter(
      func(item) {
        item.influencerId == influencerId;
      }
    ).sort();
  };

  public shared ({ caller }) func deletePortfolioItem(itemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete portfolio items");
    };

    switch (portfolioItems.get(itemId)) {
      case (null) { Runtime.trap("Portfolio item not found") };
      case (?item) {
        if (item.influencerId != caller) {
          Runtime.trap("Only the owner can delete this portfolio item");
        };
        portfolioItems.remove(itemId);
      };
    };
  };

  // Admin Functions
  public shared ({ caller }) func deleteUserProfile(userId : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete user profiles");
    };

    if (not userProfiles.containsKey(userId)) {
      Runtime.trap("User profile not found");
    };

    userProfiles.remove(userId);
  };

  public shared ({ caller }) func deleteCollaborationRequest(requestId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete collaboration requests");
    };

    if (not collaborationRequests.containsKey(requestId)) {
      Runtime.trap("Request not found");
    };

    collaborationRequests.remove(requestId);
  };
};
