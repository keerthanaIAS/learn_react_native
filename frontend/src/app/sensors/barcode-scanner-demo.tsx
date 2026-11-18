import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function BarcodeScannerDemo() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<{ data: string; type: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

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

  if (isScanning) {
    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{
            // ALL barcode types — QR + product barcodes
            barcodeTypes: [
              'qr',
              'ean13', 'ean8',        // supermarket products
              'upc_a', 'upc_e',       // US products
              'code128', 'code39',    // shipping labels
              'code93', 'codabar',
              'itf14', 'pdf417',
              'aztec', 'datamatrix',
            ],
          }}
          onBarcodeScanned={({ data, type }) => {
            setScanned({ data, type });
            setIsScanning(false);
          }}
        />

        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanHint}>Point at any barcode</Text>
        </View>

        <Pressable style={styles.closeButton} onPress={() => setIsScanning(false)}>
          <Text style={styles.buttonText}>✕ Close</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Barcode Scanner</Text>

      {scanned ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Scanned</Text>
          <Text style={styles.resultText}>{scanned.data}</Text>
          <Text style={styles.resultType}>Type: {scanned.type}</Text>
        </View>
      ) : (
        <Text style={styles.hint}>No barcode scanned yet</Text>
      )}

      <Pressable
        style={styles.button}
        onPress={() => { setScanned(null); setIsScanning(true); }}
      >
        <Text style={styles.buttonText}>📷 Scan Barcode</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F2F5FA', justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#2563EB', padding: 16, borderRadius: 10, marginTop: 15 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  hint: { color: '#666', textAlign: 'center', marginBottom: 10 },
  resultCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  resultLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  resultText: { fontSize: 18, fontWeight: 'bold' },
  resultType: { fontSize: 12, color: '#2563EB', marginTop: 8 },
  scannerContainer: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 280, height: 180, borderWidth: 3, borderColor: '#2563EB', borderRadius: 12 },
  scanHint: { color: 'white', fontSize: 16, marginTop: 20, fontWeight: '600' },
  closeButton: {
    position: 'absolute', bottom: 40, left: 20, right: 20,
    backgroundColor: '#DC2626', padding: 16, borderRadius: 10,
  },
});