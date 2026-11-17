
import { useState } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";

type SelectedFile = {
  name: string;
  uri: string;
  size?: number;
  mimeType?: string | null;
};

export default function FileDemo() {
  const [file, setFile] = useState<SelectedFile | null>(null);

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        const selected = result.assets[0];

        setFile({
          name: selected.name,
          uri: selected.uri,
          size: selected.size,
          mimeType: selected.mimeType,
        });

        Alert.alert("Success", "File selected successfully!");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to select file.");
    }
  };

  const formatSize = (bytes?: number) => {
    if (bytes === undefined) return "Unknown";

    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Document Picker</Text>

      <Text style={styles.description}>
        Select PDF, Word or Text documents from your device.
      </Text>

      <Pressable style={styles.button} onPress={selectFile}>
        <Text style={styles.buttonText}>Choose Document</Text>
      </Pressable>

      {file && (
        <View style={styles.card}>
          <Text style={styles.title}>Selected File Details</Text>

          <Text style={styles.detail}>Name: {file.name}</Text>

          <Text style={styles.detail}>
            Size: {formatSize(file.size)}
          </Text>

          <Text style={styles.detail}>
            Type: {file.mimeType || "Unknown"}
          </Text>

          <Text style={styles.detail}>
            URI: {file.uri}
          </Text>

          <Pressable
            style={styles.removeButton}
            onPress={() => setFile(null)}
          >
            <Text style={styles.buttonText}>Remove File</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
  },
  description: {
    marginTop: 10,
    color: "gray",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    marginTop: 25,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#F3F4F6",
    padding: 15,
    marginTop: 25,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  detail: {
    marginBottom: 12,
    color: "#333",
  },
  removeButton: {
    backgroundColor: "#DC2626",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
});
