
import { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CameraDemo() {
  const [photo, setPhoto] = useState<string | null>(null);

  const takePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Camera Demo</Text>

      <Pressable style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </Pressable>

      {photo && (
        <Image source={{ uri: photo }} style={styles.image} />
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
  image: {
    width: "100%",
    height: 300,
    marginTop: 20,
    borderRadius: 12,
  },
});
