import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShoppingCart, Tag, ExternalLink, Sparkles } from "lucide-react";
import pageBg from "@/assets/page-bg.png";
import { useTebexWebstore, useTebexCategories, type TebexPackage, createBasket, addPackageToBasket } from "@/hooks/useTebex";
import { siteConfig } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import Tebex from "@tebexio/tebex.js";

const Store = () => {
  const { data: webstore, isLoading: webstoreLoading, error: webstoreError } = useTebexWebstore();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useTebexCategories();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [purchasingPackage, setPurchasingPackage] = useState<number | null>(null);
  const { toast } = useToast();

  // Set first category as default when categories load
  if (categories && categories.length > 0 && selectedCategory === null) {
    const firstCategoryWithPackages = categories.find(cat => cat.packages.length > 0);
    if (firstCategoryWithPackages) {
      setSelectedCategory(firstCategoryWithPackages.id);
    }
  }

  // Initialize Tebex.js event listeners
  useEffect(() => {
    // Listen for checkout completion
    const handleComplete = (data: any) => {
      console.log('Payment complete:', data);
      toast({
        title: "Purchase Successful!",
        description: "Thank you for your purchase. Your items will be delivered shortly.",
        duration: 5000,
      });
      setPurchasingPackage(null);
    };

    // Listen for checkout close
    const handleClose = () => {
      console.log('Checkout closed');
      setPurchasingPackage(null);
    };

    // Listen for payment errors
    const handleError = (error: any) => {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      setPurchasingPackage(null);
    };

    // Listen for checkout open
    const handleOpen = () => {
      console.log('Checkout opened');
    };

    // Register event listeners
    Tebex.checkout.on('payment:complete', handleComplete);
    Tebex.checkout.on('close', handleClose);
    Tebex.checkout.on('payment:error', handleError);
    Tebex.checkout.on('open', handleOpen);

    // Cleanup is handled automatically by Tebex.js
    return () => {
      // No manual cleanup needed
    };
  }, [toast, setPurchasingPackage]);

  const handlePurchase = async (packageId: number, packageName: string) => {
    setPurchasingPackage(packageId);

    try {
      // Step 1: Create empty basket
      console.log('Step 1: Creating empty basket...');
      const emptyBasket = await createBasket();
      console.log('Empty basket created:', emptyBasket.ident);
      
      // Step 2: Add package to basket
      console.log('Step 2: Adding package', packageId, 'to basket...');
      const basket = await addPackageToBasket(emptyBasket.ident, packageId, 1);
      console.log('Package added, final basket:', basket);
      
      // Step 3: Initialize and launch embedded checkout
      console.log('Step 3: Launching checkout...');
      Tebex.checkout.init({
        ident: basket.ident,
        theme: 'dark',
        colors: [
          {
            name: 'primary',
            color: '#00D9FF', // Neon cyan to match site theme
          },
        ],
      });

      Tebex.checkout.launch();
      
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to start checkout. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setPurchasingPackage(null);
    }
  };

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const renderPackage = (pkg: TebexPackage) => {
    const hasDiscount = pkg.discount > 0;
    
    return (
      <Card
        key={pkg.id}
        className="bg-card/90 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-300 flex flex-col"
      >
        <CardHeader>
          {hasDiscount && (
            <Badge className="w-fit bg-gradient-to-r from-accent to-secondary mb-2">
              <Tag className="w-3 h-3 mr-1" />
              {pkg.discount}% OFF
            </Badge>
          )}
          {pkg.image && (
            <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-black/50 flex items-center justify-center">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <CardTitle className="text-xl text-foreground">{pkg.name}</CardTitle>
          <CardDescription className="text-sm">
            {pkg.description ? (
              <div 
                dangerouslySetInnerHTML={{ __html: pkg.description }} 
                className="prose prose-sm prose-invert max-w-none"
              />
            ) : (
              <span className="text-muted-foreground">No description available</span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
          <div className="space-y-2">
            {pkg.type === 'subscription' && (
              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                Subscription
              </Badge>
            )}
            {pkg.expiration_date && (
              <div className="text-xs text-muted-foreground">
                Expires: {new Date(pkg.expiration_date).toLocaleDateString()}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(pkg.base_price, pkg.currency)}
              </span>
            )}
            <span className={`font-bold ${hasDiscount ? 'text-accent text-2xl' : 'text-primary text-xl'}`}>
              {formatPrice(pkg.total_price, pkg.currency)}
            </span>
          </div>
          <Button
            className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300"
            onClick={() => handlePurchase(pkg.id, pkg.name)}
            disabled={pkg.disable_quantity || purchasingPackage === pkg.id}
          >
            {purchasingPackage === pkg.id ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {pkg.disable_quantity ? 'Unavailable' : 'Purchase'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (webstoreLoading || categoriesLoading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: `url(${pageBg})` }}
      >
        <div className="relative z-10">
          <Navigation />
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading store...</span>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (webstoreError || categoriesError) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: `url(${pageBg})` }}
      >
        <div className="relative z-10">
          <Navigation />
          <main className="container mx-auto px-4 pt-40 pb-20">
            <Card className="bg-card/90 backdrop-blur-sm border-destructive/50 max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <p className="text-center text-destructive text-lg mb-2">Error loading store</p>
                <p className="text-center text-sm text-muted-foreground">
                  {webstoreError?.message || categoriesError?.message}
                </p>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Please check that your store URL is configured correctly in src/config/site.ts
                </p>
              </CardContent>
            </Card>
          </main>
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
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                <span className="text-neon-cyan">Haven</span>
                <span className="text-neon-magenta">RP </span>
                <span className="text-foreground">Store</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Support the server and unlock exclusive perks
              </p>
              {webstore && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>
                    Visit our <a href={`https://${siteConfig.tebexStorefrontUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">online store</a>
                  </span>
                  <Badge variant="outline" className="ml-2">
                    {webstore.account.currency.symbol} {webstore.account.currency.iso}
                  </Badge>
                </div>
              )}
            </div>

            {/* Categories & Packages */}
            {categories && categories.length > 0 ? (
              <Tabs
                value={selectedCategory?.toString()}
                onValueChange={(value) => setSelectedCategory(parseInt(value))}
                className="w-full"
              >
                <div className="flex justify-center mb-8">
                  <TabsList className="bg-card/90 backdrop-blur-sm border border-primary/30 p-1">
                    {categories
                      .filter((cat) => cat.packages.length > 0)
                      .map((category) => (
                        <TabsTrigger
                          key={category.id}
                          value={category.id.toString()}
                          className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                        >
                          {category.name}
                        </TabsTrigger>
                      ))}
                  </TabsList>
                </div>

                {categories
                  .filter((cat) => cat.packages.length > 0)
                  .map((category) => (
                    <TabsContent key={category.id} value={category.id.toString()} className="mt-0">
                      {category.packages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {category.packages.map((pkg) => renderPackage(pkg))}
                        </div>
                      ) : (
                        <Card className="bg-card/90 backdrop-blur-sm border-primary/30">
                          <CardContent className="pt-6 text-center py-12">
                            <p className="text-muted-foreground">No packages available in this category.</p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  ))}
              </Tabs>
            ) : (
              <Card className="bg-card/90 backdrop-blur-sm border-primary/30">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted-foreground">No store categories available at this time.</p>
                </CardContent>
              </Card>
            )}

            {/* Visit Webstore Button */}
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                className="border-primary/50 text-primary hover:bg-primary/10"
                asChild
              >
                <a
                  href={`https://${siteConfig.tebexStorefrontUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Full Webstore
                </a>
                                  </Button>
                                </div>
                              </div>
        </main>

        <Footer />
      </div>
      </div>
  );
};

export default Store;
