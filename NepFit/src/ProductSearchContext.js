import { useMemo } from 'react';

export const ProductSearch = (products, searchQuery, selectedCategory) => {
  return useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.categories === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);
};
