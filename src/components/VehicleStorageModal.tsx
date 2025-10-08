import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFivemVehicleInventory } from "@/hooks/useFivemVehicleInventory";
import { Loader2, Package, Box, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";

interface VehicleStorageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  citizenid: string;
  plate: string;
  vehicleName: string;
}

export const VehicleStorageModal = ({
  open,
  onOpenChange,
  citizenid,
  plate,
  vehicleName,
}: VehicleStorageModalProps) => {
  const { data: storage, isLoading, error } = useFivemVehicleInventory(
    open ? citizenid : null,
    open ? plate : null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const formatItemName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Filter items based on search query
  const filterItems = (items: Array<{ name: string; amount: number }>) => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter(item => {
      const formattedName = formatItemName(item.name).toLowerCase();
      return formattedName.includes(query) || item.name.toLowerCase().includes(query);
    });
  };

  const filteredGlovebox = useMemo(() => 
    storage ? filterItems(storage.glovebox) : [], 
    [storage?.glovebox, searchQuery]
  );

  const filteredTrunk = useMemo(() => 
    storage ? filterItems(storage.trunk) : [], 
    [storage?.trunk, searchQuery]
  );

  const renderInventorySection = (
    title: string, 
    items: Array<{ name: string; amount: number }>, 
    originalCount: number,
    icon: typeof Package
  ) => {
    const Icon = icon;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-heading font-bold mb-3 flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          {title} ({items.length}{searchQuery && originalCount !== items.length ? ` of ${originalCount}` : ''})
        </h3>
        
        {items.length === 0 ? (
          <div className="bg-black/40 border border-white/10 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              {searchQuery && originalCount > 0 ? 'No items match your search' : 'Empty'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-black/40 border border-white/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">
                    {formatItemName(item.name)}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    x{item.amount}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-card/95 backdrop-blur-lg border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-primary">
            {vehicleName} Storage
          </DialogTitle>
          <DialogDescription>
            License Plate: {plate}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading storage...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Error loading storage</p>
            <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
          </div>
        ) : storage ? (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search storage by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/50 backdrop-blur-sm border-primary/30 focus:border-primary"
              />
            </div>

            <ScrollArea className="h-[53vh] pr-4">
              <div className="space-y-6">
                {/* Glovebox */}
                {renderInventorySection("Glovebox", filteredGlovebox, storage.glovebox.length, Package)}
                
                {/* Trunk */}
                {renderInventorySection("Trunk", filteredTrunk, storage.trunk.length, Box)}
              </div>
            </ScrollArea>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

