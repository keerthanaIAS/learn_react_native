
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
} from "react-native";

export default function MapsDemo() {
  const latitude = 11.9416;
  const longitude = 79.8083;

  const openMap = () => {
    Linking.openURL(
      `https://www.google.com/maps?q=${latitude},${longitude}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Maps Demo</Text>

      <Text style={styles.location}>
        Location: Puducherry
      </Text>

      <Text>Latitude: {latitude}</Text>
      <Text>Longitude: {longitude}</Text>

      <Pressable style={styles.button} onPress={openMap}>
        <Text style={styles.buttonText}>
          Open Google Maps
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  location: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
