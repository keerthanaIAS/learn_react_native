
import {
  View,
  Text,
  StyleSheet,
  Switch,
} from "react-native";

import { useState } from "react";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Application Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Notifications</Text>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Dark Mode</Text>

        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});
