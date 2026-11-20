//  Stack is controlling the screen navigation and the header at the top. Expo Router automatically provides a Back arrow.
import { Stack, router } from 'expo-router';
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
} from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import './config/reactotron';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

Sentry.init({
  dsn: 'https://382f841f341f3c09b3ec0267aed3dcfc@o4512456913715200.ingest.us.sentry.io/4512456913911808',

  sendDefaultPii: false,
  enableLogs: true,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,

  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

function WebHeader() {
  return (
    <View style={styles.navbar}>
      <Text style={styles.logo}>Student Management</Text>

      <View style={styles.links}>
        <Pressable onPress={() => router.replace('/')}>
          <Text style={styles.link}>Home</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/students')}>
          <Text style={styles.link}>Students</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/permissions")}>
          <Text style={styles.link}>Explore Device Features</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/drawer-demo")}>
          <Text style={styles.link}>Drawer Demo</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/otp-demo")}
        >
          <Text style={styles.link}>OTP Verification Demo</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log('Notification tapped with data:', data);

        if (data?.screen === 'students' && data?.studentId) {
          router.push(`/students/${data.studentId}` as any);
        } else if (data?.screen === 'students') {
          router.push('/students' as any);
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            header: isWeb
              ? () => <WebHeader />
              : undefined,

            headerStyle: {
              backgroundColor: '#208AEF',
            },
            headerTintColor: '#fff',
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="students/index" options={{ title: 'Students' }} />
          <Stack.Screen name="students/add" options={{ title: 'Add Student' }} />
          <Stack.Screen name="students/[id]" options={{ title: 'Student Details' }} />
          <Stack.Screen name="students/edit/[id]" options={{ title: 'Edit Student' }} />
          <Stack.Screen
            name="drawer-demo"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        {!isWeb && <BottomNavigation />}
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 65,
    backgroundColor: '#208AEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  logo: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    gap: 25,
  },
  link: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});