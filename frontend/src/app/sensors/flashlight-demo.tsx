import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function FlashlightDemo() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isOn, setIsOn] = useState(false);

  if (!permission) return <View style={styles.container}><Text>Loading...</Text></View>;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Camera Permission Needed</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Flashlight</Text>

      <View style={[styles.circle, isOn && styles.circleOn]}>
        <Text style={styles.icon}>{isOn ? '💡' : '🔌'}</Text>
        <Text style={styles.status}>{isOn ? 'ON' : 'OFF'}</Text>
      </View>

      {/* CameraView is required to control the torch — it can be invisible */}
      <CameraView 
        style={styles.hiddenCamera} // invisible (1x1 px)
        facing="back"  // rear camera
        enableTorch={isOn}  // true = LED on, false = off
      />

      <Pressable
        style={[styles.button, isOn && styles.buttonOff]}
        onPress={() => setIsOn(!isOn)}
      >
        <Text style={styles.buttonText}>
          {isOn ? '⏹ Turn OFF' : '💡 Turn ON'}
        </Text>
      </Pressable>

      <Text style={styles.hint}>
        Controls the rear camera's LED flash as a torch.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F2F5FA', justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  circle: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 6, borderColor: '#cbd5e1',
    marginBottom: 30,
  },
  circleOn: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.8,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  icon: { fontSize: 60 },
  status: { fontSize: 18, fontWeight: 'bold', marginTop: 8, color: '#333' },
  button: { backgroundColor: '#2563EB', padding: 16, borderRadius: 10, width: '100%', marginTop: 10 },
  buttonOff: { backgroundColor: '#DC2626' },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  hint: { color: '#666', fontSize: 12, marginTop: 20, textAlign: 'center' },
  hiddenCamera: { width: 1, height: 1, opacity: 0, position: 'absolute' },
});