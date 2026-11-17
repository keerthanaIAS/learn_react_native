
import { useEffect, useState } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationDemo() {
  const [permission, setPermission] = useState("Not requested");
  const [scheduledId, setScheduledId] = useState<string | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const settings =
      await Notifications.getPermissionsAsync();

    setPermission(settings.status);
  };

  const requestPermission = async () => {
    const result =
      await Notifications.requestPermissionsAsync();

    setPermission(result.status);

    if (!result.granted) {
      Alert.alert(
        "Permission Required",
        "Enable notifications in your device settings."
      );
    }
  };

  const sendInstantNotification = async () => {
    const settings = await Notifications.getPermissionsAsync();

    if (!settings.granted) {
      Alert.alert("Please enable notification permission first.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hello React Native!",
        body: "Your instant notification is working.",
        sound: "default",
      },
      trigger: null,
    });

    Alert.alert("Success", "Notification sent.");
  };

  const scheduleNotification = async () => {
    const settings = await Notifications.getPermissionsAsync();

    if (!settings.granted) {
      Alert.alert("Please enable notification permission first.");
      return;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: "This is your scheduled notification.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
      },
    });

    setScheduledId(id);

    Alert.alert("Scheduled", "Notification will appear in 10 seconds.");
  };

  const cancelNotification = async () => {
    if (!scheduledId) {
      Alert.alert("No scheduled notification to cancel.");
      return;
    }

    await Notifications.cancelScheduledNotificationAsync(
      scheduledId
    );

    setScheduledId(null);

    Alert.alert("Cancelled", "Scheduled notification cancelled.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notification Demo</Text>

      <Text style={styles.status}>
        Permission Status: {permission}
      </Text>

      <Pressable style={styles.button} onPress={requestPermission}>
        <Text style={styles.buttonText}>
          Request Notification Permission
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "#16A34A" }]}
        onPress={sendInstantNotification}
      >
        <Text style={styles.buttonText}>
          Send Instant Notification
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "#7C3AED" }]}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>
          Schedule Notification (10 Seconds)
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "#DC2626" }]}
        onPress={cancelNotification}
      >
        <Text style={styles.buttonText}>
          Cancel Scheduled Notification
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  status: {
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
