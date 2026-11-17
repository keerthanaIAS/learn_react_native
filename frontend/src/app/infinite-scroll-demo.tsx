
import { useState } from 'react';

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import ScreenBackground from '@/components/ScreenBackground';

const allProducts = Array.from(
  { length: 100 },
  (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: (index + 1) * 100,
  })
);

const PAGE_SIZE = 10;

export default function InfiniteScrollDemo() {

  const [products, setProducts] = useState(
    allProducts.slice(0, PAGE_SIZE)
  );

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {

    if (loading || !hasMore) return;

    setLoading(true);

    try {

      // Simulate API request
      await new Promise(resolve =>
        setTimeout(resolve, 1500)
      );

      const startIndex = page * PAGE_SIZE;

      const newProducts = allProducts.slice(
        startIndex,
        startIndex + PAGE_SIZE
      );

      if (newProducts.length === 0) {
        setHasMore(false);
        return;
      }

      // Add new products at the bottom
      setProducts(previous => [
        ...previous,
        ...newProducts,
      ]);

      setPage(previous => previous + 1);

      if (startIndex + PAGE_SIZE >= allProducts.length) {
        setHasMore(false);
      }

    } catch (error) {
      console.log('Load More Error:', error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>

        <Text style={styles.heading}>
          Infinite Scroll Products
        </Text>

        <Text style={styles.count}>
          Total Products: {products.length}
        </Text>

        <FlatList
          data={products}

          keyExtractor={(item) => item.id.toString()}

          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.price}>
                Price: ₹{item.price}
              </Text>
            </View>
          )}

          onEndReached={loadMore}

          onEndReachedThreshold={0.5}

          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                color="white"
              />
            ) : undefined
          }
        />

      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    gap: 12,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  count: {
    color: '#fff',
    fontSize: 16,
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 12,
    borderRadius: 8,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  price: {
    fontSize: 16,
    color: '#2196F3',
    marginTop: 5,
  },

});
