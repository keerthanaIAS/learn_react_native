
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

// Configure foreground notification display
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permission
export const requestNotificationPermission = async () => {
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
      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission denied', 'Enable notifications in settings.');
      return false;
    }

    Alert.alert('Success', 'Notification permission granted!');
    console.log('Notification permission granted');

    return true;
  } catch (error) {
    console.error('Permission error:', error);
    Alert.alert('Error', 'Could not request notification permission.');
    return false;
  }
};

// Instant notification
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

// Notification after 5 seconds
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
