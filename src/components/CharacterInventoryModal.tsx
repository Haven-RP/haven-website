import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFivemCharacter } from "@/hooks/useFivemCharacter";
import { Loader2, Package, Wrench, Shield, DollarSign, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";

interface CharacterInventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  citizenid: string;
  characterName: string;
}

export const CharacterInventoryModal = ({
  open,
  onOpenChange,
  citizenid,
  characterName,
}: CharacterInventoryModalProps) => {
  const { data: character, isLoading, error } = useFivemCharacter(open ? citizenid : null);
  const [searchQuery, setSearchQuery] = useState("");

  const formatItemName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .replace(/WEAPON_/g, "")
      .split(" ")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Filter inventory based on search query
  const filteredInventory = useMemo(() => {
    if (!character?.inventory || !searchQuery.trim()) {
      return character?.inventory || [];
    }

    const query = searchQuery.toLowerCase().trim();
    
    return character.inventory.filter(item => {
      const formattedName = formatItemName(item.name).toLowerCase();
      return formattedName.includes(query) || item.name.toLowerCase().includes(query);
    });
  }, [character?.inventory, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-card/95 backdrop-blur-lg border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-primary">
            {characterName}'s Inventory
          </DialogTitle>
          <DialogDescription>
            Citizen ID: {citizenid}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading inventory...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Error loading inventory</p>
            <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
          </div>
        ) : character ? (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search inventory by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/50 backdrop-blur-sm border-primary/30 focus:border-primary"
              />
            </div>

            <ScrollArea className="h-[53vh] pr-4">
              <div className="space-y-6">
                {/* Character Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/30 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cash</p>
                    <p className="text-sm font-semibold text-accent">
                      ${character.moneyData.cash?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bank</p>
                    <p className="text-sm font-semibold text-primary">
                      ${character.moneyData.bank?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Health</p>
                    <p className="text-sm font-semibold text-secondary">{character.health} ({Math.floor((character.health / 200) * 100)}%)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Armor</p>
                    <p className="text-sm font-semibold text-blue-accent">{character.armor}</p>
                  </div>
                </div>
              </div>

                {/* Inventory Items */}
                <div>
                  <h3 className="text-lg font-heading font-bold mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Inventory Items ({filteredInventory.length}{searchQuery ? ` of ${character.inventory.length}` : ''})
                  </h3>
                  
                  {filteredInventory.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchQuery ? 'No items match your search' : 'No items in inventory'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredInventory.map((item, index) => (
                      <div
                        key={index}
                        className="bg-black/40 border border-white/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {formatItemName(item.name)}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Slot {item.slot}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                x{item.count}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {item.metadata && Object.keys(item.metadata).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                            {item.metadata.durability !== undefined && (
                              <p className="text-xs text-muted-foreground">
                                <span className="text-accent">Durability:</span> {item.metadata.durability.toFixed(1)}%
                              </p>
                            )}
                            {item.metadata.ammo !== undefined && (
                              <p className="text-xs text-muted-foreground">
                                <span className="text-primary">Ammo:</span> {item.metadata.ammo}
                              </p>
                            )}
                            {item.metadata.serial && (
                              <p className="text-xs text-muted-foreground">
                                <span className="text-secondary">Serial:</span> {item.metadata.serial}
                              </p>
                            )}
                            {item.metadata.registered && (
                              <p className="text-xs text-muted-foreground">
                                <span className="text-blue-accent">Registered to:</span> {item.metadata.registered}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

