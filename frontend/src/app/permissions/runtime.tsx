
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Contacts from "expo-contacts";
import { requestRecordingPermissionsAsync } from "expo-audio";

export default function RuntimePermissions() {
  const [results, setResults] = useState<Record<string, string>>({});

  const updateResult = (name: string, status: string) => {
    setResults((prev) => ({
      ...prev,
      [name]: status,
    }));
  };

  const requestPermission = async (
    name: string,
    request: () => Promise<any>
  ) => {
    try {
      const result = await request();

      const status = result.granted
        ? "Granted"
        : result.canAskAgain
        ? "Denied"
        : "Denied permanently / Settings required";

      updateResult(name, status);

      if (!result.granted) {
        Alert.alert("Permission", status);
      }
    } catch (error) {
      updateResult(name, "Error requesting permission");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Runtime Permissions</Text>

      <Text style={styles.description}>
        Request permission from the mobile operating system.
      </Text>

      {[
        {
          name: "Camera",
          request: () => ImagePicker.requestCameraPermissionsAsync(),
        },
        {
          name: "Gallery",
          request: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
        },
        {
          name: "Location",
          request: () => Location.requestForegroundPermissionsAsync(),
        },
        {
          name: "Contacts",
          request: () => Contacts.requestPermissionsAsync(),
        },
        {
          name: "Microphone",
          request: () => requestRecordingPermissionsAsync(),
        },
      ].map((item) => (
        <View style={styles.card} key={item.name}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.status}>
              {results[item.name] || "Not requested"}
            </Text>
          </View>

          <Pressable
            style={styles.button}
            onPress={() =>
              requestPermission(item.name, item.request)
            }
          >
            <Text style={styles.buttonText}>Request</Text>
          </Pressable>
        </View>
      ))}
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
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: "gray",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    marginTop: 5,
    color: "#555",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
