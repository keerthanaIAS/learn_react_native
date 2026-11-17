
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Help & Support
      </Text>

      <Pressable
        style={styles.card}
        onPress={() =>
          Alert.alert("Help", "This is the FAQ section.")
        }
      >
        <Ionicons name="help-circle-outline" size={24} color="#208AEF" />
        <Text style={styles.label}>Frequently Asked Questions</Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() =>
          Alert.alert("Support", "Contact support for assistance.")
        }
      >
        <Ionicons name="headset-outline" size={24} color="#208AEF" />
        <Text style={styles.label}>Contact Support</Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() =>
          Alert.alert("About", "React Native Drawer Demo")
        }
      >
        <Ionicons name="information-circle-outline" size={24} color="#208AEF" />
        <Text style={styles.label}>About Application</Text>
      </Pressable>
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
    alignItems: "center",
    gap: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
});
