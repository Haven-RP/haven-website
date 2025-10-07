import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Store = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        setLoading(true);

        // Header Authorization example for Tebex API Key
        const headers = {
          "X-Tebex-Secret": process.env.VITE_TEBEX_API_KEY, // Replace with your Tebex API key
        };

        // Fetch categories
        const categoryResponse = await fetch(
            "https://plugin.tebex.io/categories",
            { headers }
        );
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoryData = await categoryResponse.json();

        // Fetch products for each category
        const categoriesWithProducts = await Promise.all(
            categoryData.map(async (category: any) => {
              const productResponse = await fetch(
                  `https://plugin.tebex.io/category/${category.id}`,
                  { headers }
              );
              if (!productResponse.ok) {
                throw new Error(`Failed to fetch products for category ${category.id}`);
              }
              const products = await productResponse.json();
              return {
                ...category,
                products,
              };
            })
        );

        setCategories(categoriesWithProducts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100">
        <Navigation />
        <main className="container mx-auto py-12">
          <h1 className="text-3xl font-bold mb-8">Store</h1>
          {categories.length === 0 ? (
              <p>No categories available.</p>
          ) : (
              categories.map((category) => (
                  <section key={category.id} className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                    {category.products.length === 0 ? (
                        <p>No products available in this category.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {category.products.map((product: any) => (
                              <div
                                  key={product.id}
                                  className="p-6 bg-black/50 border border-white rounded-lg shadow-md"
                              >
                                <h3 className="text-xl font-semibold">{product.name}</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                  {product.description}
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                  <span className="text-accent font-semibold">{product.price} USD</span>
                                  <Button
                                      onClick={() => {
                                        // On purchase button click (logic to integrate payment here)
                                        alert(`You clicked to buy ${product.name}`);
                                      }}
                                      size="sm"
                                  >
                                    Buy Now
                                  </Button>
                                </div>
                              </div>
                          ))}
                        </div>
                    )}
                  </section>
              ))
          )}
        </main>
        <Footer />
      </div>
  );
};

export default Store;