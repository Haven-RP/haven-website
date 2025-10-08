import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import pageBg from "@/assets/page-bg.png";
import { Loader2, User as UserIcon, Phone, DollarSign, CreditCard, Coins, Package, Heart, Shield, Copy, Check } from "lucide-react";
import { useFivemCharacters } from "@/hooks/useFivemCharacters";
import { CharacterInventoryModal } from "@/components/CharacterInventoryModal";
import { useToast } from "@/hooks/use-toast";

const MyCharacters = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [discordUserId, setDiscordUserId] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<{
    citizenid: string;
    name: string;
  } | null>(null);
  const [copiedItems, setCopiedItems] = useState<{ [key: string]: boolean }>({});

  // Fetch characters
  const { data: charactersData, isLoading: charactersLoading, error: charactersError } = useFivemCharacters(discordUserId);

  // Format phone number as (XXX) XXX-XXXX
  const formatPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return "No phone";
    
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "");
    
    // Check if we have 10 digits
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // Return original if not 10 digits
    return phone;
  };

  // Copy to clipboard with feedback
  const copyToClipboard = async (text: string, label: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems({ ...copiedItems, [id]: true });
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
        duration: 2000,
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedItems((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);

      if (!session) {
        navigate("/");
      } else {
        // Extract Discord user ID
        const discordId =
          session.user.user_metadata?.provider_id ||
          session.user.user_metadata?.sub ||
          session.user.identities?.[0]?.id;
        setDiscordUserId(discordId);
      }
      setLoading(false);
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (!session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading...</span>
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
            <div className="mb-8">
              <h1 className="text-4xl font-heading font-bold mb-2">
                <span className="text-neon-cyan">My </span>
                <span className="text-neon-magenta">Characters</span>
              </h1>
              <p className="text-muted-foreground">
                View and manage your FiveM characters
              </p>
            </div>

            {/* Characters Grid */}
            {charactersLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading characters...</span>
              </div>
            ) : charactersError ? (
              <Card className="bg-card/90 backdrop-blur-sm border-destructive/50">
                <CardContent className="pt-6">
                  <p className="text-center text-destructive">Error loading characters</p>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {charactersError.message}
                  </p>
                </CardContent>
              </Card>
            ) : charactersData && charactersData.characters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {charactersData.characters.map((character) => (
                  <Card
                    key={character.id}
                    className="bg-card/90 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <UserIcon className="w-5 h-5 text-primary" />
                        {character.charinfoData.firstname} {character.charinfoData.lastname}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge 
                            variant="outline" 
                            className="font-mono cursor-pointer hover:bg-primary/10 transition-colors group relative"
                            onClick={() => copyToClipboard(character.citizenid, "Citizen ID", `cid-${character.id}`)}
                          >
                            {character.citizenid}
                            {copiedItems[`cid-${character.id}`] ? (
                              <Check className="w-3 h-3 ml-1.5 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Contact Info */}
                      <div 
                        className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-secondary transition-colors group"
                        onClick={() => character.charinfoData.phone && copyToClipboard(character.charinfoData.phone, "Phone number", `phone-${character.id}`)}
                      >
                        <Phone className="w-4 h-4 text-secondary" />
                        <span className="group-hover:underline">{formatPhoneNumber(character.charinfoData.phone)}</span>
                        {character.charinfoData.phone && (
                          copiedItems[`phone-${character.id}`] ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )
                        )}
                      </div>

                      {/* Money */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-accent" />
                            <span className="text-muted-foreground">Cash</span>
                          </div>
                          <span className="font-semibold text-accent">
                            ${character.moneyData.cash?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">Bank</span>
                          </div>
                          <span className="font-semibold text-primary">
                            ${character.moneyData.bank?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-secondary" />
                            <span className="text-muted-foreground">Crypto</span>
                          </div>
                          <span className="font-semibold text-secondary">
                            ${character.moneyData.crypto?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-muted-foreground">
                            HP: <span className="text-foreground font-semibold">{character.health}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-accent" />
                          <span className="text-sm text-muted-foreground">
                            Armor: <span className="text-foreground font-semibold">{character.armor}</span>
                          </span>
                        </div>
                      </div>

                      {/* Job & Gang */}
                      <div className="space-y-2 pt-3 border-t border-white/10">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Job: </span>
                          <Badge variant="secondary" className="text-xs">
                            {character.jobData.label} - {character.jobData.grade.name}
                          </Badge>
                        </div>
                        {character.gangData.name !== "none" && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Gang: </span>
                            <Badge variant="destructive" className="text-xs">
                              {character.gangData.label}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300"
                        onClick={() =>
                          setSelectedCharacter({
                            citizenid: character.citizenid,
                            name: `${character.charinfoData.firstname} ${character.charinfoData.lastname}`,
                          })
                        }
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Show Inventory
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card/90 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <UserIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">No characters found</p>
                    <p className="text-sm text-muted-foreground">
                      Create a character in-game to see it here
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Inventory Modal */}
      {selectedCharacter && (
        <CharacterInventoryModal
          open={!!selectedCharacter}
          onOpenChange={(open) => !open && setSelectedCharacter(null)}
          citizenid={selectedCharacter.citizenid}
          characterName={selectedCharacter.name}
        />
      )}
    </div>
  );
};

export default MyCharacters;

