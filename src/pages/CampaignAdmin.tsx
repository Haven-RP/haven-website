import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  Shield,
  AlertCircle,
  Play,
  Pause,
  CheckCircle,
} from "lucide-react";
import pageBg from "@/assets/page-bg.png";
import {
  useCouncilCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useDiscordRoles } from "@/hooks/useDiscordRoles";
import { siteConfig } from "@/config/site";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CampaignAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [discordUserId, setDiscordUserId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowSelfNomination, setAllowSelfNomination] = useState(true);
  const [maxNominations, setMaxNominations] = useState(1);

  // Fetch user's Discord roles
  const { data: rolesData, isLoading: rolesLoading } = useDiscordRoles(discordUserId);

  // Check if user is Senior Admin (by role ID)
  const isSeniorAdmin = rolesData?.data?.roles?.some(
    (role) => role.id === siteConfig.seniorAdminRoleId
  ) ?? false;

  // Fetch campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useCouncilCampaigns({
    include_closed: true,
  });

  // Mutations
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();

  // Get authenticated user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/campaigns");
      } else {
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
      if (!session) {
        navigate("/campaigns");
      } else {
        const discordId =
          session.user.user_metadata?.provider_id ||
          session.user.user_metadata?.sub ||
          session.user.identities?.[0]?.id;
        setDiscordUserId(discordId);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Redirect if not Senior Admin
  useEffect(() => {
    if (!rolesLoading && !isSeniorAdmin && user) {
      toast({
        title: "Access Denied",
        description: "You must be a Senior Admin to access this page.",
        variant: "destructive",
        duration: 3000,
      });
      navigate("/campaigns");
    }
  }, [isSeniorAdmin, rolesLoading, user, navigate, toast]);

  const handleCreateCampaign = async () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Campaign title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        allow_self_nomination: allowSelfNomination,
        max_nominations_per_user: maxNominations,
      });

      toast({
        title: "Campaign Created!",
        description: `"${title}" has been created successfully`,
        duration: 3000,
      });

      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create campaign",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleUpdateStatus = async (campaignId: number, newStatus: Campaign["status"]) => {
    try {
      await updateMutation.mutateAsync({
        campaignId,
        data: { status: newStatus },
      });

      toast({
        title: "Status Updated",
        description: `Campaign status changed to ${newStatus}`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteMutation.mutateAsync(campaignToDelete.id);

      toast({
        title: "Campaign Deleted",
        description: `"${campaignToDelete.title}" has been deleted`,
        duration: 2000,
      });

      setShowDeleteDialog(false);
      setCampaignToDelete(null);
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete campaign",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAllowSelfNomination(true);
    setMaxNominations(1);
  };

  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-gray-500/20">Draft</Badge>;
      case "nominations_open":
        return <Badge variant="outline" className="bg-blue-500/20">Nominations Open</Badge>;
      case "voting_open":
        return <Badge variant="outline" className="bg-green-500/20">Voting Open</Badge>;
      case "closed":
        return <Badge variant="outline" className="bg-red-500/20">Closed</Badge>;
    }
  };

  const getNextStatusAction = (status: Campaign["status"]) => {
    switch (status) {
      case "draft":
        return { label: "Start Nominations", status: "nominations_open" as const, icon: Play };
      case "nominations_open":
        return { label: "Start Voting", status: "voting_open" as const, icon: ArrowRight };
      case "voting_open":
        return { label: "Close Campaign", status: "closed" as const, icon: CheckCircle };
      default:
        return null;
    }
  };

  if (rolesLoading || campaignsLoading) {
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

  if (!isSeniorAdmin) {
    return null; // Will redirect via useEffect
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
                <h1 className="text-4xl font-heading font-bold mb-2 flex items-center gap-3">
                  <Shield className="w-10 h-10 text-neon-cyan" />
                  <span className="text-neon-cyan">Campaign </span>
                  <span className="text-neon-magenta">Admin</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Manage campaigns and elections
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/campaigns")}
                  className="border-primary/50"
                >
                  View Public Page
                </Button>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </div>

            {/* Campaigns List */}
            {campaigns && campaigns.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {campaigns.map((campaign) => {
                  const nextAction = getNextStatusAction(campaign.status);
                  return (
                    <Card
                      key={campaign.id}
                      className="bg-card/90 backdrop-blur-sm border-primary/30"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-2xl">
                                {campaign.title}
                              </CardTitle>
                              {getStatusBadge(campaign.status)}
                            </div>
                            {campaign.description && (
                              <CardDescription className="text-base">
                                {campaign.description}
                              </CardDescription>
                            )}
                            <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                              <span>
                                Self-nomination:{" "}
                                {campaign.allow_self_nomination ? "Allowed" : "Disabled"}
                              </span>
                              <span>
                                Max nominations: {campaign.max_nominations_per_user}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCampaignToDelete(campaign);
                              setShowDeleteDialog(true);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="flex gap-3">
                          {nextAction && (
                            <Button
                              onClick={() =>
                                handleUpdateStatus(campaign.id, nextAction.status)
                              }
                              disabled={updateMutation.isPending}
                              className="bg-gradient-purple-blue hover:shadow-neon-purple transition-all duration-300"
                            >
                              {React.createElement(nextAction.icon, {
                                className: "w-4 h-4 mr-2",
                              })}
                              {nextAction.label}
                            </Button>
                          )}

                          {campaign.status !== "draft" && campaign.status !== "closed" && (
                            <Button
                              variant="outline"
                              onClick={() => handleUpdateStatus(campaign.id, "draft")}
                              disabled={updateMutation.isPending}
                              className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </Button>
                          )}
                        </div>

                        <p className="mt-3 text-xs text-muted-foreground">
                          Created: {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-card/90 backdrop-blur-sm border-primary/30">
                <CardContent className="pt-6 text-center py-12">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No campaigns created yet
                  </p>
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Campaign
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-card/95 backdrop-blur-lg border-primary/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              <span className="text-neon-cyan">Create </span>
              <span className="text-neon-magenta">Campaign</span>
            </DialogTitle>
            <DialogDescription>
              Set up a new election or nomination campaign
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Mayor Election 2024"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background/50 border-primary/30 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the campaign and what it's for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background/50 border-primary/30 mt-1 min-h-[100px]"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-primary/20">
              <div>
                <Label htmlFor="self-nomination">Allow Self-Nomination</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Users can nominate themselves
                </p>
              </div>
              <Switch
                id="self-nomination"
                checked={allowSelfNomination}
                onCheckedChange={setAllowSelfNomination}
              />
            </div>

            <div>
              <Label htmlFor="max-nominations">Max Nominations Per User</Label>
              <Input
                id="max-nominations"
                type="number"
                min="1"
                value={maxNominations}
                onChange={(e) => setMaxNominations(parseInt(e.target.value) || 1)}
                className="bg-background/50 border-primary/30 mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCampaign}
              disabled={!title.trim() || createMutation.isPending}
              className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-lg border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{campaignToDelete?.title}"?
              <br />
              <span className="text-destructive font-semibold">
                This will permanently delete all nominations and votes.
              </span>
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCampaign}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Campaign"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignAdmin;

