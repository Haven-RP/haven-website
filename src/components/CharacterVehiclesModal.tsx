import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFivemVehicles } from "@/hooks/useFivemVehicles";
import { Loader2, Car, Fuel, Wrench, Heart, Star, Package, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { VehicleStorageModal } from "./VehicleStorageModal";
import { useToast } from "@/hooks/use-toast";

interface CharacterVehiclesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  citizenid: string;
  characterName: string;
}

export const CharacterVehiclesModal = ({
  open,
  onOpenChange,
  citizenid,
  characterName,
}: CharacterVehiclesModalProps) => {
  const { toast } = useToast();
  const { data: vehiclesData, isLoading, error } = useFivemVehicles(open ? citizenid : null);
  const [selectedVehicle, setSelectedVehicle] = useState<{
    plate: string;
    name: string;
  } | null>(null);
  const [copiedPlates, setCopiedPlates] = useState<{ [key: string]: boolean }>({});

  const getVehicleCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      super: "bg-accent/20 text-accent border-accent/30",
      sports: "bg-primary/20 text-primary border-primary/30",
      sportsclassics: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      muscle: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      sedans: "bg-blue-accent/20 text-blue-accent border-blue-accent/30",
      suvs: "bg-green-500/20 text-green-400 border-green-500/30",
      offroad: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      bikes: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      compacts: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      coupes: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      vans: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return colors[category.toLowerCase()] || "bg-muted/20 text-muted-foreground border-muted/30";
  };

  const formatCategory = (category: string) => {
    const formatted: { [key: string]: string } = {
      sportsclassics: "Sports Classics",
      offroad: "Off-Road",
      compacts: "Compacts",
      coupes: "Coupes",
    };
    return formatted[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getConditionColor = (value: number) => {
    if (value >= 900) return "text-green-500";
    if (value >= 700) return "text-yellow-500";
    if (value >= 500) return "text-orange-500";
    return "text-red-500";
  };

  const copyToClipboard = async (text: string, label: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPlates({ ...copiedPlates, [id]: true });
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
        duration: 2000,
      });
      
      setTimeout(() => {
        setCopiedPlates((prev) => ({ ...prev, [id]: false }));
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[85vh] bg-card/95 backdrop-blur-lg border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-primary">
              {characterName}'s Vehicles
            </DialogTitle>
            <DialogDescription>
              Citizen ID: {citizenid}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading vehicles...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Error loading vehicles</p>
              <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            </div>
          ) : vehiclesData && vehiclesData.vehicles.length > 0 ? (
            <ScrollArea className="h-[65vh] pr-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Total Vehicles: {vehiclesData.vehicle_count}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {vehiclesData.vehicles.map((vehicle, index) => (
                    <div
                      key={index}
                      className="bg-black/40 border border-white/10 rounded-lg p-5 hover:border-primary/30 transition-all duration-300"
                    >
                      {/* Header with Favorite */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-heading font-bold text-foreground">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                            {vehicle.favourite === 1 && (
                              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="outline" 
                              className="font-mono text-xs cursor-pointer hover:bg-primary/10 transition-colors group"
                              onClick={() => copyToClipboard(vehicle.plate, "License plate", `plate-${index}`)}
                            >
                              {vehicle.plate}
                              {copiedPlates[`plate-${index}`] ? (
                                <Check className="w-3 h-3 ml-1.5 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getVehicleCategoryColor(vehicle.category)}`}
                            >
                              {formatCategory(vehicle.category)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Fuel className="w-4 h-4 text-blue-accent" />
                          <span className="text-muted-foreground">Fuel:</span>
                          <span className="font-semibold">{vehicle.fuel}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Mileage:</span>
                          <span className="font-semibold">{vehicle.mileage.toFixed(1)} mi</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Wrench className="w-4 h-4 text-accent" />
                          <span className="text-muted-foreground">Engine:</span>
                          <span className={`font-semibold ${getConditionColor(vehicle.engine)}`}>
                            {vehicle.engine.toFixed(0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Heart className="w-4 h-4 text-secondary" />
                          <span className="text-muted-foreground">Body:</span>
                          <span className={`font-semibold ${getConditionColor(vehicle.body)}`}>
                            {vehicle.body.toFixed(0)}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300"
                        size="sm"
                        onClick={() =>
                          setSelectedVehicle({
                            plate: vehicle.plate,
                            name: `${vehicle.brand} ${vehicle.model}`,
                          })
                        }
                      >
                        <Package className="w-4 h-4 mr-2" />
                        View Storage
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No vehicles found</p>
              <p className="text-sm text-muted-foreground">
                This character doesn't own any vehicles
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Vehicle Storage Modal */}
      {selectedVehicle && (
        <VehicleStorageModal
          open={!!selectedVehicle}
          onOpenChange={(open) => !open && setSelectedVehicle(null)}
          citizenid={citizenid}
          plate={selectedVehicle.plate}
          vehicleName={selectedVehicle.name}
        />
      )}
    </>
  );
};

