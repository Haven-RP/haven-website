import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFivemVehicles } from "@/hooks/useFivemVehicles";
import { Loader2, Car, Fuel, Wrench, Heart, Star, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { VehicleStorageModal } from "./VehicleStorageModal";

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
  const { data: vehiclesData, isLoading, error } = useFivemVehicles(open ? citizenid : null);
  const [selectedVehicle, setSelectedVehicle] = useState<{
    plate: string;
    name: string;
  } | null>(null);

  const getVehicleCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      super: "text-accent",
      sports: "text-primary",
      sportsclassics: "text-secondary",
      muscle: "text-red-500",
      sedans: "text-blue-accent",
      suvs: "text-green-500",
      offroad: "text-yellow-500",
      bikes: "text-purple-500",
    };
    return colors[category.toLowerCase()] || "text-muted-foreground";
  };

  const getConditionColor = (value: number) => {
    if (value >= 900) return "text-green-500";
    if (value >= 700) return "text-yellow-500";
    if (value >= 500) return "text-orange-500";
    return "text-red-500";
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
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {vehicle.plate}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getVehicleCategoryColor(vehicle.category)}`}
                            >
                              {vehicle.category}
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

