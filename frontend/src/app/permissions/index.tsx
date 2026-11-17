
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";

const features = [
  { title: "Runtime Permissions", route: "/permissions/runtime" },
  { title: "Camera Permission", route: "/permissions/camera" },
  { title: "Gallery Access", route: "/permissions/gallery" },
  { title: "Location Permission", route: "/permissions/location" },
  { title: "Maps Integration", route: "/permissions/maps" },
  { title: "Microphone Permission", route: "/permissions/microphone" },
  { title: "File Access", route: "/permissions/files" },
  { title: "Contacts Permission", route: "/permissions/contacts" },
  { title: "Notifications", route: "/permissions/notifications" },
];

export default function PermissionsHome() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Device Features</Text>
      <Text style={styles.subtitle}>
        Learn React Native device permissions and features
      </Text>

      {features.map((item) => (
        <Pressable
          key={item.route}
          style={styles.card}
          onPress={() => router.push(item.route as any)}
        >
          <Text style={styles.cardText}>{item.title}</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#E8F0FE",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },
  arrow: {
    fontSize: 20,
  },
});
