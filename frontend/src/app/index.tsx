import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '@/components/ScreenBackground';
import * as Sentry from '@sentry/react-native';
import Reactotron from './config/reactotron';
import {
  requestNotificationPermission,
  sendInstantNotification,
  scheduleTestNotification,
} from './notification-test';

type DemoItem = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  // action?: () => void;
};

const testSentry = () => {
  Sentry.captureException(
    new Error('First Sentry Test Error')
  );

  Alert.alert(
    'Sentry Test',
    'Test error submitted. Check your Sentry dashboard.'
  );
};

const testReactotron = () => {
  Reactotron.log('Reactotron test successful!');

  Reactotron.display({
    name: 'Reactotron Test',
    value: {
      message: 'Reactotron is connected!',
      timestamp: new Date().toISOString(),
    },
    preview: 'Testing Reactotron connection',
  });

  Alert.alert(
    'Reactotron Test',
    'Test log sent. Check Reactotron desktop.'
  );
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
        },
        {
          title: 'Device Status',
          subtitle: 'Device Status Demo',
          icon: 'phone-portrait-outline',
          route: '/sensors/device-status-demo',
          color: '#235adc',
        },
        {
          title: 'Vibration & Device Info',
          subtitle: 'Haptics and device information',
          icon: 'phone-portrait-sharp',
          route: '/sensors/vibration-device-demo',
          color: '#ec7b46',
        },
        {
          title: 'Motion Sensors',
          subtitle: 'Accelerometer and Gyroscope',
          icon: 'speedometer-outline',
          route: '/sensors/motion-sensors-demo',
          color: '#fd56f2',
        },
        {
          title: 'Fitness',
          subtitle: 'Step counter and tracking',
          icon: 'walk-outline',
          route: '/sensors/fitness-demo',
          color: '#3c6e6a',
        },
        {
          title: 'Flashlight',
          subtitle: 'LED flash control',
          icon: 'flash-outline',
          route: '/sensors/flashlight-demo',
          color: '#d54747',
        },
        {
          title: 'Barcode Scanner',
          subtitle: 'Scan barcodes and QR codes',
          icon: 'qr-code-outline',
          route: '/sensors/barcode-scanner-demo',
          color: '#47b853',
        },
        {
          title: 'File Mega Demo',
          subtitle: 'Download, Compress, Upload, Share',
          icon: 'document-attach-outline',
          route: '/files/file-mega-demo',
          color: '#E91E63',
        },
      ],
    },
    // {
    //   title: 'Notification Testing',
    //   items: [
    //     {
    //       title: 'Request Permission',
    //       subtitle: 'Enable notifications',
    //       icon: 'notifications-outline',
    //       route: '/notification-demo',
    //       color: '#FF9800',
    //     },
    //     {
    //       title: 'Instant Notification',
    //       subtitle: 'Send notification now',
    //       icon: 'notifications',
    //       route: '/notification-demo',
    //       color: '#4CAF50',
    //     },
    //     {
    //       title: 'Schedule Notification',
    //       subtitle: 'Send after 5 seconds',
    //       icon: 'alarm-outline',
    //       route: '/notification-demo',
    //       color: '#9C27B0',
    //     },
    //   ],
    // },
  ];

export default function HomeScreen() {
  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>Student Management</Text>
        <View style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>
            Debugging Tools
          </Text>

          <View style={styles.grid}>
            <Pressable
              style={[styles.card, { width: '48%' }]}
              onPress={testSentry}
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="bug-outline"
                  size={22}
                  color="#E53935"
                />
              </View>

              <Text style={styles.cardTitle}>
                Test Sentry
              </Text>

              <Text style={styles.cardSubtitle}>
                Send test error
              </Text>
            </Pressable>

            <Pressable
              style={[styles.card, { width: '48%' }]}
              onPress={testReactotron}
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="terminal-outline"
                  size={22}
                  color="#208AEF"
                />
              </View>

              <Text style={styles.cardTitle}>
                Test Reactotron
              </Text>

              <Text style={styles.cardSubtitle}>
                Send test logs
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>
            Notification Testing
          </Text>

          <View style={styles.grid}>

            {/* Permission */}
            <Pressable
              style={styles.card}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.alert('Not supported. Test Expo notifications on Android or iOS.');
                  return;
                }

                requestNotificationPermission();
              }}
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#FF9800"
                />
              </View>

              <Text style={styles.cardTitle}>
                Request Permission
              </Text>

              <Text style={styles.cardSubtitle}>
                Enable notifications
              </Text>
            </Pressable>

            {/* Instant Notification */}
            <Pressable
              style={styles.card}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.alert('Not supported. Test Expo notifications on Android or iOS.');
                  return;
                }

                sendInstantNotification();
              }}
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="notifications"
                  size={22}
                  color="#4CAF50"
                />
              </View>

              <Text style={styles.cardTitle}>
                Instant Notification
              </Text>

              <Text style={styles.cardSubtitle}>
                Send notification now
              </Text>
            </Pressable>

            {/* Scheduled Notification */}
            <Pressable
              style={styles.card}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.alert('Not supported. Test Expo notifications on Android or iOS.');
                  return;
                }

                scheduleTestNotification();
              }}
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="alarm-outline"
                  size={22}
                  color="#9C27B0"
                />
              </View>

              <Text style={styles.cardTitle}>
                Schedule Notification
              </Text>

              <Text style={styles.cardSubtitle}>
                Send after 5 seconds
              </Text>
            </Pressable>

          </View>
        </View>

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
                // onPress={() => {
                //   if (item.action) {
                //     item.action();
                //   } else {
                //     router.push(item.route as any);
                //   }
                // }}
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