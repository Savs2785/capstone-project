import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const FilterComponent = ({ selectedCategories, onCategoryChange, categories }) => {
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filter by Category</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategories.includes(item) && styles.selectedCategory
            ]}
            onPress={() => toggleCategory(item)}
          >
            <Text style={styles.categoryButtonText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  selectedCategory: {
    backgroundColor: '#007bff',
  },
  categoryButtonText: {
    color: '#fff',
  },
});

export default FilterComponent;
