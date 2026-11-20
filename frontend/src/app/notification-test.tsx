import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import {
  registerPushToken,
  notifyAllUsers,
  notifyUserByMobile,
} from '../services/notificationApi';

// Configure foreground notification display
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 1. Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    console.log('Checking notification permission...');

    if (Platform.OS === 'web') {
      console.log('Expo Notifications is not supported on web.');
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission denied', 'Enable notifications in settings.');
      return false;
    }

    console.log('Notification permission granted');
    return true;
  } catch (error) {
    console.error('Permission error:', error);
    Alert.alert('Error', 'Could not request notification permission.');
    return false;
  }
};

// 2. Local instant notification
export const sendInstantNotification = async () => {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hello! 👋',
        body: 'Your first Expo local notification!',
        sound: true,
      },
      trigger: null,
    });

    console.log('Instant notification sent');
  } catch (error) {
    console.error('Instant notification error:', error);
  }
};

// 3. Local scheduled notification (after 5 seconds)
export const scheduleTestNotification = async () => {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder 🔔',
        body: 'Your 5-second scheduled notification!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });

    Alert.alert('Scheduled', 'Notification will appear in 5 seconds.');
    console.log('Notification scheduled');
  } catch (error) {
    console.error('Scheduling error:', error);
  }
};

// 4. Get Expo Push Token & register it on backend for the logged-in user
export const registerDeviceForPushNotifications = async (
  mobile: string
): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      console.log('Push notifications are not supported on web.');
      return null;
    }

    if (!Device.isDevice) {
      Alert.alert(
        'Physical Device Required',
        'Push notifications only work on a physical phone.'
      );
      return null;
    }

    const granted = await requestNotificationPermission();
    if (!granted) return null;

    // Fetch EAS projectId if configured in app.json / app.config.js
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    const expoPushToken = tokenResponse.data;
    console.log('Expo Push Token:', expoPushToken);

    // Save token against logged-in mobile number via API service
    await registerPushToken(mobile, expoPushToken);

    return expoPushToken;
  } catch (error) {
    console.error('Push registration error:', error);
    Alert.alert('Error', 'Failed to register push notification token.');
    return null;
  }
};

// 5. Trigger backend broadcast push notification to all logged-in users
export const sendPushToAllUsers = async (
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  try {
    const result = await notifyAllUsers(title, body, data);
    Alert.alert('Broadcast Sent', `Sent to ${result.sentToCount} device(s).`);
    return result;
  } catch (error) {
    console.error('Broadcast push error:', error);
    Alert.alert('Error', 'Failed to send broadcast notification.');
  }
};

// 6. Trigger backend push notification to a specific user by mobile number
export const sendPushToParticularUser = async (
  mobile: string,
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  try {
    const result = await notifyUserByMobile(mobile, title, body, data);
    Alert.alert('Notification Sent', `Push notification sent to ${mobile}.`);
    return result;
  } catch (error) {
    console.error('Individual push error:', error);
    Alert.alert('Error', `Failed to send notification to ${mobile}.`);
  }
};