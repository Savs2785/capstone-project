// utils/sortUtils.js

export const sortProducts = (products, criteria) => {
    switch (criteria) {
      case 'priceLowToHigh':
        return [...products].sort((a, b) => a.price - b.price);
      case 'priceHighToLow':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name':
      default:
        return [...products].sort((a, b) => a.productName.localeCompare(b.productName));
    }
  };
  