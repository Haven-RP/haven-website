import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFivemVehicles } from "@/hooks/useFivemVehicles";
import { Loader2, Car, Fuel, Wrench, Heart, Star, Package, Copy, Check, Sparkles, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const getVehicleCategoryColor = (category: string | null) => {
    if (!category) return "bg-muted/20 text-muted-foreground border-muted/30";
    
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

  const formatCategory = (category: string | null) => {
    if (!category) return "Unknown";
    
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

  const getDealershipBadge = (dealership: string | null) => {
    if (!dealership || dealership === 'null') return null;
    
    if (dealership === '1of1') {
      return (
        <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/50 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          1 of 1
        </Badge>
      );
    }
    
    if (dealership === 'import') {
      return (
        <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/50 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Import
        </Badge>
      );
    }
    
    return null;
  };

  const getDealershipType = (dealership: string | null): string => {
    if (!dealership || dealership === 'null') return 'regular';
    return dealership.toLowerCase();
  };

  // Filter vehicles based on search query
  const filteredVehicles = useMemo(() => {
    if (!vehiclesData?.vehicles || !searchQuery.trim()) {
      return vehiclesData?.vehicles || [];
    }

    const query = searchQuery.toLowerCase().trim();
    
    return vehiclesData.vehicles.filter(vehicle => {
      // Search by category
      if (vehicle.category && vehicle.category.toLowerCase().includes(query)) return true;
      
      // Search by formatted category
      if (vehicle.category && formatCategory(vehicle.category).toLowerCase().includes(query)) return true;
      
      // Search by dealership type
      const dealershipType = getDealershipType(vehicle.dealership);
      if (dealershipType && dealershipType.includes(query)) return true;
      if (dealershipType === '1of1' && ('1of1'.includes(query) || '1 of 1'.includes(query))) return true;
      
      // Search by brand/make
      if (vehicle.brand && vehicle.brand.toLowerCase().includes(query)) return true;
      
      // Search by model
      if (vehicle.model && vehicle.model.toLowerCase().includes(query)) return true;
      
      // Search by plate
      if (vehicle.plate && vehicle.plate.toLowerCase().includes(query)) return true;
      
      return false;
    });
  }, [vehiclesData?.vehicles, searchQuery]);

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
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by category, type, make, model, or plate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/50 backdrop-blur-sm border-primary/30 focus:border-primary"
                />
              </div>

              <ScrollArea className="h-[58vh] pr-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredVehicles.length} of {vehiclesData.vehicle_count} vehicles
                  </p>

                  {filteredVehicles.length === 0 ? (
                    <div className="text-center py-12">
                      <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg text-muted-foreground mb-2">No vehicles found</p>
                      <p className="text-sm text-muted-foreground">
                        Try a different search term
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredVehicles.map((vehicle, index) => (
                    <div
                      key={index}
                      className="bg-black/40 border border-white/10 rounded-lg p-5 hover:border-primary/30 transition-all duration-300"
                    >
                      {/* Header with Favorite and Dealership */}
                      <div className="flex items-start justify-between mb-4 gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-xl font-heading font-bold text-foreground">
                              {vehicle.brand && vehicle.model 
                                ? `${vehicle.brand} ${vehicle.model}`
                                : vehicle.brand 
                                  ? vehicle.brand
                                  : vehicle.model 
                                    ? vehicle.model
                                    : "Unknown Vehicle"
                              }
                            </h3>
                            {vehicle.favourite === 1 && (
                              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
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
                        {/* Dealership Badge */}
                        {getDealershipBadge(vehicle.dealership) && (
                          <div className="flex-shrink-0">
                            {getDealershipBadge(vehicle.dealership)}
                          </div>
                        )}
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
                            {vehicle.engine.toFixed(0)} ({Math.floor((vehicle.engine / 1000) * 100)}%)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Heart className="w-4 h-4 text-secondary" />
                          <span className="text-muted-foreground">Body:</span>
                          <span className={`font-semibold ${getConditionColor(vehicle.body)}`}>
                            {vehicle.body.toFixed(0)} ({Math.floor((vehicle.body / 1000) * 100)}%)
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
                            name: vehicle.brand && vehicle.model 
                              ? `${vehicle.brand} ${vehicle.model}`
                              : vehicle.brand 
                                ? vehicle.brand
                                : vehicle.model 
                                  ? vehicle.model
                                  : `Vehicle ${vehicle.plate}`,
                          })
                        }
                      >
                        <Package className="w-4 h-4 mr-2" />
                        View Storage
                      </Button>
                    </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
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

