import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFivemVehicleInventory } from "@/hooks/useFivemVehicleInventory";
import { Loader2, Package, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const formatItemName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const renderInventorySection = (title: string, items: Array<{ name: string; amount: number }>, icon: typeof Package) => {
    const Icon = icon;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-heading font-bold mb-3 flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          {title} ({items.length} items)
        </h3>
        
        {items.length === 0 ? (
          <div className="bg-black/40 border border-white/10 rounded-lg p-6 text-center">
            <p className="text-muted-foreground text-sm">Empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-black/40 border border-white/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">
                    {formatItemName(item.name)}
                  </h4>
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
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Glovebox */}
              {renderInventorySection("Glovebox", storage.glovebox, Package)}
              
              {/* Trunk */}
              {renderInventorySection("Trunk", storage.trunk, Box)}
            </div>
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

