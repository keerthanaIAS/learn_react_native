
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={50} color="#208AEF" />
      </View>

      <Text style={styles.name}>Demo User</Text>

      <Text style={styles.email}>
        demo@example.com
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>Demo User</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>demo@example.com</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>Administrator</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  name: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 15,
  },
  email: {
    color: "gray",
    marginTop: 5,
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
  },
  label: {
    color: "gray",
    marginTop: 15,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
});
