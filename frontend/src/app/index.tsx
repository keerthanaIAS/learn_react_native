import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '@/components/ScreenBackground';

type DemoItem = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
};

const categories: {
  title: string;
  items: DemoItem[];
}[] = [
  {
    title: 'Student Management',
    items: [
      {
        title: 'View Students',
        subtitle: 'List all students',
        icon: 'people-outline',
        route: '/students',
        color: '#208AEF',
      },
      {
        title: 'Add Student',
        subtitle: 'Create new record',
        icon: 'person-add-outline',
        route: '/students/add',
        color: '#4CAF50',
      },
    ],
  },
  {
    title: 'React Native Demos',
    items: [
      {
        title: 'AsyncStorage',
        subtitle: 'Local storage',
        icon: 'save-outline',
        route: '/storage-demo',
        color: '#FF9800',
      },
      {
        title: 'Pull to Refresh',
        subtitle: 'Reload list',
        icon: 'refresh-outline',
        route: '/refresh-demo',
        color: '#9C27B0',
      },
      {
        title: 'Chat Demo',
        subtitle: 'Reverse pagination',
        icon: 'chatbubbles-outline',
        route: '/chat-demo',
        color: '#00BCD4',
      },
      {
        title: 'Infinite Scroll',
        subtitle: 'Load more',
        icon: 'infinite-outline',
        route: '/infinite-scroll-demo',
        color: '#E91E63',
      },
      {
        title: 'Seamless Scroll',
        subtitle: 'Instagram style',
        icon: 'images-outline',
        route: '/seamless-scroll-demo',
        color: '#3F51B5',
      },
      {
        title: 'Section List',
        subtitle: 'Grouped data',
        icon: 'list-outline',
        route: '/section-list-demo',
        color: '#795548',
      },
      {
        title: 'Keyboard',
        subtitle: 'Avoid input overlap',
        icon: 'keypad-outline',
        route: '/keyboard-demo',
        color: '#607D8B',
      },
      {
        title: 'Modal',
        subtitle: 'Popup screens',
        icon: 'albums-outline',
        route: '/modal-demo',
        color: '#FF5722',
      },
      {
        title: 'Swipeable',
        subtitle: 'Swipe actions',
        icon: 'swap-horizontal-outline',
        route: '/swipeable-demo',
        color: '#CDDC39',
      },
      {
        title: 'Search + Filter',
        subtitle: 'Pagination demo',
        icon: 'search-outline',
        route: '/search-filter-pagination',
        color: '#009688',
      },
      {
        title: 'Biometric Auth',
        subtitle: 'Fingerprint/Face ID demo',
        icon: 'finger-print-outline',
        route: '/auth/biometric-demo',
        color: '#9C27B0',
      }
    ],
  },
];

export default function HomeScreen() {
  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>Student Management</Text>

        {categories.map((category) => (
          <View key={category.title} style={styles.categoryBlock}>
            <Text style={styles.categoryTitle}>{category.title}</Text>

            <View style={styles.grid}>
              {category.items.map((item) => (
                <Pressable
                  key={item.route}
                  style={({ pressed }) => [
                    styles.card,
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => router.push(item.route as any)}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: item.color + '22' },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={item.color}
                    />
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fcf9f9',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 22,
  },
  categoryBlock: {
    marginBottom: 22,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    opacity: 0.95,
    letterSpacing: 0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    padding: 12,
    gap: 6,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#666',
  },
});