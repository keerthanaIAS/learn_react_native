
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

import {
  useAudioRecorder,
  useAudioRecorderState,
  useAudioPlayer,
  RecordingPresets,
  requestRecordingPermissionsAsync,
} from "expo-audio";

export default function MicrophoneDemo() {
  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  const recorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY
  );

  const recorderState = useAudioRecorderState(recorder);

  const player = useAudioPlayer(recordedUri);

  const startRecording = async () => {
    try {
      const permission =
        await requestRecordingPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Denied",
          "Microphone permission is required."
        );
        return;
      }

      await recorder.prepareToRecordAsync();
      recorder.record();

      setRecordedUri(null);

      Alert.alert("Recording", "Audio recording started.");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to start recording.");
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();

      const uri = recorder.uri;

      if (uri) {
        setRecordedUri(uri);
        Alert.alert("Success", "Recording saved successfully.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to stop recording.");
    }
  };

  const playRecording = async () => {
    if (!recordedUri) {
      Alert.alert("No Recording", "Record audio first.");
      return;
    }

    await player.seekTo(0);
    player.play();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Voice Recorder</Text>

      <Text style={styles.status}>
        {recorderState.isRecording
          ? "Recording in progress..."
          : "Not Recording"}
      </Text>

      <Text style={styles.duration}>
        Duration: {Math.floor(recorderState.durationMillis / 1000)} seconds
      </Text>

      <Pressable
        style={[styles.button, { backgroundColor: "#16A34A" }]}
        onPress={startRecording}
        disabled={recorderState.isRecording}
      >
        <Text style={styles.buttonText}>Start Recording</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "#DC2626" }]}
        onPress={stopRecording}
        disabled={!recorderState.isRecording}
      >
        <Text style={styles.buttonText}>Stop Recording</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "#2563EB" }]}
        onPress={playRecording}
        disabled={!recordedUri}
      >
        <Text style={styles.buttonText}>Play Recording</Text>
      </Pressable>

      {recordedUri && (
        <Text style={styles.uri}>
          Recording URI: {recordedUri}
        </Text>
      )}
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
    fontSize: 18,
    color: "#16A34A",
    marginBottom: 10,
  },
  duration: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  uri: {
    marginTop: 15,
    color: "#555",
  },
});
