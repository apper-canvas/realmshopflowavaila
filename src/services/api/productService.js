import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let products = [...productsData];

export const productService = {
  async getAll() {
    await delay(300);
    return [...products];
  },

  async getById(id) {
    await delay(200);
    const product = products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async getByCategory(category) {
    await delay(250);
    return products.filter(p => p.category === category).map(p => ({ ...p }));
  },

  async searchProducts(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }));
  },

  async getFilteredProducts(filters) {
    await delay(300);
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.subcategory) {
      filtered = filtered.filter(p => p.subcategory === filters.subcategory);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter(p => p.rating >= filters.minRating);
    }

    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }

    if (filters.inStock !== undefined) {
      filtered = filtered.filter(p => p.inStock === filters.inStock);
    }

    return filtered.map(p => ({ ...p }));
  },

  async getFeaturedProducts() {
    await delay(200);
    return products.filter(p => p.rating >= 4.5).slice(0, 6).map(p => ({ ...p }));
  },

  async getRelatedProducts(productId) {
    await delay(250);
    const product = products.find(p => p.Id === parseInt(productId));
    if (!product) return [];
    
    return products
      .filter(p => p.Id !== parseInt(productId) && p.category === product.category)
      .slice(0, 4)
      .map(p => ({ ...p }));
  }
};