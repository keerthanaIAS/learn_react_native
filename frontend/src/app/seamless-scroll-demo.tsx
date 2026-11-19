
import { useState } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import ScreenBackground from '@/components/ScreenBackground';

type Post = {
  id: number;
  title: string;
  description: string;
};

const allPosts: Post[] = Array.from(
  { length: 100 },
  (_, index) => ({
    id: index + 1,
    title: `Instagram Post ${index + 1}`,
    description: `Enjoying my day! Post number ${index + 1}`,
  })
);

const PAGE_SIZE = 10;

export default function SeamlessScrollDemo() {

  const [posts, setPosts] = useState(
    allPosts.slice(0, PAGE_SIZE)
  );

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);

  const loadMorePosts = async () => {

    if (loading || !hasMore) return;

    setLoading(true);

    try {

      // Simulate API response delay
      await new Promise(resolve =>
        setTimeout(resolve, 1000)
      );

      const startIndex = page * PAGE_SIZE;

      const newPosts = allPosts.slice(
        startIndex,
        startIndex + PAGE_SIZE
      );

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      // Append new posts
      setPosts(previous => [
        ...previous,
        ...newPosts,
      ]);

      setPage(previous => previous + 1);

      if (startIndex + PAGE_SIZE >= allPosts.length) {
        setHasMore(false);
      }

    } catch (error) {
      console.log('Post loading error:', error);

    } finally {
      setLoading(false);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>

      <View style={styles.user}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </View>

        <Text style={styles.username}>user_{item.id}</Text>
      </View>

      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>
          Post {item.id}
        </Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.actions}>
          ♡     ♡     ↗
        </Text>

        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.description}>
          {item.description}
        </Text>
      </View>

    </View>
  );

  return (
    <ScreenBackground>
      <View style={styles.container}>

        <Text style={styles.heading}>
          Instagram Feed Demo
        </Text>

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}

          onEndReached={loadMorePosts}
          onEndReachedThreshold={1}

          showsVerticalScrollIndicator={false}

          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={7}
        />
        {/* windowSize – controls the rendering window.
        initialNumToRender – controls initial rendering.      
        maxToRenderPerBatch – controls batch rendering.
        getItemLayout – avoids dynamic layout measurement for fixed-size items.
        onEndReachedThreshold – controls when pagination starts.
         */}

      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },

  post: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },

  user: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },

  username: {
    fontWeight: 'bold',
  },

  imagePlaceholder: {
    height: 220,
    backgroundColor: '#DCE8F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#208AEF',
  },

  details: {
    padding: 12,
    gap: 8,
  },

  actions: {
    fontSize: 22,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  description: {
    color: '#555',
  },

});
