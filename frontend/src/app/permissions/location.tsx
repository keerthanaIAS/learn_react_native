
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import * as Location from "expo-location";

export default function LocationDemo() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    try {
      setLoading(true);

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Location permission denied");
        return;
      }

      const current =
        await Location.getCurrentPositionAsync({});

      setLocation(current);
    } catch (error) {
      Alert.alert("Error", "Unable to get location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Current Location</Text>

      <Pressable style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>
          {loading ? "Getting Location..." : "Get My Location"}
        </Text>
      </Pressable>

      {location && (
        <View style={styles.result}>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <Text>Accuracy: {location.coords.accuracy} meters</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 25, fontWeight: "bold" },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "white", textAlign: "center" },
  result: {
    marginTop: 20,
    backgroundColor: "#E8F0FE",
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
});
