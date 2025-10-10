import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Vote,
  UserPlus,
  Trophy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Shield,
  Search,
  Check,
} from "lucide-react";
import pageBg from "@/assets/page-bg.png";
import {
  useCouncilCampaigns,
  useCouncilNominees,
  useMyNomination,
  useMyVote,
  useNominateUser,
  useVoteForNominee,
  type Campaign,
} from "@/hooks/useCouncilCampaigns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDiscordRoles } from "@/hooks/useDiscordRoles";
import { siteConfig } from "@/config/site";
import { useDiscordUsers, getDisplayName } from "@/hooks/useDiscordUsers";
import { ScrollArea } from "@/components/ui/scroll-area";

const Campaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [discordUserId, setDiscordUserId] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showNominateDialog, setShowNominateDialog] = useState(false);
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user's Discord roles
  const { data: rolesData } = useDiscordRoles(discordUserId);

  // Fetch Discord users for nomination
  const { data: discordUsers, isLoading: usersLoading } = useDiscordUsers();

  // Check if user is Senior Admin (by role ID)
  // Note: roles is an object, so we need to convert it to an array
  const isSeniorAdmin = rolesData?.roles
    ? Object.values(rolesData.roles).some(
        (role) => role.id === siteConfig.seniorAdminRoleId
      )
    : false;

  // Fetch campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useCouncilCampaigns({
    include_closed: true,
  });

  // Fetch nominees for selected campaign
  const { data: nominees, isLoading: nomineesLoading } = useCouncilNominees(
    selectedCampaign?.id || null
  );

  // Fetch user's nomination and vote
  const { data: myNomination } = useMyNomination(selectedCampaign?.id || null);
  const { data: myVote } = useMyVote(selectedCampaign?.id || null);

  // Mutations
  const nominateMutation = useNominateUser();
  const voteMutation = useVoteForNominee();

  // Get authenticated user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) {
        const discordId =
          session.user.user_metadata?.provider_id ||
          session.user.user_metadata?.sub ||
          session.user.identities?.[0]?.id;
        setDiscordUserId(discordId);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        const discordId =
          session.user.user_metadata?.provider_id ||
          session.user.user_metadata?.sub ||
          session.user.identities?.[0]?.id;
        setDiscordUserId(discordId);
      } else {
        setDiscordUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-select first active campaign
  useEffect(() => {
    if (campaigns && !selectedCampaign) {
      const activeCampaign = campaigns.find(
        (c) =>
          c.status === "nominations_open" ||
          c.status === "voting_open"
      ) || campaigns[0];
      setSelectedCampaign(activeCampaign);
    }
  }, [campaigns, selectedCampaign]);

  const handleNominate = async () => {
    if (!selectedCampaign || !selectedUserId) return;

    const selectedUser = discordUsers?.find(u => u.id === selectedUserId);
    const displayName = selectedUser ? getDisplayName(selectedUser) : selectedUserId;

    try {
      await nominateMutation.mutateAsync({
        campaignId: selectedCampaign.id,
        nomineeDiscordId: selectedUserId,
      });

      toast({
        title: "Nomination Successful!",
        description: `You have nominated ${displayName} for ${selectedCampaign.title}`,
        duration: 3000,
      });

      setShowNominateDialog(false);
      setSelectedUserId("");
      setSearchQuery("");
    } catch (error) {
      toast({
        title: "Nomination Failed",
        description: error instanceof Error ? error.message : "Failed to nominate",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleVote = async (nomineeId: string) => {
    if (!selectedCampaign) return;

    try {
      await voteMutation.mutateAsync({
        campaignId: selectedCampaign.id,
        nomineeDiscordId: nomineeId,
      });

      toast({
        title: "Vote Cast!",
        description: `Your vote has been recorded for ${selectedCampaign.title}`,
        duration: 3000,
      });

      setShowVoteDialog(false);
    } catch (error) {
      toast({
        title: "Vote Failed",
        description: error instanceof Error ? error.message : "Failed to vote",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-500/20 text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case "nominations_open":
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
            <UserPlus className="w-3 h-3 mr-1" />
            Nominations Open
          </Badge>
        );
      case "voting_open":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-400">
            <Vote className="w-3 h-3 mr-1" />
            Voting Open
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-400">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Closed
          </Badge>
        );
    }
  };

  if (campaignsLoading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: `url(${pageBg})` }}
      >
        <div className="relative z-10">
          <Navigation />
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${pageBg})` }}
    >
      <div className="relative z-10">
        <Navigation />

        <main className="container mx-auto px-4 pt-40 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-heading font-bold mb-2">
                  <span className="text-neon-cyan">Campaign </span>
                  <span className="text-neon-magenta">Elections</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Participate in city elections and governance
                </p>
              </div>

              {isSeniorAdmin && (
                <Button
                  onClick={() => navigate("/campaigns/admin")}
                  className="bg-gradient-purple-blue hover:shadow-neon-purple transition-all duration-300"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              )}
            </div>

            {campaigns && campaigns.length === 0 ? (
              <Card className="bg-card/90 backdrop-blur-sm border-primary/30">
                <CardContent className="pt-6 text-center py-12">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No campaigns are currently active.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Campaign Selector */}
                <div className="mb-6">
                  <Tabs
                    value={selectedCampaign?.id.toString()}
                    onValueChange={(value) => {
                      const campaign = campaigns?.find(
                        (c) => c.id.toString() === value
                      );
                      setSelectedCampaign(campaign || null);
                    }}
                  >
                    <TabsList className="bg-card/90 backdrop-blur-sm border border-primary/30">
                      {campaigns?.map((campaign) => (
                        <TabsTrigger
                          key={campaign.id}
                          value={campaign.id.toString()}
                          className="data-[state=active]:bg-primary/20"
                        >
                          {campaign.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Campaign Details */}
                {selectedCampaign && (
                  <div className="space-y-6">
                    {/* Campaign Info Card */}
                    <Card className="bg-card/90 backdrop-blur-sm border-primary/30">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl">
                            {selectedCampaign.title}
                          </CardTitle>
                          {getStatusBadge(selectedCampaign.status)}
                        </div>
                        {selectedCampaign.description && (
                          <CardDescription className="text-base">
                            {selectedCampaign.description}
                          </CardDescription>
                        )}
                      </CardHeader>

                      {/* Action Buttons */}
                      {user && (
                        <CardContent>
                          <div className="flex gap-3">
                            {selectedCampaign.status === "nominations_open" && (
                              <Button
                                onClick={() => setShowNominateDialog(true)}
                                disabled={!!myNomination || nominateMutation.isPending}
                                className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300"
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                {myNomination ? "Already Nominated" : "Nominate"}
                              </Button>
                            )}

                            {selectedCampaign.status === "voting_open" && (
                              <Button
                                onClick={() => setShowVoteDialog(true)}
                                disabled={!!myVote || voteMutation.isPending}
                                className="bg-gradient-purple-blue hover:shadow-neon-purple transition-all duration-300"
                              >
                                <Vote className="w-4 h-4 mr-2" />
                                {myVote ? "Already Voted" : "Vote"}
                              </Button>
                            )}
                          </div>

                          {myNomination && (
                            <p className="mt-3 text-sm text-muted-foreground">
                              ✓ You nominated: {myNomination.nominee_username}
                            </p>
                          )}

                          {myVote && nominees && (
                            <p className="mt-3 text-sm text-muted-foreground">
                              ✓ You voted for:{" "}
                              {
                                nominees.find(
                                  (n) => n.nominee_discord_id === myVote.nominee_discord_id
                                )?.nominee_username
                              }
                            </p>
                          )}
                        </CardContent>
                      )}

                      {!user && selectedCampaign.status !== "closed" && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Sign in with Discord to participate
                          </p>
                        </CardContent>
                      )}
                    </Card>

                    {/* Nominees/Results */}
                    <Card className="bg-card/90 backdrop-blur-sm border-primary/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          {selectedCampaign.status === "closed"
                            ? "Final Results"
                            : "Current Nominees"}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        {nomineesLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          </div>
                        ) : nominees && nominees.length > 0 ? (
                          <div className="space-y-3">
                            {nominees
                              .sort((a, b) => b.vote_count - a.vote_count)
                              .map((nominee, index) => (
                                <div
                                  key={nominee.nominee_discord_id}
                                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    {index === 0 &&
                                      selectedCampaign.status === "closed" && (
                                        <Trophy className="w-5 h-5 text-yellow-500" />
                                      )}
                                    <div>
                                      <p className="font-semibold text-foreground">
                                        {nominee.nominee_username}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {nominee.nomination_count} nomination
                                        {nominee.nomination_count !== 1 ? "s" : ""}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    {selectedCampaign.status === "voting_open" ||
                                    selectedCampaign.status === "closed" ? (
                                      <Badge
                                        variant="secondary"
                                        className="text-base px-3 py-1"
                                      >
                                        <Vote className="w-4 h-4 mr-1" />
                                        {nominee.vote_count}
                                      </Badge>
                                    ) : null}

                                    {user &&
                                      selectedCampaign.status === "voting_open" &&
                                      !myVote && (
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleVote(nominee.nominee_discord_id)
                                          }
                                          disabled={voteMutation.isPending}
                                          className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300"
                                        >
                                          Vote
                                        </Button>
                                      )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground py-8">
                            No nominees yet
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Nominate Dialog */}
      <Dialog open={showNominateDialog} onOpenChange={setShowNominateDialog}>
        <DialogContent className="bg-card/95 backdrop-blur-lg border-primary/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              <span className="text-neon-cyan">Nominate </span>
              <span className="text-neon-magenta">User</span>
            </DialogTitle>
            <DialogDescription>
              Select a user from the Discord server to nominate
              {selectedCampaign?.allow_self_nomination &&
                " (you can nominate yourself)"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Search/Autocomplete Input */}
            <div className="space-y-2">
              <Label htmlFor="user-search" className="text-sm font-medium">
                Search User
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  id="user-search"
                  placeholder="Type a name to search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // Clear selection when typing
                    if (selectedUserId && e.target.value !== "") {
                      const selectedUser = discordUsers?.find(u => u.id === selectedUserId);
                      if (selectedUser && getDisplayName(selectedUser) !== e.target.value) {
                        setSelectedUserId("");
                      }
                    }
                  }}
                  className="bg-background/50 border-primary/30 pl-9"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* User List - Show when searching or no selection */}
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {(() => {
                  const filteredUsers = discordUsers?.filter((user) => {
                    if (!searchQuery.trim()) return true;
                    const displayName = getDisplayName(user).toLowerCase();
                    const query = searchQuery.toLowerCase().trim();
                    return (
                      displayName.includes(query) ||
                      user.username.toLowerCase().includes(query) ||
                      user.id.includes(query)
                    );
                  }) || [];

                  return (
                    <>
                      <ScrollArea className="h-[300px] rounded-md border border-primary/30 bg-background/30">
                        <div className="p-2 space-y-1">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.slice(0, 50).map((user) => (
                              <button
                                key={user.id}
                                onClick={() => {
                                  setSelectedUserId(user.id);
                                  setSearchQuery(getDisplayName(user));
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 transition-colors text-left ${
                                  selectedUserId === user.id
                                    ? "bg-primary/20 border border-primary/50"
                                    : "border border-transparent"
                                }`}
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground truncate">
                                    {getDisplayName(user)}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    @{user.username}
                                  </p>
                                </div>
                                {selectedUserId === user.id && (
                                  <Check className="w-4 h-4 text-primary flex-shrink-0 ml-2" />
                                )}
                              </button>
                            ))
                          ) : (
                            <p className="text-center text-muted-foreground py-8">
                              {searchQuery.trim() ? "No users found" : "Start typing to search..."}
                            </p>
                          )}
                          
                          {filteredUsers.length > 50 && (
                            <p className="text-center text-xs text-muted-foreground py-2">
                              Showing first 50 of {filteredUsers.length} results. Keep typing to narrow down.
                            </p>
                          )}
                        </div>
                      </ScrollArea>

                      {/* Results count */}
                      {searchQuery.trim() && (
                        <p className="text-xs text-muted-foreground">
                          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                        </p>
                      )}
                    </>
                  );
                })()}
              </>
            )}

            {/* Selected User Confirmation */}
            {selectedUserId && discordUsers && (
              <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Selected:</p>
                    <p className="font-medium">
                      {getDisplayName(discordUsers.find(u => u.id === selectedUserId)!)}
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNominateDialog(false);
                setSelectedUserId("");
                setSearchQuery("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNominate}
              disabled={!selectedUserId || nominateMutation.isPending}
              className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300"
            >
              {nominateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Nominating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nominate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campaign;

